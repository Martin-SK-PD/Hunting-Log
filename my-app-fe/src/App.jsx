import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


import Layout from './components/layout'
import Login_welcome_page from './components/login_welcome_page';

function App() {
  
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login_welcome_page />} />
        </Route>
      </Routes>
    </BrowserRouter>
          
  );
}

export default App
 