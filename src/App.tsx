import './App.css';
import Navbar from './components/Navbar';
import ReportList from './pages/ReportList';
import ReportForm from './pages/ReportForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='app'>
          <Navbar />
          <div className='content'>
            <Routes>
              <Route path="/" element={<ReportList />} />
              <Route path="/add-report/:id?" element={<ReportForm />} />
            </Routes>
          </div>
      </div>
    </Router>
  )
}

export default App
