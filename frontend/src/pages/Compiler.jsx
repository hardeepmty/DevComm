import React, { useState } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';

// Import Ace modes for each language
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
// Import Ace theme
import 'ace-builds/src-noconflict/theme-github';
import '../styles/Compiler.css'; 

function Compiler() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode('');  // Clear the code when language changes
  };

  const executeCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/execute', {
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
    <div className="code-editor-container">
      <div className="editor-pane">
        <h2>Code Editor</h2>
        <label htmlFor="language-select">Choose Language:</label>
        <select
          id="language-select"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="c_cpp">C++</option>
        </select>
        
        <AceEditor
          mode={language}
          theme="github"
          name="code-editor"
          value={code}
          onChange={setCode}
          editorProps={{ $blockScrolling: true }}
          height="300px"
          width="100%"
          className="ace_editor"
        />

        <button onClick={executeCode}>Run Code</button>
        
        <h2>Output</h2>
        <pre className="output-pane">{output}</pre>
      </div>
    </div>
  );
}

export default Compiler;
