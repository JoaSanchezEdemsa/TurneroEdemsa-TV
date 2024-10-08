import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa axios
import './App.css';

function App() {
  const [time, setTime] = useState(new Date());
  const [cajas, setCajas] = useState([]); // Estado para almacenar las cajas
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Hook para actualizar la hora actual
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Hook para obtener las cajas
  useEffect(() => {
    const fetchCajas = async () => {
      try {
        const response = await axios.get('http://turnero:8080/tv/status', {
          COD_UNICOM: '1200' 
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Cajas obtenidas:', response.data); // Imprimir los datos en la consola
        
        // Verifica si la respuesta es exitosa
        if (response.data.success) {
          // Convierte el objeto de resultados en un array
          const cajasArray = Object.values(response.data.result);
          setCajas(cajasArray); // Almacena las cajas en el estado
        } else {
          setError('No se pudieron obtener las cajas');
        }
      } catch (error) {
        console.error('Error fetching cajas:', error);
        setError('Error al cargar las cajas'); // Establece un mensaje de error
      } finally {
        setLoading(false); // Termina la carga
      }
    };

    fetchCajas(); // Llama a la función al montar el componente
  }, []);

  if (loading) {
    return <p>Cargando cajas...</p>; // Mensaje mientras se cargan los datos
  }

  if (error) {
    return <p>{error}</p>; // Mensaje si hubo un error
  }

  return (
    <div className="container">
      {/* Título de la tabla */}
      <h1 className="title">Sucursal</h1>
      
      {/* Reloj en la esquina superior derecha */}
      <div className="time">{time.toLocaleTimeString()}</div>

      {/* Tabla de la lista */}
      <table className="city-table">
        <thead className='cabecera'>
          <tr>
            <th>SECTOR</th>
            <th>CLIENTE</th>
          </tr>
        </thead>
        <tbody className='boxes'>
          {cajas.map((caja, index) => (
            <tr key={index}>
              <td>{caja.caja}</td> {/* Muestra el nombre de la caja */}
              <td>{caja.cliente || 'N/A'}</td> {/* Muestra el cliente o 'N/A' si es null */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
