import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Orion.css'; // Ensure you import the CSS file

const Orion = () => {
  return (
    <div className="container">
      <div className="link-container">
        <Link to="/codeeditor">Go to Code Editor</Link>
      </div>
      <div className="link-container">
        <Link to="/compiler">Go to Compiler</Link>
      </div>
      <div className="link-container">
        <Link to="/codeass">Go to Coding Assistant</Link>
      </div>
    </div>
  );
};

export default Orion;
