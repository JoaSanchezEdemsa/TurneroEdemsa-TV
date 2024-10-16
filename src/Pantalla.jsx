import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa axios
import './Pantalla.css';

function App() {
  const [time, setTime] = useState(new Date());
  const [cajas, setCajas] = useState([]); // Estado para almacenar las cajas
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [isWithinTime, setIsWithinTime] = useState(true); // Estado para controlar si está dentro del horario permitido
  const [previousResaltar, setPreviousResaltar] = useState(false); // Estado para rastrear si ya se reprodujo el sonido

  // Hook para actualizar la hora actual
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  // Hook para obtener las cajas al montar el componente y actualizar cada segundo
  useEffect(() => {
    const fetchCajas = async () => {
      if (!isWithinTime) return; // No hace nada si no está dentro del horario


      try {
        let COD_UNICOM = localStorage.getItem("COD_UNICOM");
        const response = await axios.get(`http://turnero:8080/tv/status?COD_UNICOM=${COD_UNICOM}`);

        if (response.data.success) {
          const cajasArray = Object.values(response.data.result);
          const hasResaltar = cajasArray.some(caja => caja.resaltar === 1);

          // sonido si resaltar es 1 y si sessionstorage es distinto a 1
          cajasArray.forEach((caja, index) => {            

            if (caja.resaltar == 1 && sessionStorage.getItem(`sonar_${index}`) != 1) {// si resaltar es 1 y sessionstorage distinto a 1
              const dingSound = new Audio('/ding.mp3'); // Crear el objeto de sonido
              dingSound.play(); // Reproducir sonido
              sessionStorage.setItem(`sonar_${index}`, 1);//luego de hacer sonar cambiar el sessionstorage a 1
            }
            if (caja.resaltar == 0) {
              sessionStorage.setItem(`sonar_${index}`, 0);
            }


          });

          setPreviousResaltar(hasResaltar); // Actualiza el estado para la siguiente comparación
          setCajas(cajasArray); // Almacena las cajas en el estado
        } else {
          setError('No se pudieron obtener las cajas');
        }
      } catch (error) {
        console.error('Error fetching cajas:', error);
        setError('Error al cargar las cajas');
      } finally {
        setLoading(false); 
      }
    };

    fetchCajas(); // Llama a la función al montar el componente

    const interval = setInterval(() => {
      fetchCajas(); // Actualiza las cajas cada 1 segundo
    }, 1000);

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonte
  }, [isWithinTime, previousResaltar]); // Ejecuta cuando isWithinTime o previousResaltar cambien

  // Si no está dentro del horario, muestra un mensaje
  if (!isWithinTime) {
    return <p>La aplicación está fuera del horario de atención. Vuelve entre las 7:30 AM y las 16:00 PM.</p>;
  }

  if (loading) {
    return <p>Cargando cajas...</p>; // Mensaje mientras se cargan los datos
  }

  if (error) {
    return <p>{error}</p>; // Mensaje si hubo un error
  }


  return (
    <div className="container">
      <h1 className="title">TURNOS</h1>
      <div className="time">{time.toLocaleTimeString()}</div>
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
              <td className={caja.resaltar === 1 ? 'resaltar' : ''}>
                {caja.caja}
              </td>
              <td className={caja.resaltar === 1 ? 'resaltar' : ''}>
                {caja.cliente || '-----'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
