import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Button } from '../components/ui/button';
import { LinearGradient } from "expo-linear-gradient";
import WeatherIcon from "../components/Weather-Icon";
import { ChevronLeft, ChevronRight } from "lucide-react-native";


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
  isDay,
  });

  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const goNext = () => {
    if (index < 2) setIndex(index + 1);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!weather.length) {
    return (
      <View style={styles.loader}>
        <Text>Error cargando datos</Text>
      </View>
    );
  }

  const current = weather[index];

  // Normalizamos condición (WeatherAPI tira textos tipo "Light rain")
  const baseCondition = Object.keys(gradients).find((key) =>
    current.condition.includes(key)
  );

  return (
    <LinearGradient
      colors={gradients[baseCondition!] || ["#89f7fe", "#66a6ff"]}
      style={styles.container}
    >
      {/* CIUDAD */}
      <Text style={styles.city}>BUENOS AIRES</Text>

      {/* NAV */}
      <View style={styles.nav}>
        <Button variant="ghost" size="icon" onPress={goPrev}>
          <ChevronLeft color="white" size={28} />
        </Button>

        <Text style={styles.day}>
          {current.label.toUpperCase()}
        </Text>

        <Button variant="ghost" size="icon" onPress={goNext}>
          <ChevronRight color="white" size={28} />
        </Button>
      </View>

      {/* ICONO */}
      <WeatherIcon
        condition={current.condition}
        isDay={current.isDay}
      />

      {/* TEMP */}
      <Text style={styles.temp}>
        {Math.round(current.temp)}°
      </Text>

      {/* MIN MAX */}
      <Text style={styles.minMax}>
        Min: {Math.round(current.min)}°   Max:{" "}
        {Math.round(current.max)}°
      </Text>

      {/* MÉTRICAS */}
      <View style={styles.metrics}>
        <View style={styles.metricBox}>
          <Text style={styles.metricIcon}>💧</Text>
          <Text style={styles.metricValue}>
            {current.humidity}%
          </Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricIcon}>🌬</Text>
          <Text style={styles.metricValue}>
            {current.wind} km/h
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

// 🎨 ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  city: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },

  nav: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  navButton: {
    fontSize: 30,
    color: "white",
    marginHorizontal: 20,
  },

  day: {
    fontSize: 22,
    color: "white",
    fontWeight: "600",
  },

  icon: {
    fontSize: 80,
    marginVertical: 20,
  },

  temp: {
    fontSize: 90,
    color: "white",
    fontWeight: "200",
  },

  minMax: {
    fontSize: 18,
    color: "white",
    marginBottom: 30,
  },

  metrics: {
    flexDirection: "row",
    width: "100%",
  },

  metricBox: {
    flex: 1,
    alignItems: "center",
  },

  metricIcon: {
    fontSize: 24,
  },

  metricValue: {
    color: "white",
    marginTop: 5,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});