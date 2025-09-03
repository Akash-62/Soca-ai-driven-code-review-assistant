import React from 'react';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  placeholder?: string;
  id?: string;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, setCode, placeholder, id }) => {
  return (
    <textarea
      id={id}
      value={code}
      onChange={(e) => setCode(e.target.value)}
      placeholder={placeholder}
      className="w-full h-full p-4 bg-code-bg text-text-primary font-mono border-2 border-code-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-300 placeholder-text-secondary/50"
    />
  );
};

export default CodeInput;