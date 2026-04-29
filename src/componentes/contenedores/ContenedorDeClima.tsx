import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BotonDeNavegacion from "../contenidos/BotonNavegacion";
import IconoDelClima from "../contenidos/IconoDelClima";
import { useClima } from "../../hooks/useClima";
import { useLocation } from "../../hooks/useLocation";
import { estilosContenedor as estilos } from "../../constantes/estilos";
import WindIcon from "../../../assets/icons/metrics_wind.svg";
import HumidityIcon from "../../../assets/icons/metrics_humidity.svg";
import PressureIcon from "../../../assets/icons/metrics_pressure.svg";

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
}) => {
  const id = etiqueta.toLowerCase();
  return (
    <LinearGradient
      colors={colores}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={estilos.tarjeta}
    >
      <View testID="metric-item" style={estilos.bordeDeLaTarjeta}>
        <View style={estilos.cuerpoDelaTarjeta}>
          <View style={estilos.filaDelValor}>
            <Text testID={`metric-value-${id}`} style={estilos.valorDeLaTarjeta}>
              {valor}
            </Text>
            <Text style={estilos.unidadDeLaTarjeta}>{unidad}</Text>
          </View>
          <View testID={`metric-icon-${id}`} style={estilos.placeholderDelIcono}>
            {icon}
          </View>
        </View>
        <View style={[estilos.pieDeLaTarjeta, { backgroundColor: colorDelPie }]}>
          <Text style={estilos.etiquetaDeLaTarjeta}>{etiqueta}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

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
      <View testID="screen-loading" style={estilos.cargador}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !climaActual) {
    return (
      <View testID="screen-error" style={estilos.cargador}>
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
    <View testID="screen-weather" style={estilos.contenedor}>
      <Text testID="header-city" style={estilos.ciudad}>
        {location.status === "granted" ? location.city : "Cargando..."}
      </Text>

      <BotonDeNavegacion
        current={fechaFormateada}
        onPrev={irAlAnterior}
        onNext={irAlSiguiente}
        canGoPrev={indiceActual > 0}
        canGoNext={indiceActual < total - 1}
      />

      <IconoDelClima
        condition={climaActual.condition}
        isDay={climaActual.isDay}
      />

      <Text testID="temp-current" style={estilos.temperatura}>
        {Math.round(climaActual.temp)}°
      </Text>

      <View style={{ flexDirection: "row", gap: 16 }}>
        <Text testID="temp-min" style={estilos.minMax}>
          Min: {Math.round(climaActual.min)}°
        </Text>
        <Text testID="temp-max" style={estilos.minMax}>
          Max: {Math.round(climaActual.max)}°
        </Text>
      </View>

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