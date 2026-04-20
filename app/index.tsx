import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Button } from '../components/ui/button';
import { LinearGradient } from "expo-linear-gradient";
import WeatherIcon from "../components/Weather-Icon";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

const { width } = Dimensions.get('window');

// Componente reutilizable para las tarjetas de métricas
const MetricCard = ({ colors, footerColor, label, value, unit, children }: any) => (
  <View style={styles.card}>
    <LinearGradient colors={colors} style={styles.cardBody}>
      <View style={styles.iconPlaceholder}>
        {/* PEGA AQUÍ TU SVG */}
        {children}
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardUnit}>{unit}</Text>
      </View>
    </LinearGradient>
    <View style={[styles.cardFooter, { backgroundColor: footerColor }]}>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  </View>
);

const gradients: any = {
  Sunny: ["#f6d365", "#fda085"],
  Clear: ["#f6d365", "#fda085"],
  Cloudy: ["#89f7fe", "#66a6ff"],
  Overcast: ["#89f7fe", "#66a6ff"],
  Rain: ["#4facfe", "#00f2fe"],
  Snow: ["#e0eafc", "#cfdef3"],
  Thunderstorm: ["#667db6", "#485563"],
};

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export default function App() {
  const [weather, setWeather] = useState<any[]>([]);
  const [index, setIndex] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=Buenos Aires&days=3&aqi=no&alerts=no`
      );
      const data = await res.json();
      const isDay = data.current.is_day === 1;

      const formatted = [
        mapDay(data.forecast.forecastday[0], "Ayer", isDay),
        mapDay(data.forecast.forecastday[1], "Hoy", isDay),
        mapDay(data.forecast.forecastday[2], "Mañana", isDay),
      ];
      setWeather(formatted);
    } catch (err) {
      console.log("ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const mapDay = (f: any, label: string, isDay: boolean) => ({
    label,
    temp: f.day.avgtemp_c,
    min: f.day.mintemp_c,
    max: f.day.maxtemp_c,
    condition: f.day.condition.text,
    humidity: f.day.avghumidity,
    wind: f.day.maxwind_kph,
    pressure: f.hour[0].pressure_mb, // Extraído de la primera hora del día
    isDay,
  });

  const goPrev = () => index > 0 && setIndex(index - 1);
  const goNext = () => index < 2 && setIndex(index + 1);

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" /></View>;
  if (!weather.length) return <View style={styles.loader}><Text>Error</Text></View>;

  const current = weather[index];
  const baseCondition = Object.keys(gradients).find((key) => current.condition.includes(key));

  return (
    <LinearGradient
      colors={gradients[baseCondition!] || ["#89f7fe", "#66a6ff"]}
      style={styles.container}
    >
      <Text style={styles.city}>BUENOS AIRES</Text>

      <View style={styles.nav}>
        <Button variant="ghost" size="icon" onPress={goPrev}>
          <ChevronLeft color="white" size={28} />
        </Button>
        <Text style={styles.day}>{current.label.toUpperCase()}</Text>
        <Button variant="ghost" size="icon" onPress={goNext}>
          <ChevronRight color="white" size={28} />
        </Button>
      </View>

      <WeatherIcon condition={current.condition} isDay={current.isDay} />

      <Text style={styles.temp}>{Math.round(current.temp)}°</Text>
      
      <Text style={styles.minMax}>
        Min: {Math.round(current.min)}°   Max: {Math.round(current.max)}°
      </Text>

      {/* --- NUEVA SECCIÓN DE TARJETAS DE MÉTRICAS --- */}
      <View style={styles.metricsRow}>
        <MetricCard 
          colors={['#D62B4A', '#7A1024']} 
          footerColor="#5A0C1B" 
          label="Wind" 
          value={current.wind} 
          unit="km/h"
        >
          {/* AQUÍ TU SVG DE VIENTO */}
        </MetricCard>

        <MetricCard 
          colors={['#C73E8F', '#5E1B44']} 
          footerColor="#4A1536" 
          label="Humidity" 
          value={current.humidity} 
          unit="%"
        >
          {/* AQUÍ TU SVG DE HUMEDAD */}
        </MetricCard>

        <MetricCard 
          colors={['#9B5B8A', '#2E1529']} 
          footerColor="#1F0E1B" 
          label="Pressure" 
          value={current.pressure} 
          unit="hpa"
        >
          {/* AQUÍ TU SVG DE PRESIÓN */}
        </MetricCard>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  city: { fontSize: 28, fontWeight: "bold", color: "white", marginBottom: 10 },
  nav: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  day: { fontSize: 22, color: "white", fontWeight: "600" },
  temp: { fontSize: 90, color: "white", fontWeight: "200" },
  minMax: { fontSize: 18, color: "white", marginBottom: 30 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Estilos de las tarjetas
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  card: {
    width: (width - 60) / 3, // Ajuste dinámico para 3 columnas
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardBody: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  iconPlaceholder: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardUnit: {
    color: 'white',
    fontSize: 10,
    marginLeft: 2,
    opacity: 0.8,
  },
  cardFooter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});