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
  const [isWithinTime, setIsWithinTime] = useState(true); // Estado para controlar si está dentro del horario permitido
  const [showBtn, setShowBtn] = useState('');

  // Hook para verificar si la hora actual está dentro del rango permitido
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const start = new Date();
      const end = new Date();

      start.setHours(7, 30, 0); 
      end.setHours(16, 0, 0);  

      // Verifica si la hora actual está dentro del rango
      setIsWithinTime(now >= start && now <= end);
    };

    checkTime(); // Llama a la función al montar el componente

    // También verifica cada minuto si la hora ha cambiado
    const timeCheckInterval = setInterval(checkTime, 10000);

    return () => clearInterval(timeCheckInterval); 
  }, []);


  useEffect(() => {
    const fetchSucursales = async () => {
      if (!isWithinTime) return; // No hace nada si no está dentro del horario

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
    setSucursal(e.target.value);
    setShowBtn(true);
  };

  const handleIniciarClick = async () => {
    localStorage.setItem('COD_UNICOM', sucursal);
    console.log('COD_UNICOM a enviar:', sucursal); 
    try {
      navigate('/pantalla');
    } catch (error) {
      console.error('Error al enviar COD_UNICOM al backend:', error);
    }
  };
  
  // Si no está dentro del horario, muestra un mensaje
  if (!isWithinTime) {
    return <p>La aplicación está fuera del horario de atención. Vuelve entre las 7:30 AM y las 16:00 PM.</p>;
  }

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
