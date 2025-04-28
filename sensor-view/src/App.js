import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import SimulatorPage from './pages/SimulatorPage/SimulatorPage';
import ApiDocsPage from './pages/ApiDocsPage/ApiDocsPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/api-docs-viewer" element={<ApiDocsPage />} />
      </Routes>
    </>
  );
}

export default App;