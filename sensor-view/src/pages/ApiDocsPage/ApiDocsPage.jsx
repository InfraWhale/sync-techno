import React from 'react';
import './ApiDocsPage.style.css';

const ApiDocsPage = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  return (
    <div className="api-docs-container">
      <iframe
        title="Swagger UI"
        src={`${API_BASE_URL}/api-docs/`}
        className="api-docs-iframe"
      />
    </div>
  );
};

export default ApiDocsPage;