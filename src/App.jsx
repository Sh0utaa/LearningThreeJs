import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Import your components
import TaskST011 from './TaskST011/TaskST011';
import TaskST012 from './TaskST012/TaskST012';
import TaskST013 from './TaskST013/TaskST013';
import TaskST014 from './TaskST014/TaskST014';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/task011" element={<TaskST011 />} />
      <Route path="/task012" element={<TaskST012 />} />
      <Route path="/task013" element={<TaskST013 />} />
      <Route path="/task014" element={<TaskST014 />} />
      <Route
        path="*"
        element={
          <div>
            <nav>
              <ul>
                <li><Link to="/task011">Task 011</Link></li>
                <li><Link to="/task012">Task 012</Link></li>
                <li><Link to="/task013">Task 013</Link></li>
                <li><Link to="/task014">Task 014</Link></li>
              </ul>
            </nav>
          </div>
        }
      />
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
