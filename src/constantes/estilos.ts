import { StyleSheet } from "react-native";

export const estilosContenedor = StyleSheet.create({
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

export const estilosBoton = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  sideButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  arrow: {
    fontSize: 18,
    color: "#333",
  },
  currentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ffffffaa",
    borderRadius: 10,
  },
  currentLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
});