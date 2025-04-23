--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Ubuntu 17.2-1.pgdg24.04+1)
-- Dumped by pg_dump version 17.2 (Ubuntu 17.2-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: questions; Type: TABLE; Schema: public; Owner: shreyas
--

CREATE TABLE public.questions (
    que_id integer NOT NULL,
    que_title character varying(200) NOT NULL,
    que_desc character varying(1000) NOT NULL,
    que_tags character varying(200) NOT NULL,
    que_level character varying(10) NOT NULL,
    que_predefined_code_java text DEFAULT ''::text NOT NULL,
    que_predefined_code_js text DEFAULT ''::text NOT NULL,
    que_predefined_code_c text DEFAULT ''::text NOT NULL,
    que_predefined_code_python text DEFAULT ''::text NOT NULL
);


ALTER TABLE public.questions OWNER TO shreyas;

--
-- Name: questions_que_id_seq; Type: SEQUENCE; Schema: public; Owner: shreyas
--

CREATE SEQUENCE public.questions_que_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.questions_que_id_seq OWNER TO shreyas;

--
-- Name: questions_que_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shreyas
--

ALTER SEQUENCE public.questions_que_id_seq OWNED BY public.questions.que_id;


--
-- Name: test_cases; Type: TABLE; Schema: public; Owner: shreyas
--

CREATE TABLE public.test_cases (
    tc_id integer NOT NULL,
    tc_input character varying(200) NOT NULL,
    tc_output character varying(200) NOT NULL,
    que_id integer
);


ALTER TABLE public.test_cases OWNER TO shreyas;

--
-- Name: test_cases_tc_id_seq; Type: SEQUENCE; Schema: public; Owner: shreyas
--

CREATE SEQUENCE public.test_cases_tc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.test_cases_tc_id_seq OWNER TO shreyas;

--
-- Name: test_cases_tc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shreyas
--

ALTER SEQUENCE public.test_cases_tc_id_seq OWNED BY public.test_cases.tc_id;


--
-- Name: user_ans; Type: TABLE; Schema: public; Owner: shreyas
--

CREATE TABLE public.user_ans (
    que_id integer NOT NULL,
    user_id integer NOT NULL,
    code text,
    code_date date NOT NULL,
    code_time time without time zone NOT NULL,
    status character varying(20) NOT NULL,
    passed_test_cases integer NOT NULL
);


ALTER TABLE public.user_ans OWNER TO shreyas;

--
-- Name: user_record; Type: TABLE; Schema: public; Owner: shreyas
--

CREATE TABLE public.user_record (
    user_id integer NOT NULL,
    que_id integer,
    easy integer NOT NULL,
    medium integer NOT NULL,
    hard integer NOT NULL,
    active_days integer NOT NULL,
    streak integer NOT NULL
);


ALTER TABLE public.user_record OWNER TO shreyas;

--
-- Name: users; Type: TABLE; Schema: public; Owner: shreyas
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(40) NOT NULL,
    user_email character varying(30) NOT NULL,
    user_password character varying(200) NOT NULL
);


ALTER TABLE public.users OWNER TO shreyas;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: shreyas
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO shreyas;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shreyas
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: questions que_id; Type: DEFAULT; Schema: public; Owner: shreyas
--

ALTER TABLE ONLY public.questions ALTER COLUMN que_id SET DEFAULT nextval('public.questions_que_id_seq'::regclass);


--
-- Name: test_cases tc_id; Type: DEFAULT; Schema: public; Owner: shreyas
--

