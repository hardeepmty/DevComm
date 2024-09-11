import React, { useState } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import '../styles/Compiler.css';  

function Compiler() { 
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode('');  
  };

  const executeCode = async () => {
    try {
      const response = await axios.post('https://devcomm.onrender.com/execute', {
        language,
        code,
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error executing code');
      console.error(error);
    }
  };

  return (
    <div className="custom-compiler-container">
      <div className="custom-editor-pane">
        <div className="custom-header">
          <h2>Code Editor</h2>
          <div className="custom-language-select">
            <label htmlFor="language-select">Language:</label>
            <select
              id="language-select"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="c_cpp">C++</option>
            </select>
          </div>
        </div>

        <AceEditor
          mode={language}
          theme="monokai"
          name="custom-code-editor"
          value={code}
          onChange={setCode}
          editorProps={{ $blockScrolling: true }}
          height="400px"
          width="100%"
          className="custom-ace-editor"
        />

        <button className="custom-run-button" onClick={executeCode}>Run Code</button>
        
        <h2>Output</h2>
        <pre className="custom-output-pane">{output}</pre>
      </div>
    </div>
  );
}

export default Compiler;
