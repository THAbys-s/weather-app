import React from "react";
import { render } from "@testing-library/react-native";
import IconoDelClima from "../src/componentes/contenidos/IconoDelClima";

describe("IconoDelClima", () => {
  test("renderiza icono con testID dinámico", () => {
    const { getByTestId } = render(
      <IconoDelClima condition="Sunny" isDay={true} />
    );

    expect(getByTestId("icon-weather-sunny")).toBeTruthy();
  });

  test("normaliza espacios en el testID", () => {
    const { getByTestId } = render(
      <IconoDelClima condition="Partly Cloudy" isDay={true} />
    );

    expect(getByTestId("icon-weather-partly-cloudy")).toBeTruthy();
  });
});