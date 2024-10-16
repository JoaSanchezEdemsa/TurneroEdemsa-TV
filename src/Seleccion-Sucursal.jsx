import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SeleccionSucursal.css';

const SeleccionSucursal = () => {
  const [sucursales, setSucursales] = useState([]);
  const [sucursal, setSucursal] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showBtn, setShowBtn] = useState('');

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await axios.get('http://turnero:8080/getsucursales');
  
        // Verifica si la respuesta es un array
        if (Array.isArray(response.data)) {
          setSucursales(response.data);
        } else {
          console.error('La respuesta no es válida:', response.data);
          setError('Error: la respuesta de la API no es válida.');
        }
      } catch (error) {
        console.error('Error fetching sucursales:', error);
        setError('Error al cargar las sucursales');
      } finally {
        setLoading(false);
      }
    };
  
    fetchSucursales();
  }, []);
  

  const handleSucursalChange = (e) => {
    //setSucursal(e.target.value);
    setSucursal(e.target.value);
    setShowBtn(true);
  };

  const handleIniciarClick = async () => {
    localStorage.setItem('COD_UNICOM', sucursal);
    console.log('COD_UNICOM a enviar:', sucursal); // Agrega este log
    try {
    //  const response = await axios.get(`http://turnero:8080/tv/status?COD_UNICOM=${sucursal}`);
     // console.log('Respuesta del backend:', response.data);
      navigate('/pantalla');
    } catch (error) {
      console.error('Error al enviar COD_UNICOM al backend:', error);
    }
  };
  
  

  if (loading) {
    return <p>Cargando sucursales...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (sucursales.length === 0) {
    return <p>No hay sucursales disponibles.</p>;
  }

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
          {sucursales.map((suc, index) => (
            <option key={index} value={suc.COD_UNICOM} > {/* Usar COD_UNICOM como valor */}
            
              {suc.NOM_UNICOM} {/* Muestra el nombre en el desplegable */}
            </option>
          ))}
        </select>
      </div>
      {showBtn && (
        <button onClick={handleIniciarClick}>Iniciar</button>
      )}
    </div>
  );
};

export default SeleccionSucursal;
