import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Button } from "@/src/componentes/contenidos/Boton";
import { LinearGradient } from "expo-linear-gradient";
import IconoDelClima from "@/src/componentes/contenidos/IconoDelClima";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useClima } from "@/src/hooks/useClima";

const { width } = Dimensions.get("window");

const gradientes: Record<string, [string, string]> = {
  Sunny: ["#f6d365", "#fda085"],
  Clear: ["#f6d365", "#fda085"],
  Cloudy: ["#89f7fe", "#66a6ff"],
  Overcast: ["#89f7fe", "#66a6ff"],
  Rain: ["#4facfe", "#00f2fe"],
  Snow: ["#e0eafc", "#cfdef3"],
  Thunderstorm: ["#667db6", "#485563"],
};

const TarjetaDeMetrica = ({
  colores,
  colorDelPie,
  etiqueta,
  valor,
  unidad,
  children,
}: {
  colores: [string, string];
  colorDelPie: string;
  etiqueta: string;
  valor: number | string;
  unidad: string;
  children: React.ReactNode;
}) => (
  <View style={estilos.tarjeta}>
    <LinearGradient colors={colores} style={estilos.cuerpoDelaTarjeta}>
      <View style={estilos.placeholderDelIcono}>
        {children}
      </View>
      <View style={estilos.filaDelValor}>
        <Text style={estilos.valorDeLaTarjeta}>{valor}</Text>
        <Text style={estilos.unidadDeLaTarjeta}>{unidad}</Text>
      </View>
    </LinearGradient>
    <View style={[estilos.pieDeLaTarjeta, { backgroundColor: colorDelPie }]}>
      <Text style={estilos.etiquetaDeLaTarjeta}>{etiqueta}</Text>
    </View>
  </View>
);

export default function ContenedorDeClima() {
  const {
    climaActual,
    cargando,
    error,
    irAlAnterior,
    irAlSiguiente,
  } = useClima();

  if (cargando) {
    return (
      <View style={estilos.cargador}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !climaActual) {
    return (
      <View style={estilos.cargador}>
        <Text>Error cargando datos</Text>
      </View>
    );
  }

  const condicionBase = Object.keys(gradientes).find((clave) =>
    climaActual.condition.includes(clave)
  ) as keyof typeof gradientes;

  const gradienteActual = gradientes[condicionBase] || ["#89f7fe", "#66a6ff"];

  return (
    <LinearGradient
      colors={gradienteActual}
      style={estilos.contenedor}
    >
      <Text style={estilos.ciudad}>BUENOS AIRES</Text>

      <View style={estilos.navegacion}>
        <Button variant="ghost" size="icon" onPress={irAlAnterior}>
          <ChevronLeft color="white" size={28} />
        </Button>
        <Text style={estilos.dia}>{climaActual.label.toUpperCase()}</Text>
        <Button variant="ghost" size="icon" onPress={irAlSiguiente}>
          <ChevronRight color="white" size={28} />
        </Button>
      </View>

      <IconoDelClima
        condition={climaActual.condition}
        isDay={climaActual.isDay}
      />

      <Text style={estilos.temperatura}>
        {Math.round(climaActual.temp)}°
      </Text>

      <Text style={estilos.minMax}>
        Min: {Math.round(climaActual.min)}°   Max:{" "}
        {Math.round(climaActual.max)}°
      </Text>

      {/* --- SECCIÓN DE TARJETAS DE MÉTRICAS --- */}
      <View style={estilos.filaDeMetricas}>
        <TarjetaDeMetrica
          colores={["#D62B4A", "#7A1024"]}
          colorDelPie="#5A0C1B"
          etiqueta="Wind"
          valor={Math.round(climaActual.wind)}
          unidad="km/h"
        >
          {/* SVG DE VIENTO */}
        </TarjetaDeMetrica>

        <TarjetaDeMetrica
          colores={["#C73E8F", "#5E1B44"]}
          colorDelPie="#4A1536"
          etiqueta="Humidity"
          valor={climaActual.humidity}
          unidad="%"
        >
          {/* SVG DE HUMEDAD */}
        </TarjetaDeMetrica>

        <TarjetaDeMetrica
          colores={["#9B5B8A", "#2E1529"]}
          colorDelPie="#1F0E1B"
          etiqueta="Pressure"
          valor={Math.round(climaActual.pressure)}
          unidad="hpa"
        >
          {/* SVG DE PRESIÓN */}
        </TarjetaDeMetrica>
      </View>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  ciudad: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  navegacion: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dia: {
    fontSize: 22,
    color: "white",
    fontWeight: "600",
  },
  temperatura: {
    fontSize: 90,
    color: "white",
    fontWeight: "200",
  },
  minMax: {
    fontSize: 18,
    color: "white",
    marginBottom: 30,
  },
  cargador: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Estilos de las tarjetas
  filaDeMetricas: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
  },
  tarjeta: {
    width: (width - 60) / 3,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cuerpoDelaTarjeta: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 8,
  },
  placeholderDelIcono: {
    height: 40,
    justifyContent: "center",
    marginBottom: 4,
  },
  filaDelValor: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  valorDeLaTarjeta: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  unidadDeLaTarjeta: {
    color: "white",
    fontSize: 10,
    marginLeft: 2,
    opacity: 0.8,
  },
  pieDeLaTarjeta: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  etiquetaDeLaTarjeta: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
