import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import '../styles/CodeEditor.css'; 

function CodeEditor() {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');

  useEffect(() => {
    const generatePreview = () => {
      const frame = document.getElementById('preview-frame');
      const doc = frame.contentDocument || frame.contentWindow.document;

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
        </html>
      `);
      doc.close();
    };

    generatePreview();
  }, [html, css, js]);

  return (
    <div className="code-editor-container">
      <div className="editor-pane">
        <h2>HTML</h2>
        <AceEditor
          mode="html"
          theme="github"
          name="html-editor"
          value={html}
          onChange={setHtml}
          editorProps={{ $blockScrolling: true }}
          height="33%"
          width="100%"
          className="ace_editor"
        />
        <h2>CSS</h2>
        <AceEditor
          mode="css"
          theme="github"
          name="css-editor"
          value={css}
          onChange={setCss}
          editorProps={{ $blockScrolling: true }}
          height="33%"
          width="100%"
          className="ace_editor"
        />
        <h2>JavaScript</h2>
        <AceEditor
          mode="javascript"
          theme="github"
          name="js-editor"
          value={js}
          onChange={setJs}
          editorProps={{ $blockScrolling: true }}
          height="33%"
          width="100%"
          className="ace_editor"
        />
      </div>
      <iframe
        id="preview-frame"
        title="Preview"
      />
    </div>
  );
}

export default CodeEditor;
