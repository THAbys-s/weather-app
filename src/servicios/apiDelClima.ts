const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export interface DatosDelDia {
  date: Date;
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

export interface ResultadoPronostico {
  datos: DatosDelDia[];
  ciudad: string;
}

interface DiaAPI {
  date: string;
  day: {
    avgtemp_c: number;
    mintemp_c: number;
    maxtemp_c: number;
    condition: { text: string };
    avghumidity: number;
    maxwind_kph: number;
  };
  hour: Array<{ pressure_mb: number }>;
}

interface ForecastResponse {
  location: { name: string };
  current: { is_day: number };
  forecast: { forecastday: DiaAPI[] };
}

interface HistoryResponse {
  forecast: { forecastday: DiaAPI[] };
}

const toLocalDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const obtenerLabel = (fecha: Date): string => {
  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1);
  const manana = new Date();
  manana.setDate(hoy.getDate() + 1);
  const misma = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (misma(fecha, ayer)) return "Ayer";
  if (misma(fecha, hoy)) return "Hoy";
  if (misma(fecha, manana)) return "Mañana";
  return fecha.toLocaleDateString();
};

const mapearDia = (datosDia: DiaAPI, isDay: boolean): DatosDelDia => {
  const fecha = new Date(datosDia.date + "T00:00:00");
  return {
    date: fecha,
    label: obtenerLabel(fecha),
    temp: datosDia.day.avgtemp_c,
    min: datosDia.day.mintemp_c,
    max: datosDia.day.maxtemp_c,
    condition: datosDia.day.condition.text,
    humidity: datosDia.day.avghumidity,
    wind: datosDia.day.maxwind_kph,
    pressure: datosDia.hour?.[0]?.pressure_mb ?? 0,
    isDay,
  };
};

export const obtenerPronostico = async (
  coords?: { latitude: number; longitude: number },
  ciudad: string = "Buenos Aires"
): Promise<ResultadoPronostico> => {
  const query = coords ? `${coords.latitude},${coords.longitude}` : ciudad;

  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const fechaAyer = toLocalDateString(ayer); // ← fix clave

  const [resAyer, resForecast] = await Promise.all([
    fetch(`https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${query}&dt=${fechaAyer}`),
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=2`),
  ]);

  const datosForecast: ForecastResponse = await resForecast.json();
  const isDay = datosForecast.current.is_day === 1;
  const resultado: DatosDelDia[] = [];

  if (resAyer.ok) {
    const datosAyer: HistoryResponse = await resAyer.json();
    resultado.push(mapearDia(datosAyer.forecast.forecastday[0], isDay));
  }

  datosForecast.forecast.forecastday.forEach((d) => {
    resultado.push(mapearDia(d, isDay));
  });

  return {
    datos: resultado.slice(0, 3),
    ciudad: datosForecast.location.name,
  };
};