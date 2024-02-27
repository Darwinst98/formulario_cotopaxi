import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navegacion/Navbar';
import Inicio from './components/paginas/Inicio';
import Formulario from './components/paginas/Formulario';

function App(){

  return(
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='/formulario' element={<Formulario />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
