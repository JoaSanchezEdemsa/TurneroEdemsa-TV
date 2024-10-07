import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [time, setTime] = useState(new Date());

  // Hook para actualizar la hora actual
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container">
      {/* Título de la tabla */}
      <h1 className="title">Ciudad</h1>
      
      {/* Reloj en la esquina superior derecha */}
      <div className="time">{time.toLocaleTimeString()}</div>

      {/* Tabla de la lista */}
      <table className="city-table">
        <thead>
          <tr>
            <th>Sector</th>
            <th>Nombre</th>
            <th>DNI</th>
          </tr>
        </thead>
        <tbody>
          {/* Puedes agregar filas de datos aquí si lo deseas */}
          <tr>
            <td>Caja 1</td>
            <td>Pepe</td>
            <td>47259398</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
