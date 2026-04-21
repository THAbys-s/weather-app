import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Button } from "@/src/componentes/contenidos/Boton";
import { LinearGradient } from "expo-linear-gradient";
import IconoDelClima from "@/src/componentes/contenidos/IconoDelClima";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useClima } from "@/src/hooks/useClima";

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
  <LinearGradient
    colors={colores}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={estilos.tarjeta}
  >
    <View style={estilos.bordeDeLaTarjeta}>
      <View style={estilos.cuerpoDelaTarjeta}>
        <View style={estilos.placeholderDelIcono}>
          {children}
        </View>
        <View style={estilos.filaDelValor}>
          <Text style={estilos.valorDeLaTarjeta}>{valor}</Text>
          <Text style={estilos.unidadDeLaTarjeta}>{unidad}</Text>
        </View>
      </View>
      <View style={[estilos.pieDeLaTarjeta, { backgroundColor: colorDelPie }]}>
        <Text style={estilos.etiquetaDeLaTarjeta}>{etiqueta}</Text>
      </View>
    </View>
  </LinearGradient>
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

  return (
    <LinearGradient
      colors={["#FFFF", "#FFF"]}
      style={estilos.contenedor}
    >
      <Text style={estilos.ciudad}>BUENOS AIRES</Text>

      <View style={estilos.navegacion}>
        <Button variant="ghost" size="icon" onPress={irAlAnterior}>
          <ChevronLeft color="#000000" size={28} />
        </Button>
        <Text style={estilos.dia}>{climaActual.label.toUpperCase()}</Text>
        <Button variant="ghost" size="icon" onPress={irAlSiguiente}>
          <ChevronRight color="#000000" size={28} />
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
          colores={["#66D9FE", "#48BBFA"]}
          colorDelPie="#3F9DF1"
          etiqueta="Wind"
          valor={Math.round(climaActual.wind)}
          unidad="km/h"
        >
          {/* SVG DE VIENTO */}
        </TarjetaDeMetrica>

        <TarjetaDeMetrica
          colores={["#66D9FE", "#48BBFA"]}
          colorDelPie="#3F9DF1"
          etiqueta="Humidity"
          valor={climaActual.humidity}
          unidad="%"
        >
          {/* SVG DE HUMEDAD */}
        </TarjetaDeMetrica>

        <TarjetaDeMetrica
          colores={["#66D9FE", "#48BBFA"]}
          colorDelPie="#3F9DF1"
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
    color: "#000000",
    marginBottom: 10,
  },
  navegacion: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dia: {
    fontSize: 22,
    color: "#000000",
    fontWeight: "600",
  },
  temperatura: {
    fontSize: 90,
    color: "#000000",
    fontWeight: "200",
  },
  minMax: {
    fontSize: 18,
    color: "#000000",
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
    gap: 10,
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  
  tarjeta: {
    flex: 1,
    aspectRatio: 2 / 3,
    maxWidth: 150, // no exceda este ancho
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  bordeDeLaTarjeta: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 13,
    flex: 1,
    width: "100%",
    overflow: "hidden",
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
