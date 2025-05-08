import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Import your components
import TaskST011 from './TaskST011/TaskST011';
import TaskST012 from './TaskST012/TaskST012';
import TaskST013 from './TaskST013/TaskST013';
import TaskST014 from './TaskST014/TaskST014';
import TaskST016 from './TaskST016/TaskST016';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/task011" element={<TaskST011 />} />
      <Route path="/task012" element={<TaskST012 />} />
      <Route path="/task013" element={<TaskST013 />} />
      <Route path="/task014" element={<TaskST014 />} />
      <Route path='/task016' element={<TaskST016 />} />
      <Route
        path="*"
        element={
          <div>
            <nav>
              <ul>
                <li>
                  {/* <Link to="/task011">Task 011</Link> */}
                  <a href="/task011">Task011</a>
                </li>
                <li>
                  <a href="/task012">Task012</a>
                </li>
                <li>
                  <a href="/task013">Task013</a>
                </li>
                <li>
                  <a href="https://task-st014.vercel.app/">Task014</a>
                </li>
                <li>
                  <a href="/task016">Task016</a>
                </li>
                <li>
                  <a href="https://web-ar-three-js.vercel.app">Web AR</a>
                </li>
              </ul>
            </nav>
          </div>
        }
      />
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
