import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './Pantalla';
import SeleccionSucursal from './Seleccion-Sucursal';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Router>
      
      <Routes>
        <Route path="/" element={<Navigate to="/sucursal" />} />
        <Route path="/sucursal" element={< SeleccionSucursal/>} /> 
        <Route path="/pantalla" element={<App />} />
      </Routes>
  
</Router>
);


