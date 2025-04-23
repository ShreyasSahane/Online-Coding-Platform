import { Link } from "react-router-dom";
const SocialLogin = () => {
  return (
    <div className="social-login">
        <button className="social-button">
          <img src="./src/images/Login/google.svg" alt="Google" className="social-icon" />
          Google
        </button>

        <button className="social-button">
          <img src="./src/images/Login/apple.svg" alt="Apple" className="social-icon" />
          Apple
        </button>
      </div>
  )
}

export default SocialLogin