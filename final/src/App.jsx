// App.jsx
import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/Login/LoginPage";
import Signup from "./components/Login/Signup";
import ForgotPassword from "./components/Login/ForgotPassword";
import SocialLogin from "./components/Login/SocialLogin";
import Dashboard1 from './components/Dashboard/Dashboard1'
import Editor from './components/Editor/EditorRoot'
// import Submission from './components/Editor/editor_components/submission'
import 'bootstrap/dist/css/bootstrap.min.css';
import Problem from './components/Problems/ProblemPage'
import AdminLogin from "./components/Admin/AdminLogin";
import ProblemsHandling from "./components/Admin/ProblemsHandling";
import ProblemSubmissions from "./components/Admin/ProblemSubmissions"

const AppWrapper = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} /> 
      <Route path="/signup" element={<Signup />} /> {/* Signup page route */}
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/social-login" element={<SocialLogin />} /> {/* Social login page */}
      <Route path="/Dashboard" element={<Dashboard1 />} /> 
      <Route path="/Problem" element={<Problem />} /> 
      <Route path="/editor" element={<Editor />} /> 
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-problems" element={<ProblemsHandling/>} />
      <Route path="/get-submissions" element={<ProblemSubmissions/>} />
      {/* <Route path="/submissions" element={<Submission />} /> */}
    </Routes>
  );
};

export default AppWrapper;
