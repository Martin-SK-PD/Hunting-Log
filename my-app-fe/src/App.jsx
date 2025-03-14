import './App.css'

import Navigation from './components/navigation';
import Footer from "./components/footer"; 
import { BrowserRouter } from 'react-router-dom'

function App() {
  
  return (
    
    <BrowserRouter>
      <Navigation />
      <main />
      <Footer />
    </BrowserRouter>
          
  );
}

export default App
 