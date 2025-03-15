import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


import Layout from './components/layout'
import Login_welcome_page from './components/login_welcome_page';
import Visits_log from './components/visits_log';
import Hunting_log from './components/hunting_log';
import Registration from './components/registration_page';

function App() {
  
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login_welcome_page />} />
          <Route path="navstevy" element={<Visits_log />} />
          <Route path="ulovky" element={<Hunting_log />} />
          <Route path="registracia" element={<Registration />} />
        </Route>
      </Routes>
    </BrowserRouter>
          
  );
}

export default App
