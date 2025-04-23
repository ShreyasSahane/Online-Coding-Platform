import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import "../styles/CodeEditor.css";

const CodeEditor = ({ language, value, onChange, predefinedCode }) => {
  const [code, setCode] = useState(value || predefinedCode || "// Start coding here");

  useEffect(() => {
    if (predefinedCode) {
      setCode(predefinedCode);
    }
  }, [predefinedCode]);

  const handleChange = (value) => {
    setCode(value);
    onChange && onChange(value);
  };

  const getLanguage = () => {
    switch (language) {
      case "python":
        return python();
      case "java":
        return java();
      case "c":
        return cpp();
      case "javascript":
      default:
        return javascript();
    }
  };

  return (
    <div className="editor-section">
      <CodeMirror
        value={code}
        extensions={[getLanguage()]}
        onChange={handleChange}
        height="100%"
        theme={dracula}
        className="code-editor"
        options={{
          lineNumbers: true,
          scrollbarStyle: "overlay",
        }}
      />
    </div>
  );
};

export default CodeEditor;
