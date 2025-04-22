import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import WebAR from './pages/WebAR'
import ST011 from './pages/tasks/ST011'
import ST012 from './pages/tasks/ST012'
import ST014 from './pages/tasks/ST014'

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/webar">WebAR</Link>
        <Link to="/task/st011">Task 011</Link>
        <Link to="/task/st012">Task 012</Link>
        <Link to="/task/st014">Task 014</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/webar" element={<WebAR />} />
        <Route path="/task/st011" element={<ST011 />} />
        <Route path="/task/st012" element={<ST012 />} />
        <Route path="/task/st014" element={<ST014 />} />
      </Routes>
    </>
  )
}
