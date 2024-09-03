import React from 'react';
import { Link } from 'react-router-dom';


const Orion = () => {
  return (
    <div>
      <div>
        <Link to="/codeeditor">Go to Code Editor</Link>
      </div>
      <div>
        <Link to="/compiler">Go to Compiler</Link>
      </div>
      <div>
        <Link to="/codeass">Go to Coding Assistant</Link>
      </div>
    </div>
  );
};

export default Orion;
