import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ContenedorDeClima from "@/src/componentes/pantallas/ContenedorDeClima";

// ─── Mocks de SVGs ───────────────────────────────────────────────────────────
jest.mock("@/assets/icons/sunny.svg", () => "SunnyIcon");
jest.mock("@/assets/icons/clear.svg", () => "ClearIcon");
jest.mock("@/assets/icons/cloudy-sun.svg", () => "CloudySunIcon");
jest.mock("@/assets/icons/cloudy.svg", () => "CloudyIcon");
jest.mock("@/assets/icons/rain.svg", () => "RainIcon");
jest.mock("@/assets/icons/rain-sun.svg", () => "RainSunIcon");
jest.mock("@/assets/icons/snow.svg", () => "SnowIcon");
jest.mock("@/assets/icons/snow-sun.svg", () => "SnowSunIcon");
jest.mock("@/assets/icons/thunderstorm.svg", () => "ThunderstormIcon");
jest.mock("@/assets/icons/thunderstorm-sun.svg", () => "ThunderstormSunIcon");
jest.mock("@/assets/icons/fog.svg", () => "FogIcon");
jest.mock("@/assets/icons/metrics_wind.svg", () => "WindIcon");
jest.mock("@/assets/icons/metrics_humidity.svg", () => "HumidityIcon");
jest.mock("@/assets/icons/metrics_pressure.svg", () => "PressureIcon");

// ─── Mock expo-linear-gradient ───────────────────────────────────────────────
jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return { LinearGradient: View };
});

// ─── Mock useLocation ────────────────────────────────────────────────────────
jest.mock("@/src/hooks/useLocation", () => ({
  useLocation: () => ({
    location: {
      status: "granted",
      coords: { latitude: -34.6037, longitude: -58.3816 },
      city: "Buenos Aires",
    },
    retry: jest.fn(),
  }),
}));

// ─── Datos de prueba ──────────────────────────────────────────────────────────
const pronosticoMock = [
  {
    date: new Date("2026-04-27T00:00:00"),
    label: "Ayer",
    temp: 21,
    min: 18,
    max: 24,
    condition: "Sunny",
    humidity: 55,
    wind: 15,
    pressure: 1013,
    isDay: true,
  },
  {
    date: new Date("2026-04-28T00:00:00"),
    label: "Hoy",
    temp: 25,
    min: 20,
    max: 28,
    condition: "Partly Cloudy",
    humidity: 60,
    wind: 20,
    pressure: 1012,
    isDay: true,
  },
  {
    date: new Date("2026-04-29T00:00:00"),
    label: "Mañana",
    temp: 19,
    min: 16,
    max: 22,
    condition: "Rainy",
    humidity: 80,
    wind: 30,
    pressure: 1008,
    isDay: false,
  },
];

// ─── Mock useClima ────────────────────────────────────────────────────────────
const mockIrAlSiguiente = jest.fn();
const mockIrAlAnterior = jest.fn();

