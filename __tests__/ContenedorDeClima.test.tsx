import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ContenedorDeClima from "../src/componentes/contenedores/ContenedorDeClima";

// mocks de hooks
jest.mock("../src/hooks/useClima");
jest.mock("../src/hooks/useLocation");

import { useClima } from "../src/hooks/useClima";
import { useLocation } from "../src/hooks/useLocation";

const mockUseClima = useClima as jest.Mock;
const mockUseLocation = useLocation as jest.Mock;

const climaMock = {
  temp: 25,
  min: 21,
  max: 26,
  wind: 10,
  humidity: 58,
  pressure: 1012,
  condition: "Sunny",
  isDay: true,
  date: new Date(),
};

describe("ContenedorDeClima", () => {
  beforeEach(() => {
    mockUseLocation.mockReturnValue({
      location: {
        status: "granted",
        coords: {},
        city: "TOKYO",
      },
    });

    mockUseClima.mockReturnValue({
      climaActual: climaMock,
      cargando: false,
      error: null,
      irAlAnterior: jest.fn(),
      irAlSiguiente: jest.fn(),
      indiceActual: 0,
      pronostico: [climaMock, climaMock],
    });
  });

  test("renderiza la pantalla principal", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    expect(getByTestId("screen-weather")).toBeTruthy();
  });

  test("muestra la ciudad", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    expect(getByTestId("header-city").props.children).toBe("TOKYO");
  });

  test("muestra temperatura actual", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    expect(getByTestId("temp-current").props.children).toContain("°");
  });

  test("muestra temperaturas min y max", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    expect(getByTestId("temp-min")).toBeTruthy();
    expect(getByTestId("temp-max")).toBeTruthy();
  });

  test("renderiza métricas", () => {
    const { getAllByTestId } = render(<ContenedorDeClima />);
    expect(getAllByTestId("metric-item").length).toBeGreaterThanOrEqual(3);
  });

  test("renderiza icono climático", () => {
    const { getByTestId } = render(<ContenedorDeClima />);
    expect(getByTestId(/icon-weather-/)).toBeTruthy();
  });

  test("navega al siguiente día", () => {
    const { getByTestId } = render(<ContenedorDeClima />);

    fireEvent.press(getByTestId("button-next-day"));

    expect(getByTestId("navigation-current-day")).toBeTruthy();
  });

  test("mantiene testID de navegación incluso cuando el botón anterior está deshabilitado", () => {
    const { getByTestId } = render(<ContenedorDeClima />);

    const prevButton = getByTestId("button-prev-day");
    expect(prevButton).toBeTruthy();
    expect(prevButton.props.accessibilityState.disabled).toBe(true);
  });

  test("expone todos los testID obligatorios", () => {
    const { getByTestId } = render(<ContenedorDeClima />);

    const required = [
      "screen-weather",
      "header-city",
      "temp-current",
      "temp-min",
      "temp-max",
      "button-prev-day",
      "button-next-day",
    ];

    required.forEach(id => {
      expect(getByTestId(id)).toBeTruthy();
    });
  });
});