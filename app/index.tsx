import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const CITY = "Tokyo";
console.log(process.env.EXPO_PUBLIC_API_KEY);

export default function App() {
  const [days, setDays] = useState<any[]>([]);
  const [activeIndex, setActive] = useState(0);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!API_KEY) {
      setError("Falta API KEY en .env");
      setLoading(false);
      return;
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${CITY}&days=7`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCityName(data.location.name);
        setCountry(data.location.country);
        setDays(data.forecast.forecastday);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const prev = () =>
    setActive((i) => (i - 1 + days.length) % days.length);

  const next = () =>
    setActive((i) => (i + 1) % days.length);

  // ── Loading ──
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.info}>Cargando...</Text>
      </View>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error:</Text>
        <Text style={styles.info}>{error}</Text>
      </View>
    );
  }

  const d = days[activeIndex];

  return (
    <View style={styles.container}>
      {/* Ciudad */}
      <Text style={styles.country}>{country}</Text>
      <Text style={styles.city}>{cityName}</Text>

      {/* Navegación */}
      <View style={styles.nav}>
        <Pressable onPress={prev}>
          <Text style={styles.btn}>{"<"}</Text>
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {days.map((day, i) => (
            <Pressable key={i} onPress={() => setActive(i)}>
              <Text
                style={[
                  styles.day,
                  i === activeIndex && styles.activeDay,
                ]}
              >
                {day.date}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Pressable onPress={next}>
          <Text style={styles.btn}>{">"}</Text>
        </Pressable>
      </View>

      {/* Datos principales */}
      <Text style={styles.temp}>
        {Math.round(d.day.avgtemp_c)}°
      </Text>

      <Text style={styles.condition}>
        {d.day.condition.text}
      </Text>

      {/* Min / Max */}
      <View style={styles.row}>
        <Text style={styles.min}>Min: {d.day.mintemp_c}°</Text>
        <Text style={styles.max}>Max: {d.day.maxtemp_c}°</Text>
      </View>

      {/* Métricas */}
      <View style={styles.row}>
        <Text style={styles.metric}>
          💧 {d.day.avghumidity}%
        </Text>
        <Text style={styles.metric}>
          🌬 {d.day.maxwind_kph} km/h
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1120",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B1120",
  },
  city: {
    fontSize: 32,
    color: "#E8F2FF",
    fontWeight: "bold",
  },
  country: {
    color: "#7BA3CC",
    marginBottom: 5,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  btn: {
    fontSize: 20,
    padding: 10,
    color: "#7BA3CC",
  },
  day: {
    color: "#33536A",
    marginHorizontal: 6,
  },
  activeDay: {
    color: "#E8F2FF",
    fontWeight: "bold",
  },
  temp: {
    fontSize: 64,
    color: "#E8F2FF",
    marginVertical: 10,
  },
  condition: {
    color: "#7BA3CC",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    gap: 20,
    marginTop: 10,
  },
  min: {
    color: "#B0CCDD",
  },
  max: {
    color: "#B0CCDD",
  },
  metric: {
    color: "#7BA3CC",
  },
  info: {
    color: "#7BA3CC",
    marginTop: 10,
  },
  error: {
    color: "red",
    fontSize: 18,
  },
});