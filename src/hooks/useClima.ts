import { useEffect, useState } from "react";
import { obtenerPronostico, DatosDelDia } from "../servicios/apiDelClima";

export const useClima = (coords?: { latitude: number; longitude: number }) => {
  const [pronostico, setPronostico] = useState<DatosDelDia[]>([]);
  const [indiceActual, setIndiceActual] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [coords?.latitude, coords?.longitude]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      const resultado = await obtenerPronostico(coords);
      setPronostico(resultado.datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error en useClima:", err);
    } finally {
      setCargando(false);
    }
  };

  const irAlAnterior = () => {
    if (indiceActual > 0) {
      setIndiceActual(indiceActual - 1);
    }
  };

  const irAlSiguiente = () => {
    if (indiceActual < pronostico.length - 1) {
      setIndiceActual(indiceActual + 1);
    }
  };

  const climaActual = pronostico[indiceActual];

  return {
    pronostico,
    climaActual,
    indiceActual,
    cargando,
    error,
    irAlAnterior,
    irAlSiguiente,
    recargar: cargarDatos,
  };
};