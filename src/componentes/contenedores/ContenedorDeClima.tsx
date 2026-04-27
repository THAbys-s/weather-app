import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import BotonDeNavegacion from "@/src/componentes/contenidos/BotonNavegacion";
import { useClima } from "@/src/hooks/useClima";
import { useLocation } from "@/src/hooks/useLocation";
import IconoDelClima from "@/src/componentes/contenidos/IconoDelClima";
import WindIcon from "@/assets/icons/metrics_wind.svg";
import HumidityIcon from "@/assets/icons/metrics_humidity.svg";
import PressureIcon from "@/assets/icons/metrics_pressure.svg";

import { LinearGradient } from "expo-linear-gradient";

const TarjetaDeMetrica = ({
  colores,
  colorDelPie,
  etiqueta,
  valor,
  unidad,
  icon,
}: {
  colores: [string, string];
  colorDelPie: string;
  etiqueta: string;
  valor: number | string;
  unidad: string;
  icon?: React.ReactNode;
}) => (
  <LinearGradient
    colors={colores}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={estilos.tarjeta}
  >
    <View style={estilos.bordeDeLaTarjeta}>
      <View style={estilos.cuerpoDelaTarjeta}>

        <View style={estilos.filaDelValor}>
          <Text style={estilos.valorDeLaTarjeta}>{valor}</Text>
          <Text style={estilos.unidadDeLaTarjeta}>{unidad}</Text>
        </View>

        <View style={estilos.placeholderDelIcono}>
          {icon}
        </View>

      </View>

      <View style={[estilos.pieDeLaTarjeta, { backgroundColor: colorDelPie }]}>
        <Text style={estilos.etiquetaDeLaTarjeta}>{etiqueta}</Text>
      </View>
    </View>
  </LinearGradient>
);

export default function ContenedorDeClima() {
  const { location } = useLocation();
  const {
    climaActual,
    cargando,
    error,
    irAlAnterior,
    irAlSiguiente,
    indiceActual,
    pronostico,
  } = useClima(location.status === "granted" ? location.coords : undefined);

  if (cargando || location.status === "loading") {
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

  const total = pronostico.length;

  const fechaFormateada = climaActual.date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
      <View style={estilos.contenedor}>
      <Text style={estilos.ciudad}>{location.status === "granted" ? location.city : "Cargando..."}</Text>   
        <BotonDeNavegacion
          onPrev={irAlAnterior}
          current={fechaFormateada}
          onNext={irAlSiguiente}
          canGoPrev={indiceActual > 0}
          canGoNext={indiceActual < total - 1}
        />
        <IconoDelClima condition={climaActual.condition} isDay={climaActual.isDay} />
        <Text style={estilos.temperatura}>{Math.round(climaActual.temp)}°</Text>
        <Text style={estilos.minMax}>
          Min: {Math.round(climaActual.min)}°   Max: {Math.round(climaActual.max)}°
        </Text>
        <View style={estilos.filaDeMetricas}>
          <TarjetaDeMetrica
            colores={["#66D9FE", "#48BBFA"]}
            colorDelPie="#3F9DF1"
            etiqueta="Wind"
            valor={Math.round(climaActual.wind)}
            unidad="km/h"
            icon={<WindIcon width={28} height={28} />}
          />
          <TarjetaDeMetrica
            colores={["#66D9FE", "#48BBFA"]}
            colorDelPie="#3F9DF1"
            etiqueta="Humidity"
            valor={climaActual.humidity}
            unidad="%"
            icon={<HumidityIcon width={28} height={28} />}
          />
          <TarjetaDeMetrica
            colores={["#66D9FE", "#48BBFA"]}
            colorDelPie="#3F9DF1"
            etiqueta="Pressure"
            valor={Math.round(climaActual.pressure)}
            unidad="hpa"
            icon={<PressureIcon width={28} height={28} />}
          />
        </View>
      </View>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  temperatura: {
    fontSize: 90,
    color: "#000",
    fontWeight: "200",
  },
  minMax: {
    fontSize: 18,
    color: "#000",
    marginBottom: 30,
  },
  cargador: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  filaDeMetricas: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    paddingHorizontal: 5,
    marginTop: 20,
  },

  tarjeta: {
    flex: 1,
    height: 140,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
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
    marginTop: 6,
  },

  filaDelValor: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  valorDeLaTarjeta: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  unidadDeLaTarjeta: {
    color: "white",
    fontSize: 12,
    marginLeft: 4,
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

