import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.style.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>싱크테크노 과제 페이지</h1>
      <div className="home-buttons">
        <button className="home-btn simulator" onClick={() => navigate('/simulator')}>
          시뮬레이터로 이동
        </button>
        <button className="home-btn api" onClick={() => navigate('/api-docs-viewer')}>
          API 문서 보기
        </button>
      </div>
    </div>
  );
};

export default HomePage;
