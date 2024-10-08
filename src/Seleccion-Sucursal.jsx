import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import axios from 'axios'; // Importa axios
import './SeleccionSucursal.css';

const SeleccionSucursal = () => {
  const [sucursales, setSucursales] = useState([]); // Estado para almacenar las sucursales
  const [sucursal, setSucursal] = useState('');
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    // Función para obtener sucursales del backend
    const fetchSucursales = async () => {
      try {
        const response = await axios.get('http://turnero:8080/getsucursales');
        console.log('Sucursales obtenidas:', response.data); // Imprimir los datos en la consola

        if (response.data.success && Array.isArray(response.data.result)) {
          setSucursales(response.data.result); // Almacena las sucursales en el estado
        } else {
          console.error('La respuesta no es válida:', response.data);
          setError('Error: la respuesta de la API no es válida.');
        }
      } catch (error) {
        console.error('Error fetching sucursales:', error);
        setError('Error al cargar las sucursales'); // Establece un mensaje de error
      } finally {
        setLoading(false); // Termina la carga
      }
    };

    fetchSucursales(); // Llama a la función al montar el componente
  }, []);

  const handleSucursalChange = (e) => {
    setSucursal(e.target.value);
  };

  const handleIniciarClick = () => {
    navigate('/pantalla'); // Redirige a la página principal
  };

  if (loading) {
    return <p>Cargando sucursales...</p>; // Mensaje mientras se cargan los datos
  }

  if (error) {
    return <p>{error}</p>; // Mensaje si hubo un error
  }

  if (sucursales.length === 0) {
    return <p>No hay sucursales disponibles.</p>; // Mensaje si no hay sucursales
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
            <option key={index} value={suc.NOM_UNICOM}> {/* Usar COD_UNICOM como valor */}
              {suc.NOM_UNICOM} {/* Muestra el nombre en el desplegable */}
            </option>
          ))}
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
