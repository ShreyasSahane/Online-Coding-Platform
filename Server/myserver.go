package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("my_secret_key")

var userId = 0

type User struct {
	UserID       int    `json:"user_id"`
	Username     string `json:"username"`
	UserEmail    string `json:"user_email"`
	UserPassword string `json:"user_password"`
}

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Username string `json:"username"`
}

type Claims struct {
	UserID int    `json:"user_id"`
	Email  string `json:"email"`
	jwt.StandardClaims
}

var db *sql.DB

func init() {
	var err error
	connStr := "user=shreyas password=shreyas2 dbname=coding_platform sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatalf("Unable to reach database: %v\n", err)
	}
	fmt.Println("Connected to database successfully!")
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("LoginHandler invoked")
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	var user User
	err = db.QueryRow("SELECT user_id, user_email, user_password FROM users WHERE user_email=$1", creds.Email).
		Scan(&user.UserID, &user.UserEmail, &user.UserPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusUnauthorized)
		} else {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return
	}

	// Compare hashed password with the provided password
	if err := bcrypt.CompareHashAndPassword([]byte(user.UserPassword), []byte(creds.Password)); err != nil {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(1 * time.Hour)
	claims := &Claims{
		UserID: user.UserID,
		Email:  user.UserEmail,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Could not generate token", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"token":  tokenString,
		"userID": user.UserID,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("SignupHandler invoked")

	if r.Method != http.MethodPost {
		log.Println("Invalid request method")
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var newUser User
	if err := json.NewDecoder(r.Body).Decode(&newUser); err != nil {
		log.Printf("Error decoding request body: %v\n", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Printf("Received new user: %+v\n", newUser)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.UserPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v\n", err)
		http.Error(w, "Error creating account", http.StatusInternalServerError)
		return
	}

	log.Printf("Hashed password: %s\n", hashedPassword)

	_, err = db.Exec("INSERT INTO users (username, user_email, user_password) VALUES ($1, $2, $3)",
		newUser.Username, newUser.UserEmail, hashedPassword)
	if err != nil {
		log.Printf("Database error: %v\n", err)
		http.Error(w, "Error creating account", http.StatusInternalServerError)
		return
	}

	log.Println("New user inserted successfully")

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
}

func ForgotPasswordHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("ForgotPasswordHandler invoked")

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var request struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Printf("Received forgot password request for email: %s\n", request.Email)

	var exists bool
	err := db.QueryRow("SELECT EXISTS (SELECT 1 FROM users WHERE user_email=$1)", request.Email).Scan(&exists)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if !exists {
		http.Error(w, "Email does not exist", http.StatusNotFound)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error updating password", http.StatusInternalServerError)
		return
	}

	_, err = db.Exec("UPDATE users SET user_password=$1 WHERE user_email=$2", hashedPassword, request.Email)
	if err != nil {
		http.Error(w, "Error updating password", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Password updated successfully"})
}

func ProblemsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	log.Println("Attempting to fetch problems from the database...")
	rows, err := db.Query("SELECT que_id, que_title, que_tags, que_level FROM questions")
	if err != nil {
		log.Printf("Database query error: %v\n", err)
		http.Error(w, "Failed to fetch problems", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var problems []map[string]interface{}
	for rows.Next() {
		var que_id int
		var que_title, que_tags, que_level string
		if err := rows.Scan(&que_id, &que_title, &que_tags, &que_level); err != nil {
			log.Printf("Row scan error: %v\n", err)
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}
		problems = append(problems, map[string]interface{}{
			"id":    que_id,
			"title": que_title,
			"tags":  que_tags,
			"level": que_level,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(problems)
}

// FetchPredefinedCodeHandler fetches the predefined code for a specific problem and language

func ProblemDetailsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Extract que_id from the URL path (example: /problem-details/1)
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 3 {
		http.Error(w, "Problem ID not provided", http.StatusBadRequest)
		return
	}
	queID := parts[2] // Extract que_id from URL path

	// Parse the Authorization header to ensure the token is valid
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header missing", http.StatusUnauthorized)
		return
	}

	// Remove "Bearer " prefix from the token
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		http.Error(w, "Malformed token", http.StatusUnauthorized)
		return
	}

	// Parse and validate the token
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil || !token.Valid {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	// Proceed to fetch problem details using queID (which is now extracted from the URL path)
	var problem struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Tags        string `json:"tags"`
		Level       string `json:"level"`
		TestCases   []struct {
			Input  string `json:"input"`
			Output string `json:"output"`
		} `json:"test_cases"`
	}

	// Query the database for the problem details
	err = db.QueryRow("SELECT que_title, que_desc, que_tags, que_level FROM questions WHERE que_id = $1", queID).
		Scan(&problem.Title, &problem.Description, &problem.Tags, &problem.Level)
	if err != nil {
		log.Printf("Error fetching problem details for que_id %s: %v\n", queID, err)
		http.Error(w, "Problem not found", http.StatusNotFound)
		return
	}

	// Fetch the test cases for the problem
	rows, err := db.Query("SELECT tc_input, tc_output FROM test_cases WHERE que_id = $1", queID)
	if err != nil {
		log.Printf("Error fetching test cases for que_id %s: %v\n", queID, err)
		http.Error(w, "Test cases not found", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var testCase struct {
			Input  string `json:"input"`
			Output string `json:"output"`
		}
		if err := rows.Scan(&testCase.Input, &testCase.Output); err != nil {
			log.Printf("Error scanning test case: %v\n", err)
			http.Error(w, "Error reading test cases", http.StatusInternalServerError)
			return
		}
		problem.TestCases = append(problem.TestCases, testCase)
	}

	// Respond with problem details
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(problem)
}

func enableCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins, or specify specific origins
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// PredefinedCodeHandler fetches the predefined code for a given question and language.
func PredefinedCodeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Extract que_id and language from query parameters
	queID := r.URL.Query().Get("que_id")
	language := r.URL.Query().Get("language")

	if queID == "" || language == "" {
		http.Error(w, "Missing que_id or language", http.StatusBadRequest)
		return
	}

	// Build the column name dynamically based on the language
	column := ""
	switch language {
	case "javascript":
		column = "que_predefined_code_js"
	case "python":
		column = "que_predefined_code_python"
	case "java":
		column = "que_predefined_code_java"
	case "c":
		column = "que_predefined_code_c"
	default:
		http.Error(w, "Unsupported language", http.StatusBadRequest)
		return
	}

	// Fetch predefined code from the database
	var predefinedCode string
	query := fmt.Sprintf("SELECT %s FROM questions WHERE que_id = $1", column)
	err := db.QueryRow(query, queID).Scan(&predefinedCode)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Question not found", http.StatusNotFound)
		} else {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return
	}

	// Respond with the predefined code
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"predefinedCode": predefinedCode})
}

type CompileRequest struct {
	QueID    string `json:"que_id"`
	Code     string `json:"code"`
	Language string `json:"language"`
}

type TestResult struct {
	Input          string `json:"input"`
	ExpectedOutput string `json:"expectedOutput"`
	ActualOutput   string `json:"actualOutput"`
	Result         string `json:"result"`
}

type CompileResponse struct {
	TestCases         []TestResult `json:"testCases"`
	CompilationResult string       `json:"compilationResult"`
}

type PistonRequest struct {
	Language string `json:"language"`
	Version  string `json:"version"`
	Files    []struct {
		Name    string `json:"name"`
		Content string `json:"content"`
	} `json:"files"`
	Stdin string `json:"stdin,omitempty"`
}

type PistonResponse struct {
	Run struct {
		Stdout string `json:"stdout"`
		Stderr string `json:"stderr"`
		Code   int    `json:"code"`
	} `json:"run"`
}

func CompileHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received compilation request")
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var compileRequest CompileRequest
	if err := json.NewDecoder(r.Body).Decode(&compileRequest); err != nil {
		log.Println("Error decoding request payload:", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Printf("Processing request for QueID: %s, Language: %s\n", compileRequest.QueID, compileRequest.Language)

	// Select correct version for each language
	languageVersions := map[string]string{
		"python":     "3.10.0",
		"javascript": "18.15.0",
		"java":       "15.0.2",
		"c":          "10.2.0",
	}

	version, exists := languageVersions[strings.ToLower(compileRequest.Language)]
	if !exists {
		http.Error(w, "Unsupported language", http.StatusBadRequest)
		return
	}

	// Fetch test cases from DB
	var testCases []struct {
		Input  string
		Output string
	}

	query := "SELECT tc_input, tc_output FROM test_cases WHERE que_id = $1"
	rows, err := db.Query(query, compileRequest.QueID)
	if err != nil {
		log.Println("Failed to fetch test cases:", err)
		http.Error(w, "Failed to fetch test cases: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var testCase struct {
			Input  string
			Output string
		}
		if err := rows.Scan(&testCase.Input, &testCase.Output); err != nil {
			log.Println("Failed to scan test case:", err)
			http.Error(w, "Failed to scan test case: "+err.Error(), http.StatusInternalServerError)
			return
		}
		testCases = append(testCases, testCase)
	}

	log.Printf("Fetched %d test cases\n", len(testCases))

	var testResults []TestResult
	compilationResult := "Compilation Success"
	pistonURL := "https://emkc.org/api/v2/piston/execute"

	// Iterate through test cases
	for _, testCase := range testCases {
		log.Printf("Executing test case with input: %s\n", testCase.Input)

		pistonReq := PistonRequest{
			Language: compileRequest.Language,
			Version:  version,
			Files: []struct {
				Name    string `json:"name"`
				Content string `json:"content"`
			}{
				{Name: "main", Content: compileRequest.Code},
			},
			Stdin: testCase.Input,
		}

		pistonReqBody, _ := json.Marshal(pistonReq)
		log.Printf("Sending request to Piston: %s\n", string(pistonReqBody))

		resp, err := http.Post(pistonURL, "application/json", bytes.NewBuffer(pistonReqBody))
		if err != nil {
			log.Println("Piston API request failed:", err)
			compilationResult = "Piston API request failed: " + err.Error()
			break
		}
		defer resp.Body.Close()

		body, _ := ioutil.ReadAll(resp.Body)
		log.Printf("Received response from Piston: %s\n", string(body))

		var pistonResp PistonResponse
		if err := json.Unmarshal(body, &pistonResp); err != nil {
			log.Println("Failed to parse Piston response:", err)
			compilationResult = "Failed to parse Piston response"
			break
		}

		// Check if the runtime is unknown
		if strings.Contains(string(body), "runtime is unknown") {
			log.Println("Piston error: Unsupported runtime")
			compilationResult = "Piston error: Unsupported runtime for " + compileRequest.Language
			break
		}

		actualOutput := strings.TrimSpace(pistonResp.Run.Stdout)
		log.Printf("Test case result - Expected: %s, Actual: %s\n", testCase.Output, actualOutput)

		testResult := TestResult{
			Input:          testCase.Input,
			ExpectedOutput: testCase.Output,
			ActualOutput:   actualOutput,
		}

		if pistonResp.Run.Code != 0 {
			log.Println("Runtime error:", pistonResp.Run.Stderr)
			testResult.Result = "fail (runtime error)"
			compilationResult = "Compilation Error: " + pistonResp.Run.Stderr
		} else if actualOutput == strings.TrimSpace(testCase.Output) {
			testResult.Result = "pass"
		} else {
			testResult.Result = "fail"
		}

		testResults = append(testResults, testResult)
	}

	log.Println("Compilation and execution completed")

	// Send response
	compileResponse := CompileResponse{
		TestCases:         testResults,
		CompilationResult: compilationResult,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(compileResponse)
}

func SubmitHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse the request body
	var compileRequest CompileRequest
	err := json.NewDecoder(r.Body).Decode(&compileRequest)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Authenticate user from the token
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header missing", http.StatusUnauthorized)
		return
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		http.Error(w, "Malformed token", http.StatusUnauthorized)
		return
	}

	claims := &Claims{}
	_, err = jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil || claims.UserID == 0 {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	// Call CompileHandler to test the code
	compileResponse := CompileResponse{}
	compileHandlerURL := "http://localhost:8080/compile" // Assuming CompileHandler is available at this endpoint
	reqBody, _ := json.Marshal(compileRequest)
	resp, err := http.Post(compileHandlerURL, "application/json", strings.NewReader(string(reqBody)))
	if err != nil || resp.StatusCode != http.StatusOK {
		http.Error(w, "Failed to compile and run test cases", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	err = json.NewDecoder(resp.Body).Decode(&compileResponse)
	if err != nil {
		http.Error(w, "Error decoding compile response", http.StatusInternalServerError)
		return
	}

	// Calculate submission status
	passedTestCases := 0
	for _, result := range compileResponse.TestCases {
		if result.Result == "pass" {
			passedTestCases++
		}
	}
	status := "fail"
	if passedTestCases == len(compileResponse.TestCases) {
		status = "pass"
	}

	// Insert submission details into the database, including the language
	_, err = db.Exec(
		`INSERT INTO user_ans (que_id, user_id, code, code_date, code_time, status, passed_test_cases, language)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (que_id, user_id,code_date,code_time) DO UPDATE SET
         code = EXCLUDED.code,
         code_date = EXCLUDED.code_date,
         code_time = EXCLUDED.code_time,
         status = EXCLUDED.status,
         passed_test_cases = EXCLUDED.passed_test_cases,
         language = EXCLUDED.language`,
		compileRequest.QueID, claims.UserID, compileRequest.Code,
		time.Now().Format("2006-01-02"), time.Now().Format("15:04:05"),
		status, passedTestCases, compileRequest.Language, // Store the language
	)
	if err != nil {
		http.Error(w, "Error saving submission to database", http.StatusInternalServerError)
		return
	}

	// Respond with the submission result
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":            status,
		"passedTestCases":   passedTestCases,
		"totalTestCases":    len(compileResponse.TestCases),
		"compilationResult": compileResponse.CompilationResult,
	})
}

// *****************************************This is updation of code for dashboard purpose*********************************************************

func DashboardHandler(w http.ResponseWriter, r *http.Request) {
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		log.Println("Missing token")
		http.Error(w, "Missing token", http.StatusUnauthorized)
		return
	}

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		log.Println("Invalid token:", err)
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	dashboardData, err := getUserDashboardData(claims.UserID)
	if err != nil {
		log.Println("Error fetching dashboard data:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(dashboardData); err != nil {
		log.Println("Error encoding dashboard data:", err)
	}
}

func getUserDashboardData(userID int) (map[string]interface{}, error) {
	userId = userID
	var user User
	var userRecord struct {
		Easy, Medium, Hard int
	}

	// Fetch user details (username and email)
	err := db.QueryRow("SELECT username, user_email FROM users WHERE user_id=$1", userID).Scan(&user.Username, &user.UserEmail)
	if err != nil {
		log.Println("Error fetching user details:", err)
		return nil, fmt.Errorf("could not fetch user details: %v", err)
	}

	// Fetch the user's question stats (easy, medium, hard)
	err = db.QueryRow("SELECT easy, medium, hard FROM user_record WHERE user_id=$1", userID).
		Scan(&userRecord.Easy, &userRecord.Medium, &userRecord.Hard)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("No user record found for user_id=%d, initializing stats to zero.", userID)
			userRecord.Easy = 0
			userRecord.Medium = 0
			userRecord.Hard = 0
		} else {
			log.Println("Error fetching user record:", err)
			return nil, fmt.Errorf("could not fetch user record: %v", err)
		}
	}

	// Fetch total question counts for each level
	var totalQuestions struct {
		Easy, Medium, Hard int
	}

	err = db.QueryRow("SELECT COUNT(*) FROM questions WHERE que_level='Easy'").Scan(&totalQuestions.Easy)
	if err != nil {
		log.Println("Error fetching total easy questions:", err)
		return nil, fmt.Errorf("could not fetch total easy questions: %v", err)
	}

	err = db.QueryRow("SELECT COUNT(*) FROM questions WHERE que_level='Medium'").Scan(&totalQuestions.Medium)
	if err != nil {
		log.Println("Error fetching total medium questions:", err)
		return nil, fmt.Errorf("could not fetch total medium questions: %v", err)
	}

	err = db.QueryRow("SELECT COUNT(*) FROM questions WHERE que_level='Hard'").Scan(&totalQuestions.Hard)
	if err != nil {
		log.Println("Error fetching total hard questions:", err)
		return nil, fmt.Errorf("could not fetch total hard questions: %v", err)
	}

	// Fetch distinct tags solved by the user
	tagsQuery := `
		SELECT DISTINCT q.que_tags
		FROM user_ans ua
		INNER JOIN questions q ON ua.que_id = q.que_id
		WHERE ua.user_id = $1
	`
	rows, err := db.Query(tagsQuery, userID)
	if err != nil {
		log.Println("Error fetching user tags:", err)
		return nil, fmt.Errorf("could not fetch user tags: %v", err)
	}
	defer rows.Close()

	var tags []string
	for rows.Next() {
		var tag string
		if err := rows.Scan(&tag); err != nil {
			log.Println("Error scanning user tag:", err)
			return nil, err
		}
		tags = append(tags, strings.ToUpper(tag)) // Convert tag to uppercase
	}

	if err := rows.Err(); err != nil {
		log.Println("Error iterating through tags:", err)
		return nil, err
	}

	// Prepare dashboard data
	dashboardData := map[string]interface{}{
		"username":     user.Username,
		"email":        user.UserEmail,
		"easySolved":   userRecord.Easy,
		"mediumSolved": userRecord.Medium,
		"hardSolved":   userRecord.Hard,
		"totalEasy":    totalQuestions.Easy,
		"totalMedium":  totalQuestions.Medium,
		"totalHard":    totalQuestions.Hard,
		"tags":         tags,
	}
	log.Print("Dashboard:", dashboardData)
	log.Println("dash")
	return dashboardData, nil
}

func updateProfileHandler(w http.ResponseWriter, r *http.Request) {
	// Get the token from the Authorization header
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		log.Println("Missing token")
		http.Error(w, "Missing token", http.StatusUnauthorized)
		return
	}

	// Parse the token and validate it
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		log.Println("Invalid token:", err)
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	// Extract user ID from the token claims
	userID := claims.UserID

	// Decode the request body for profile updates
	var profileUpdates struct {
		Username string `json:"username"`
		Email    string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&profileUpdates); err != nil {
		log.Println("Error decoding request body:", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Update the user record in the database
	_, err = db.Exec("UPDATE users SET username = $1, user_email = $2 WHERE user_id = $3",
		profileUpdates.Username, profileUpdates.Email, userID)
	if err != nil {
		log.Println("Error updating user profile:", err)
		http.Error(w, "Failed to update profile", http.StatusInternalServerError)
		return
	}

	// Send success response
	w.WriteHeader(http.StatusOK)
	response := map[string]string{"message": "Profile updated successfully"}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Println("Error encoding response:", err)
	}
}

func updateUserProfile(userID int, username, email string) error {
	// Update the user details in the database
	query := `
        UPDATE users
        SET username = $1, user_email = $2
        WHERE user_id = $3
    `
	_, err := db.Exec(query, username, email, userID)
	if err != nil {
		log.Println("Error updating user profile:", err)
		return fmt.Errorf("could not update user profile: %v", err)
	}

	return nil
}

type Admin struct {
	AdminID    int    `json:"admin_id"`
	AdminName  string `json:"admin_name"`
	AdminEmail string `json:"admin_email"`
	Password   string `json:"password"`
}

type AdminCredentials struct {
	Email    string `json:"admin_email"`
	Password string `json:"admin_password"`
}

func AdminLoginHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("AdminLoginHandler invoked")
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Read the raw body for debugging
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Unable to read request body", http.StatusBadRequest)
		return
	}
	log.Println("Raw request body:", string(body))

	// Decode the JSON into the Credentials struct
	var creds AdminCredentials
	err = json.Unmarshal(body, &creds)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Println("Attempting to find admin with email:", creds.Email)

	var admin Admin
	err = db.QueryRow("SELECT admin_id, admin_email, password FROM admin WHERE admin_email=$1", creds.Email).
		Scan(&admin.AdminID, &admin.AdminEmail, &admin.Password)

	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("Admin not found for email:", creds.Email)
			http.Error(w, "Admin not found", http.StatusUnauthorized)
		} else {
			log.Println("Database error:", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return
	}

	// Compare hashed password
	if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(creds.Password)); err != nil {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	// Generate token and respond
	expirationTime := time.Now().Add(1 * time.Hour)
	claims := &Claims{
		UserID: admin.AdminID,
		Email:  admin.AdminEmail,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Could not generate token", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"token":    tokenString,
		"admin_id": admin.AdminID,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func deleteProblemHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Extract problem ID from the URL path (assuming the path is like /problems/21)
	id := strings.TrimPrefix(r.URL.Path, "/problems/")
	if id == "" {
		http.Error(w, "Missing problem ID", http.StatusBadRequest)
		return
	}

	// Perform the deletion
	_, err := db.Exec("DELETE FROM questions WHERE que_id = $1", id)
	if err != nil {
		http.Error(w, "Failed to delete problem", http.StatusInternalServerError)
		return
	}

	// Send a successful response
	w.WriteHeader(http.StatusOK)
}

// Handler to fetch problem details along with test cases
func getProblemHandler(w http.ResponseWriter, r *http.Request) {
	queID := r.URL.Query().Get("id")
	if queID == "" {
		http.Error(w, "Missing problem ID", http.StatusBadRequest)
		return
	}

	var problem struct {
		ID         int    `json:"id"`
		Title      string `json:"title"`
		Desc       string `json:"desc"`
		Tags       string `json:"tags"`
		Level      string `json:"level"`
		JavaCode   string `json:"java_code"`
		JSCode     string `json:"js_code"`
		CCode      string `json:"c_code"`
		PythonCode string `json:"python_code"`
	}

	err := db.QueryRow(`
        SELECT que_id, que_title, que_desc, que_tags, que_level, 
               que_predefined_code_java, que_predefined_code_js, 
               que_predefined_code_c, que_predefined_code_python 
        FROM questions 
        WHERE que_id = $1`, queID).
		Scan(&problem.ID, &problem.Title, &problem.Desc, &problem.Tags, &problem.Level,
			&problem.JavaCode, &problem.JSCode, &problem.CCode, &problem.PythonCode)

	if err != nil {
		http.Error(w, "Problem not found", http.StatusNotFound)
		return
	}

	// Fetch associated test cases
	rows, err := db.Query(`SELECT tc_input, tc_output FROM test_cases WHERE que_id = $1`, queID)
	if err != nil {
		http.Error(w, "Error fetching test cases", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var testCases []map[string]string
	for rows.Next() {
		var input, output string
		if err := rows.Scan(&input, &output); err != nil {
			http.Error(w, "Error scanning test cases", http.StatusInternalServerError)
			return
		}
		testCases = append(testCases, map[string]string{"input": input, "output": output})
	}

	response := map[string]interface{}{
		"problem":    problem,
		"test_cases": testCases,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Handler to edit problem and test cases
func editProblemHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var requestData struct {
		ID         int    `json:"id"`
		Title      string `json:"title"`
		Desc       string `json:"desc"`
		Tags       string `json:"tags"`
		Level      string `json:"level"`
		JavaCode   string `json:"java_code"`
		JSCode     string `json:"js_code"`
		CCode      string `json:"c_code"`
		PythonCode string `json:"python_code"`
		TestCases  []struct {
			Input  string `json:"input"`
			Output string `json:"output"`
		} `json:"test_cases"`
	}

	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Update the problem details
	_, err = db.Exec(`
        UPDATE questions
        SET que_title = $1, que_desc = $2, que_tags = $3, que_level = $4, 
            que_predefined_code_java = $5, que_predefined_code_js = $6, 
            que_predefined_code_c = $7, que_predefined_code_python = $8
        WHERE que_id = $9`,
		requestData.Title, requestData.Desc, requestData.Tags, requestData.Level,
		requestData.JavaCode, requestData.JSCode, requestData.CCode, requestData.PythonCode, requestData.ID)

	if err != nil {
		http.Error(w, "Failed to update problem", http.StatusInternalServerError)
		return
	}

	// Delete old test cases
	_, err = db.Exec(`DELETE FROM test_cases WHERE que_id = $1`, requestData.ID)
	if err != nil {
		http.Error(w, "Failed to delete old test cases", http.StatusInternalServerError)
		return
	}

	// Insert updated test cases
	for _, tc := range requestData.TestCases {
		_, err := db.Exec(`
			INSERT INTO test_cases (tc_input, tc_output, que_id)
			VALUES ($1, $2, $3)`,
			tc.Input, tc.Output, requestData.ID)
		if err != nil {
			http.Error(w, "Failed to insert updated test cases", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Problem updated successfully"))
}

type Problem struct {
	ID             int    `json:"que_id"`
	Title          string `json:"title"`
	Description    string `json:"description"`
	Tags           string `json:"tags"`
	Level          string `json:"level"`
	JavaCode       string `json:"que_predefined_code_java"`
	JsCode         string `json:"que_predefined_code_js"`
	CCode          string `json:"que_predefined_code_c"`
	PythonCode     string `json:"que_predefined_code_python"`
	TestCases      string `json:"tc_input"`
	ExpectedOutput string `json:"tc_output"`
}

func splitCSVPreservingQuotes(input string) []string {
	re := regexp.MustCompile(`"[^"]*"|[^,]+`)
	matches := re.FindAllString(input, -1)

	// Trim spaces and remove surrounding quotes
	var result []string
	for _, match := range matches {
		trimmed := strings.TrimSpace(match)
		if strings.HasPrefix(trimmed, `"`) && strings.HasSuffix(trimmed, `"`) {
			trimmed = trimmed[1 : len(trimmed)-1] // Remove surrounding quotes
		}
		result = append(result, trimmed)
	}
	return result
}

func addProblemHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("addProblemHandler invoked")
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Read the raw body for debugging
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Unable to read request body", http.StatusBadRequest)
		return
	}
	log.Println("Raw request body:", string(body))

	// Decode the JSON into the Problem struct
	var newProblem Problem
	err = json.Unmarshal(body, &newProblem)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Println("Attempting to add new problem:", newProblem.Title)

	// Insert the new problem into the database
	err = db.QueryRow(
		`INSERT INTO questions (que_title, que_desc, que_tags, que_level, que_predefined_code_java, que_predefined_code_js, que_predefined_code_c, que_predefined_code_python)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING que_id`,
		newProblem.Title, newProblem.Description, newProblem.Tags, newProblem.Level,
		newProblem.JavaCode, newProblem.JsCode, newProblem.CCode, newProblem.PythonCode).Scan(&newProblem.ID)

	if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Failed to insert new problem", http.StatusInternalServerError)
		return
	}

	// Split test cases and expected outputs outside double quotes
	testCases := splitCSVPreservingQuotes(newProblem.TestCases)
	expectedOutputs := splitCSVPreservingQuotes(newProblem.ExpectedOutput)

	// Insert test cases into test_cases table
	for i := range testCases {
		_, err := db.Exec(
			`INSERT INTO test_cases (tc_input, tc_output, que_id)
			VALUES ($1, $2, $3)`,
			strings.TrimSpace(testCases[i]), strings.TrimSpace(expectedOutputs[i]), newProblem.ID)

		if err != nil {
			log.Println("Error inserting test case:", err)
			http.Error(w, "Failed to insert test cases", http.StatusInternalServerError)
			return
		}
	}

	// Respond with the newly added problem ID
	response := map[string]interface{}{
		"que_id": newProblem.ID,
		"title":  newProblem.Title,
		"level":  newProblem.Level,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

type Submission struct {
	CodeDate        string `json:"code_date"`
	CodeTime        string `json:"code_time"`
	Status          string `json:"status"`
	PassedTestCases int    `json:"passed_test_cases"`
	Language        string `json:"language"`
	Code            string `json:"code"`
}

func getSubmissionsHandler(w http.ResponseWriter, r *http.Request) {
	// Extract queID from the URL
	queID := r.URL.Path[len("/submissions/"):]

	// Get the token from the Authorization header
	token := r.Header.Get("Authorization")
	if token == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Query to fetch the submissions from the database
	rows, err := db.Query(`SELECT code_date, code_time, status, passed_test_cases,language,code FROM user_ans WHERE que_id = $1 and user_id=$2`, queID, userId)
	if err != nil {
		// Handle database query error
		http.Error(w, "Failed to fetch submissions", http.StatusInternalServerError)
		log.Println("Query execution failed:", err)
		return
	}
	defer rows.Close()

	var submissions []Submission
	for rows.Next() {
		var sub Submission
		var rawDate time.Time
		var rawTime time.Time

		// Scan date and time as raw time.Time values
		if err := rows.Scan(&rawDate, &rawTime, &sub.Status, &sub.PassedTestCases, &sub.Language, &sub.Code); err != nil {
			http.Error(w, "Error reading submission data", http.StatusInternalServerError)
			log.Println("Row scan failed:", err)
			return
		}

		// Format date as "dd-mm-yyyy"
		sub.CodeDate = rawDate.Format("02-01-2006")
		// Format time as "HH:MM:SS"
		sub.CodeTime = rawTime.Format("15:04:05")

		// Add the submission to the slice
		submissions = append(submissions, sub)
	}

	// Handle any error encountered during rows iteration
	if err = rows.Err(); err != nil {
		http.Error(w, "Error iterating through submissions", http.StatusInternalServerError)
		log.Println("Rows iteration error:", err)
		return
	}

	// Check if there were no submissions found
	if len(submissions) == 0 {
		// Return "No records found" response if no submissions were found
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK) // OK response for no records
		json.NewEncoder(w).Encode(map[string]string{"message": "No records found"})
		return
	}

	// Respond with the submissions in JSON format if there are records
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // OK response with data
	json.NewEncoder(w).Encode(submissions)
}

type Solution struct {
	Username        string `json:"username"`
	PassedTestCases int    `json:"passed_test_cases"`
	Language        string `json:"language"`
	Code            string `json:"code"`
	UserId          int    `json:"user_id"`
}

func getSolutionsHandler(w http.ResponseWriter, r *http.Request) {
	log.Print("getSolutionsHandler called")

	// Extract queID from the URL
	queID := r.URL.Path[len("/solutions/"):]

	// Check if the current user has solved the question
	var userSolved bool
	err := db.QueryRow(`
		SELECT EXISTS (
			SELECT 1 FROM user_ans 
			WHERE que_id = $1 AND user_id = $2 AND status = 'pass'
		)
	`, queID, userId).Scan(&userSolved)

	if err != nil {
		http.Error(w, "Failed to check user solution status", http.StatusInternalServerError)
		log.Println("User solution check failed:", err)
		return
	}

	if !userSolved {
		http.Error(w, "Please solve the question first", http.StatusForbidden)
		return
	}

	// Fetch successful solutions from other users
	query := `
		SELECT distinct u.username, ua.passed_test_cases, ua.language, ua.code, ua.user_id 
		FROM user_ans ua 
		JOIN users u ON ua.user_id = u.user_id 
		WHERE ua.que_id = $1 AND ua.status = 'pass' AND ua.user_id != $2
	`
	rows, err := db.Query(query, queID, userId)
	if err != nil {
		http.Error(w, "Failed to fetch solutions", http.StatusInternalServerError)
		log.Println("Query execution failed:", err)
		return
	}
	defer rows.Close()

	var solutions []Solution
	for rows.Next() {
		var sol Solution
		if err := rows.Scan(&sol.Username, &sol.PassedTestCases, &sol.Language, &sol.Code, &sol.UserId); err != nil {
			http.Error(w, "Error reading solution data", http.StatusInternalServerError)
			log.Println("Row scan failed:", err)
			return
		}
		solutions = append(solutions, sol)
	}

	if len(solutions) == 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "No records found"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(solutions)
}

type StudentSubmission struct {
	UserID          int    `json:"user_id"`
	Username        string `json:"username"`
	PassedTestCases int    `json:"passed_test_cases"`
	Status          string `json:"status"`
	SubmissionTime  string `json:"submission_time"`
	Language        string `json:"language"`
	Code            string `json:"code"`
}

func getStudentSubmissionsHandler(w http.ResponseWriter, r *http.Request) {
	log.Print("getStudentSubmissionsHandler invoked")

	// Retrieve que_id from query parameters
	queID := r.URL.Query().Get("que_id")
	if queID == "" {
		http.Error(w, "Missing que_id parameter", http.StatusBadRequest)
		return
	}

	rows, err := db.Query(`
		SELECT ua.user_id, u.username, ua.passed_test_cases, ua.status, 
			CONCAT(ua.code_date, ' ', ua.code_time) AS submission_time, ua.language, ua.code
		FROM user_ans ua
		JOIN users u ON ua.user_id = u.user_id
		WHERE ua.que_id = $1
	`, queID)
	if err != nil {
		http.Error(w, "Query execution failed", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var studentSubmissions []StudentSubmission
	for rows.Next() {
		var s StudentSubmission
		if err := rows.Scan(&s.UserID, &s.Username, &s.PassedTestCases, &s.Status, &s.SubmissionTime, &s.Language, &s.Code); err != nil {
			http.Error(w, "Data scan failed", http.StatusInternalServerError)
			return
		}
		studentSubmissions = append(studentSubmissions, s)
	}

	// Check if no records were found
	if len(studentSubmissions) == 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "No records found"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(studentSubmissions)
	if err != nil {
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
	}
}

// *****************************************This is updation of code for dashboard purpose*********************************************************

func main() {
	defer db.Close()
	http.Handle("/submit", enableCors(http.HandlerFunc(SubmitHandler)))
	http.Handle("/compile", enableCors(http.HandlerFunc(CompileHandler)))
	http.Handle("/login", enableCors(http.HandlerFunc(LoginHandler)))
	http.Handle("/signup", enableCors(http.HandlerFunc(SignupHandler)))
	http.Handle("/forgot-password", enableCors(http.HandlerFunc(ForgotPasswordHandler)))
	http.Handle("/problems", enableCors(http.HandlerFunc(ProblemsHandler)))
	http.Handle("/problem-details/", enableCors(http.HandlerFunc(ProblemDetailsHandler)))
	http.Handle("/predefined-code", enableCors(http.HandlerFunc(PredefinedCodeHandler)))
	http.Handle("/dashboard", enableCors(http.HandlerFunc(DashboardHandler)))
	http.Handle("/update-profile", enableCors(http.HandlerFunc(updateProfileHandler)))
	http.Handle("/admin-login", enableCors(http.HandlerFunc(AdminLoginHandler)))
	http.Handle("/problems/", enableCors(http.HandlerFunc(deleteProblemHandler)))
	http.Handle("/problems/edit", enableCors(http.HandlerFunc(editProblemHandler)))
	http.Handle("/problems/add", enableCors(http.HandlerFunc(addProblemHandler)))
	http.Handle("/submissions/", enableCors(http.HandlerFunc(getSubmissionsHandler)))
	http.Handle("/solutions/", enableCors(http.HandlerFunc(getSolutionsHandler)))
	http.Handle("/get-submissions", enableCors(http.HandlerFunc(getStudentSubmissionsHandler)))

	server := &http.Server{
		Addr:    ":8080",
		Handler: nil,
	}

	// Handle SIGINT/SIGTERM for graceful shutdown
	log.Println("Server is running on port 8080...")
	log.Fatal(server.ListenAndServe())
}