jest.mock("@/src/hooks/useClima", () => ({
  useClima: () => ({
    climaActual: pronosticoMock[1],
    pronostico: pronosticoMock,
    indiceActual: 1,
    cargando: false,
    error: null,
    irAlAnterior: mockIrAlAnterior,
    irAlSiguiente: mockIrAlSiguiente,
    recargar: jest.fn(),
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────

describe("ContenedorDeClima", () => {

  // 1. Pantalla principal
  test("renderiza la pantalla principal del clima", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    expect(getByTestId("screen-weather")).toBeTruthy();
  });

  // 2. Encabezado de ciudad
  test("muestra el nombre de la ciudad", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    expect(getByTestId("header-city").props.children).toBe("Buenos Aires");
  });

  // 3. Navegación — botones existen
  test("renderiza los botones de navegación", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    expect(getByTestId("button-prev-day")).toBeTruthy();
    expect(getByTestId("button-next-day")).toBeTruthy();
  });

  // 3b. Navegación — día actual visible
  test("muestra el día actual en la navegación", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    expect(getByTestId("navigation-current-day")).toBeTruthy();
  });

  // 3c. Navegación — navegar al día siguiente llama al handler
  test("permite navegar al día siguiente", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    fireEvent.press(getByTestId("button-next-day"));
    expect(mockIrAlSiguiente).toHaveBeenCalled();
  });

  // 3d. Navegación — navegar al día anterior llama al handler
  test("permite navegar al día anterior", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    fireEvent.press(getByTestId("button-prev-day"));
    expect(mockIrAlAnterior).toHaveBeenCalled();
  });

  // 4. Ícono climático
  test("renderiza un ícono climático", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    expect(getByTestId(/icon-weather-/)).toBeTruthy();
  });

  test("el ícono refleja la condición actual", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    const condition = pronosticoMock[1].condition.toLowerCase().replace(/\s+/g, "-");
    expect(getByTestId(`icon-weather-${condition}`)).toBeTruthy();
  });

  // 5. Métricas secundarias
  test("renderiza al menos tres métricas secundarias", () => {
    const { getAllByTestId } = render(<ContenedorDeClima />);
    expect(getAllByTestId("metric-item").length).toBeGreaterThanOrEqual(3);
  });

  test("cada métrica expone su valor", () => {
    const { getAllByTestId } = render(<ContenedorDeClima />);
    const valores = getAllByTestId("metric-value");
    expect(valores.length).toBeGreaterThanOrEqual(3);
    valores.forEach((v) => {
      expect(v.props.children).toBeTruthy();
    });
  });

  // 6. Temperatura actual
  test("muestra la temperatura actual con símbolo °", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    const tempText = getByTestId("temp-current").props.children;
    expect(String(tempText)).toMatch(/°/);
  });

  // 7. Temperatura mínima y máxima
  test("muestra temperatura mínima y máxima", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    expect(getByTestId("temp-min")).toBeTruthy();
    expect(getByTestId("temp-max")).toBeTruthy();
  });

  test("la temperatura mínima tiene símbolo °", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    expect(String(getByTestId("temp-min").props.children)).toMatch(/°/);
  });

  test("la temperatura máxima tiene símbolo °", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    expect(String(getByTestId("temp-max").props.children)).toMatch(/°/);
  });

  // ─── Test de cumplimiento de testID obligatorios ──────────────────────────
  test("la app expone todos los testID obligatorios", () => {
    const requiredTestIds = [
      "screen-weather",
      "header-city",
      "button-prev-day",
      "button-next-day",
      "navigation-current-day",
      "temp-current",
      "temp-min",
      "temp-max",
    ];
    const { getByTestId } = render(<ContenedorDeClima />);
    requiredTestIds.forEach((id) => {
      expect(getByTestId(id)).toBeTruthy();
    });
  });

});

// ─────────────────────────────────────────────────────────────────────────────

describe("ContenedorDeClima — estado de carga", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("muestra pantalla de carga mientras carga", () => {
    jest.doMock("@/src/hooks/useClima", () => ({
      useClima: () => ({
        climaActual: undefined,
        pronostico: [],
        indiceActual: 0,
        cargando: true,
        error: null,
        irAlAnterior: jest.fn(),
        irAlSiguiente: jest.fn(),
        recargar: jest.fn(),
      }),
    }));
    const Fresh = require("@/src/componentes/pantallas/ContenedorDeClima").default;
    const { getByTestId } = render(<Fresh />);
    expect(getByTestId("screen-loading")).toBeTruthy();
  });

  test("muestra pantalla de error cuando hay error", () => {
    jest.doMock("@/src/hooks/useClima", () => ({
      useClima: () => ({
        climaActual: undefined,
        pronostico: [],
        indiceActual: 0,
        cargando: false,
        error: "Error de red",
        irAlAnterior: jest.fn(),
        irAlSiguiente: jest.fn(),
        recargar: jest.fn(),
      }),
    }));
    const Fresh = require("@/src/componentes/pantallas/ContenedorDeClima").default;
    const { getByTestId } = render(<Fresh />);
    expect(getByTestId("screen-error")).toBeTruthy();
  });
});
