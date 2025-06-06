import { useState } from "react";

const InputField = ({ type, placeholder, icon, value, onChange, name }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <div className="input-wrapper">
      <input
        type={isPasswordShown ? 'text' : type}
        placeholder={placeholder}
        className="input-field"
        required
        value={value}
        onChange={onChange}
        name={name}  // Add the name prop to match with form data
      />

      <i className="material-symbols-rounded">
        {icon}
      </i>

      {type === 'password' && (
        <i
          onClick={() => setIsPasswordShown(prevState => !prevState)}
          className="material-symbols-rounded eye-icon"
        >
          {isPasswordShown ? 'visibility' : 'visibility_off'}
        </i>
      )}
    </div>
  );
};

export default InputField;