ALTER TABLE ONLY public.test_cases ALTER COLUMN tc_id SET DEFAULT nextval('public.test_cases_tc_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: shreyas
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: shreyas
--

COPY public.questions (que_id, que_title, que_desc, que_tags, que_level, que_predefined_code_java, que_predefined_code_js, que_predefined_code_c, que_predefined_code_python) FROM stdin;
21	Two Sum Problem	Find two numbers in an array that add up to a target.	array	easy	// Java: Function signature for Two Sum Problem\npublic int[] twoSum(int[] nums, int target) {\n    // Your code here\n    return new int[0];\n}	// JavaScript: Function signature for Two Sum Problem\nfunction twoSum(nums, target) {\n    // Your code here\n    return [];\n}	/* C: Function signature for Two Sum Problem */\n#include <stdio.h>\nint* twoSum(int* nums, int numsSize, int target) {\n    // Your code here\n    static int result[2];\n    return result;\n}	# Python: Function signature for Two Sum Problem\ndef two_sum(nums, target):\n    # Your code here\n    return []
22	Merge Two Sorted Lists	Merge two sorted linked lists and return as one sorted list.	linkedlist	easy	// Java: Function signature for Merge Two Sorted Lists\npublic ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n    // Your code here\n    return new ListNode(0);\n}	// JavaScript: Function signature for Merge Two Sorted Lists\nfunction mergeTwoLists(l1, l2) {\n    // Your code here\n    return null;\n}	/* C: Function signature for Merge Two Sorted Lists */\n#include <stdio.h>\nstruct ListNode* mergeTwoLists(struct ListNode* l1, struct ListNode* l2) {\n    // Your code here\n    return NULL;\n}	# Python: Function signature for Merge Two Sorted Lists\ndef merge_two_lists(l1, l2):\n    # Your code here\n    return None
23	Binary Tree Inorder Traversal	Perform an inorder traversal of a binary tree.	tree	easy	// Java: Function signature for Binary Tree Inorder Traversal\npublic List<Integer> inorderTraversal(TreeNode root) {\n    // Your code here\n    return new ArrayList<>();\n}	// JavaScript: Function signature for Binary Tree Inorder Traversal\nfunction inorderTraversal(root) {\n    // Your code here\n    return [];\n}	/* C: Function signature for Binary Tree Inorder Traversal */\n#include <stdio.h>\n#include <stdlib.h>\nstruct TreeNode {\n    int val;\n    struct TreeNode *left;\n    struct TreeNode *right;\n};\nvoid inorderTraversal(struct TreeNode* root) {\n    // Your code here\n}	# Python: Function signature for Binary Tree Inorder Traversal\ndef inorder_traversal(root):\n    # Your code here\n    return []
24	Valid Parentheses	Check if the input string has valid parentheses.	stack	easy	// Java: Function signature for Valid Parentheses\npublic boolean isValid(String s) {\n    // Your code here\n    return true;\n}	// JavaScript: Function signature for Valid Parentheses\nfunction isValid(s) {\n    // Your code here\n    return true;\n}	/* C: Function signature for Valid Parentheses */\n#include <stdio.h>\n#include <stdbool.h>\nbool isValid(char* s) {\n    // Your code here\n    return true;\n}	# Python: Function signature for Valid Parentheses\ndef is_valid(s):\n    # Your code here\n    return True
25	Longest Substring Without Repeating Characters	Find the length of the longest substring without repeating characters.	string	medium	// Java: Function signature for Longest Substring Without Repeating Characters\npublic int lengthOfLongestSubstring(String s) {\n    // Your code here\n    return 0;\n}	// JavaScript: Function signature for Longest Substring Without Repeating Characters\nfunction lengthOfLongestSubstring(s) {\n    // Your code here\n    return 0;\n}	/* C: Function signature for Longest Substring Without Repeating Characters */\n#include <stdio.h>\nint lengthOfLongestSubstring(char* s) {\n    // Your code here\n    return 0;\n}	# Python: Function signature for Longest Substring Without Repeating Characters\ndef length_of_longest_substring(s):\n    # Your code here\n    return 0
26	Find Median from Data Stream	Design a data structure that supports adding numbers and finding the median.	heap	hard	// Java: Function signature for Find Median from Data Stream\npublic class MedianFinder {\n    public void addNum(int num) {\n        // Your code here\n    }\n\n    public double findMedian() {\n        // Your code here\n        return 0.0;\n    }\n}	// JavaScript: Function signature for Find Median from Data Stream\nfunction MedianFinder() {\n    this.addNum = function(num) {\n        // Your code here\n    };\n    this.findMedian = function() {\n        // Your code here\n        return 0.0;\n    };\n}	/* C: Function signature for Find Median from Data Stream */\n#include <stdio.h>\ndouble findMedian(int* nums, int numsSize) {\n    // Your code here\n    return 0.0;\n}	# Python: Function signature for Find Median from Data Stream\nclass MedianFinder:\n    def addNum(self, num):\n        # Your code here\n        pass\n\n    def findMedian(self):\n        # Your code here\n        return 0.0
27	Word Search	Given a 2D board and a word, check if the word exists in the grid.	matrix	medium	// Java: Function signature for Word Search\npublic boolean exist(char[][] board, String word) {\n    // Your code here\n    return false;\n}	// JavaScript: Function signature for Word Search\nfunction exist(board, word) {\n    // Your code here\n    return false;\n}	/* C: Function signature for Word Search */\n#include <stdio.h>\n#include <stdbool.h>\nbool exist(char** board, int boardSize, int* boardColSize, char* word) {\n    // Your code here\n    return false;\n}	# Python: Function signature for Word Search\ndef exist(board, word):\n    # Your code here\n    return False
28	Maximum Subarray	Find the contiguous subarray with the largest sum.	array	easy	// Java: Function signature for Maximum Subarray\npublic int maxSubArray(int[] nums) {\n    // Your code here\n    return 0;\n}	// JavaScript: Function signature for Maximum Subarray\nfunction maxSubArray(nums) {\n    // Your code here\n    return 0;\n}	/* C: Function signature for Maximum Subarray */\n#include <stdio.h>\nint maxSubArray(int* nums, int numsSize) {\n    // Your code here\n    return 0;\n}	# Python: Function signature for Maximum Subarray\ndef max_sub_array(nums):\n    # Your code here\n    return 0
29	Kth Largest Element in an Array	Find the kth largest element in an unsorted array.	heap	medium	// Java: Function signature for Kth Largest Element in an Array\npublic int findKthLargest(int[] nums, int k) {\n    // Your code here\n    return 0;\n}	// JavaScript: Function signature for Kth Largest Element in an Array\nfunction findKthLargest(nums, k) {\n    // Your code here\n    return 0;\n}	/* C: Function signature for Kth Largest Element in an Array */\n#include <stdio.h>\nint findKthLargest(int* nums, int numsSize, int k) {\n    // Your code here\n    return 0;\n}	# Python: Function signature for Kth Largest Element in an Array\ndef find_kth_largest(nums, k):\n    # Your code here\n    return 0
30	Clone Graph	Clone a graph represented as adjacency list.	graph	medium	// Java: Function signature for Clone Graph\npublic Node cloneGraph(Node node) {\n    // Your code here\n    return null;\n}	// JavaScript: Function signature for Clone Graph\nfunction cloneGraph(node) {\n    // Your code here\n    return null;\n}	/* C: Function signature for Clone Graph */\n#include <stdio.h>\nstruct Node* cloneGraph(struct Node* node) {\n    // Your code here\n    return NULL;\n}	# Python: Function signature for Clone Graph\ndef clone_graph(node):\n    # Your code here\n    return None
1	Reverse a String	Write a function that takes a string as input and returns the reversed string.	["string", "manipulation", "recursion"]	Easy	public class Main {\n    public static String reverseString(String s) {\n        // Your code here\n        return "";\n    }\n\n    public static void main(String[] args) {\n        String s = args[0];\n        System.out.println(reverseString(s));\n    }\n}	function reverseString(s) {\n    // Your code here\n    return "";\n}\n\nconst s = process.argv[2];\nconsole.log(reverseString(s));	#include <stdio.h>\n#include <string.h>\n\nvoid reverseString(char *s, char *result) {\n    // Your code here\n}\n\nint main(int argc, char *argv[]) {\n    char *s = argv[1];\n    char result[200];\n    reverseString(s, result);\n    printf("%s\\n", result);\n    return 0;\n}	def reverse_string(s: str) -> str:\n    # Your code here\n    return ""\n\nif __name__ == "__main__":\n    import sys\n    s = sys.argv[1]\n    print(reverse_string(s))
2	Check for Prime	Write a function to check whether a given number is a prime number.	["math", "number theory"]	Easy	public class Main {\n    public static boolean isPrime(int n) {\n        // Your code here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(isPrime(n));\n    }\n}	function isPrime(n) {\n    // Your code here\n    return false;\n}\n\nconst n = parseInt(process.argv[2], 10);\nconsole.log(isPrime(n));	#include <stdio.h>\n#include <stdbool.h>\n\nbool isPrime(int n) {\n    // Your code here\n    return false;\n}\n\nint main(int argc, char *argv[]) {\n    int n = atoi(argv[1]);\n    printf("%s\\n", isPrime(n) ? "True" : "False");\n    return 0;\n}	def is_prime(n: int) -> bool:\n    # Your code here\n    return False\n\nif __name__ == "__main__":\n    import sys\n    n = int(sys.argv[1])\n    print(is_prime(n))
3	Palindrome Check	Write a function to check if a given string is a palindrome.	["string", "manipulation"]	Easy	public class Main {\n    public static boolean isPalindrome(String s) {\n        // Your code here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        String s = args[0];\n        System.out.println(isPalindrome(s));\n    }\n}	function isPalindrome(s) {\n    // Your code here\n    return false;\n}\n\nconst s = process.argv[2];\nconsole.log(isPalindrome(s));	#include <stdio.h>\n#include <stdbool.h>\n#include <string.h>\n\nbool isPalindrome(char *s) {\n    // Your code here\n    return false;\n}\n\nint main(int argc, char *argv[]) {\n    char *s = argv[1];\n    printf("%s\\n", isPalindrome(s) ? "True" : "False");\n    return 0;\n}	def is_palindrome(s: str) -> bool:\n    # Your code here\n    return False\n\nif __name__ == "__main__":\n    import sys\n    s = sys.argv[1]\n    print(is_palindrome(s))
4	Factorial Calculation	Write a function to calculate the factorial of a number using recursion.	["recursion", "math"]	Easy	public class Main {\n    public static int factorial(int n) {\n        // Your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        int n = Integer.parseInt(args[0]);\n        System.out.println(factorial(n));\n    }\n}	function factorial(n) {\n    // Your code here\n    return 0;\n}\n\nconst n = parseInt(process.argv[2], 10);\nconsole.log(factorial(n));	#include <stdio.h>\n\nint factorial(int n) {\n    // Your code here\n    return 0;\n}\n\nint main(int argc, char *argv[]) {\n    int n = atoi(argv[1]);\n    printf("%d\\n", factorial(n));\n    return 0;\n}	def factorial(n: int) -> int:\n    # Your code here\n    return 0\n\nif __name__ == "__main__":\n    import sys\n    n = int(sys.argv[1])\n    print(factorial(n))
\.


--
-- Data for Name: test_cases; Type: TABLE DATA; Schema: public; Owner: shreyas
--

COPY public.test_cases (tc_id, tc_input, tc_output, que_id) FROM stdin;
101	[1, 3, 5, 7, 9], 8	[0, 2]	21
102	[4, 6, 7, 8], 10	[0, 3]	21
103	[10, 12, 15, 18], 20	[1, 2]	21
104	[1->3->5], [2->4->6]	[1->2->3->4->5->6]	22
105	[1->2->3], []	[1->2->3]	22
106	[], [1->4->5]	[1->4->5]	22
107	[1, 2, 3, null, null, 4, 5]	[2, 1, 4, 3, 5]	23
108	[1, null, 2, null, 3]	[1, 2, 3]	23
109	[3, 1, 5, 0, 2, 4, 6]	[0, 1, 2, 3, 4, 5, 6]	23
110	"[{()}]", true	true	24
111	"[{)]}", false	false	24
112	"({[}]), false	false	24
113	"abca", 3	3	25
114	"abcde", 5	5	25
115	"aab", 2	2	25
116	[1, 3, 4, 2], findMedian()	2.5	26
117	[5, 15, 1, 3], findMedian()	3.0	26
118	[10, 2], findMedian()	6.0	26
119	[["A", "B", "C", "D"], ["E", "F", "G", "H"]], "BFGH"	true	27
120	[["A", "B"], ["C", "D"]], "ACD"	false	27
121	[["A", "B", "C"], ["D", "E", "F"]], "F"	true	27
122	[1, -2, 3, 4, -1, 2], 6	6	28
123	[-1, -2, -3, -4], -1	-1	28
124	[3, 4, -2, 7], 12	12	28
125	[1, 3, 5, 2, 4], 3	4	29
126	[5, 6, 7, 8, 9], 2	8	29
127	[10, 20, 30, 40, 50], 4	40	29
128	[1, 2, 3], 2	[[1,2,3], [2,3], [3]]	30
129	[1, 3, 4], 3	[[1,3,4], [3,4], [4]]	30
130	[1], 1	[[1]]	30
143	hello	olleh	1
144	world	dlrow	1
145	a	a	1
146	7	True	2
147	10	False	2
148	2	True	2
149	racecar	True	3
150	hello	False	3
151	madam	True	3
152	5	120	4
153	0	1	4
154	3	6	4
\.


--
-- Data for Name: user_ans; Type: TABLE DATA; Schema: public; Owner: shreyas
--

COPY public.user_ans (que_id, user_id, code, code_date, code_time, status, passed_test_cases) FROM stdin;
\.


--
-- Data for Name: user_record; Type: TABLE DATA; Schema: public; Owner: shreyas
--

COPY public.user_record (user_id, que_id, easy, medium, hard, active_days, streak) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: shreyas
--

COPY public.users (user_id, username, user_email, user_password) FROM stdin;
1	john_doe	john@example.com	password123
2	jane_smith	jane@example.com	mypassword
3	alice_brown	alice@example.com	alicepass
4	bob_jones	bob@example.com	bobsafe
6	abc		
7	JohnDoe	john.doe@example.com	$2a$10$sk0rVxKZPJGpevEOPSfvy..NEJmjC/PWjvEJ.kJVmJKiJaQe9A15u
8	JohnDoe	john.doe@example.com	$2a$10$SutMBflBOpY.KaJ5imSMheqAIMsjzc7vLZrPYLE/KHt8PZqbkf5rO
9	JohnDoe	john.doe@example.com	$2a$10$.KrDxn0clHa97wN54qx5q.gzbD2oowSosSZav9ZIHnWkToig7kkWW
10	me	me@gmail.com	$2a$10$LULAzI8yB26SrcCQJ5ZTleI2KVc5yqzI6i.W8hCfm8zJJNeII5Eb2
11	la	la@gmail.com	$2a$10$2kwPrO/MSetmHglg5EkrEOjI32amkyKkg0qaIGFonvr1ODEGPe6.m
5	shreyas_sahane	shreyassahane5@gmail.com	$2a$10$ct1dR.j42n6s0OfRCTwzgue/wmjRqSGOxTRnvZyJ9TgJIWRw9UfuC
12	Prajwal	prajwalnimbalkar11@gmail.com	$2a$10$h8JBYzHTkcZkR/hJcVxyReKld5n28M0m0WJyXNrHCzrFkQauWF9h.
13	Prajwal	prajwalnimbalkar11@gmail.com	$2a$10$OB8TXdC9Od7sShrM.b/9DuZFCuCEdiQrG0awoWx87Xr1bsvRBDJYy
14	Prajwal	prajwalnimbalkar11@gmail.com	$2a$10$PbbZt5BwHooWLloFkgm8bOXHUOXlECcHjxW1uaDY18rs8Lo1iMG8.
15	Prajwal	prajwalnimbalkar11@gmail.com	$2a$10$9AT1YNvgsZ1gH3cUwHh9SeUILiBC2cSg5W9slOf/xRfxQaTkrr0nq
\.


--
-- Name: questions_que_id_seq; Type: SEQUENCE SET; Schema: public; Owner: shreyas
--

SELECT pg_catalog.setval('public.questions_que_id_seq', 30, true);


--
-- Name: test_cases_tc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: shreyas
--

SELECT pg_catalog.setval('public.test_cases_tc_id_seq', 154, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: shreyas
--

SELECT pg_catalog.setval('public.users_user_id_seq', 15, true);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: shreyas
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (que_id);


--
-- Name: test_cases test_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: shreyas
--

ALTER TABLE ONLY public.test_cases
    ADD CONSTRAINT test_cases_pkey PRIMARY KEY (tc_id);


--
-- Name: user_ans user_ans_pkey; Type: CONSTRAINT; Schema: public; Owner: shreyas
--

ALTER TABLE ONLY public.user_ans
    ADD CONSTRAINT user_ans_pkey PRIMARY KEY (que_id, user_id);


--
-- Name: user_record user_record_pkey; Type: CONSTRAINT; Schema: public; Owner: shreyas
--

ALTER TABLE ONLY public.user_record
    ADD CONSTRAINT user_record_pkey PRIMARY KEY (user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: shreyas
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: test_cases test_cases_que_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shreyas
--

ALTER TABLE ONLY public.test_cases
    ADD CONSTRAINT test_cases_que_id_fkey FOREIGN KEY (que_id) REFERENCES public.questions(que_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_ans user_ans_que_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shreyas
--

ALTER TABLE ONLY public.user_ans
    ADD CONSTRAINT user_ans_que_id_fkey FOREIGN KEY (que_id) REFERENCES public.questions(que_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_ans user_ans_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shreyas
--

ALTER TABLE ONLY public.user_ans
    ADD CONSTRAINT user_ans_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_record user_record_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shreyas
--

ALTER TABLE ONLY public.user_record
    ADD CONSTRAINT user_record_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

