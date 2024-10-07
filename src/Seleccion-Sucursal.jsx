import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './SeleccionSucursal.css';

const SeleccionSucursal = () => {
  const [sucursal, setSucursal] = useState('');
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSucursalChange = (e) => {
    setSucursal(e.target.value);
  };

  const handleIniciarClick = () => {
    navigate('/pantalla'); // Redirige a la página principal
  };

  return (
    <div className="sucursal-container">
      <div>
        <label>Sucursal</label>
        <select 
          value={sucursal} 
          onChange={handleSucursalChange} 
          required 
        >
          <option value="">Seleccione...</option>
          <option value="Sucursal Lujan de Cuyo">Sucursal Lujan de Cuyo</option>
          <option value="Sucursal Gueymallen">Sucursal Gueymallen</option>
          <option value="Sucursal Godoy Cruz">Sucursal Godoy Cruz</option>
          <option value="Sucursal San Rafael">Sucursal San Rafael</option>
          <option value="Sucursal Lavalle">Sucursal Lavalle</option>
        </select>
      </div>
      {sucursal && <p>Sucursal seleccionada: {sucursal}</p>}
      {/* El botón "Iniciar" solo se renderiza si hay una sucursal seleccionada */}
      {sucursal && (
        <button onClick={handleIniciarClick}>Iniciar</button>
      )}
    </div>
  );
};

export default SeleccionSucursal;
