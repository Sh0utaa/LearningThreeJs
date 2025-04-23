import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Import your components
import TaskST011 from './TaskST011/TaskST011'
import TaskST012 from './TaskST012/TaskST012'
import TaskST013 from './TaskST013/TaskST013'
import TaskST014 from "./TaskST014/TaskST014"
// Add more as needed

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/task011" element={<TaskST011 />} />
      <Route path="/task012" element={<TaskST012 />} />
      <Route path="/task013" element={<TaskST013 />} />
      <Route path="/task014" element={<TaskST014 />} />
      {/* Add more routes here */}
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  </BrowserRouter>
)

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
