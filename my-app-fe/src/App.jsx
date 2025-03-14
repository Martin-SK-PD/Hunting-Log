import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


import Layout from './components/layout'
import Login_welcome_page from './components/login_welcome_page';
import Visits_log from './components/visits_log';

function App() {
  
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login_welcome_page />} />
          <Route path="navstevy" element={<Visits_log />} />
         
        </Route>
      </Routes>
    </BrowserRouter>
          
  );
}

export default App
