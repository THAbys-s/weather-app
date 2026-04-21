const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export interface DatosDelDia {
  label: string;
  temp: number;
  min: number;
  max: number;
  condition: string;
  humidity: number;
  wind: number;
  pressure: number;
  isDay: boolean;
}

export interface RespuestaDelClima {
  current: {
    is_day: number;
  };
  forecast: {
    forecastday: Array<{
      day: {
        avgtemp_c: number;
        mintemp_c: number;
        maxtemp_c: number;
        condition: {
          text: string;
        };
        avghumidity: number;
        maxwind_kph: number;
      };
      hour: Array<{
        pressure_mb: number;
      }>;
    }>;
  };
}

const mapearDia = (
  datosDia: any,
  etiqueta: string,
  esDeDay: boolean
): DatosDelDia => ({
  label: etiqueta,
  temp: datosDia.day.avgtemp_c,
  min: datosDia.day.mintemp_c,
  max: datosDia.day.maxtemp_c,
  condition: datosDia.day.condition.text,
  humidity: datosDia.day.avghumidity,
  wind: datosDia.day.maxwind_kph,
  pressure: datosDia.hour[0].pressure_mb,
  isDay: esDeDay,
});

export const obtenerPronostico = async (
  ciudad: string = "Buenos Aires"
): Promise<DatosDelDia[]> => {
  try {
    const respuesta = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${ciudad}&days=3&aqi=no&alerts=no`
    );

    if (!respuesta.ok) {
      throw new Error(`Error en la API: ${respuesta.status}`);
    }

    const datos: RespuestaDelClima = await respuesta.json();
    const esDeDay = datos.current.is_day === 1;

    const pronostico = [
      mapearDia(datos.forecast.forecastday[0], "Ayer", esDeDay),
      mapearDia(datos.forecast.forecastday[1], "Hoy", esDeDay),
      mapearDia(datos.forecast.forecastday[2], "Mañana", esDeDay),
    ];

    return pronostico;
  } catch (error) {
    console.error("Error obteniendo pronóstico:", error);
    throw error;
  }
};
