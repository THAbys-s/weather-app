import { render, fireEvent } from "@testing-library/react-native";
import BotonDeNavegacion from "@/src/componentes/contenidos/BotonNavegacion";

describe("BotonDeNavegacion", () => {
  test("renderiza correctamente", () => {
    const { getByTestId } = render(
      <BotonDeNavegacion
        current="NOW"
        onPrev={jest.fn()}
        onNext={jest.fn()}
        canGoPrev={true}
        canGoNext={true}
      />
    );

    expect(getByTestId("navigation-container")).toBeTruthy();
    expect(getByTestId("navigation-current-day")).toBeTruthy();
  });

  test("ejecuta navegación", () => {
    const prev = jest.fn();
    const next = jest.fn();

    const { getByTestId } = render(
      <BotonDeNavegacion
        current="NOW"
        onPrev={prev}
        onNext={next}
        canGoPrev={true}
        canGoNext={true}
      />
    );

    fireEvent.press(getByTestId("button-prev-day"));
    fireEvent.press(getByTestId("button-next-day"));

    expect(prev).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});