import React from 'react';
import '../styles/CompilationResult.css';

const CompilationResult = ({ result }) => {
  return (
    <div className="compilation-result">
      <h3>Compilation Result</h3>
      <textarea 
        readOnly 
        placeholder="Compilation result will appear here..." 
        value={result || ""} // Ensure value is never undefined
      />
    </div>
  );
};

export default CompilationResult;
