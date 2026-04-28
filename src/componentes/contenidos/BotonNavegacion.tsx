import { View, Text, TouchableOpacity } from 'react-native';
import { estilosBoton as estilos } from "@/src/constantes/estilos";

type Props = {
  current: string;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
};

export default function BotonDeNavegacion({
  current,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}: Props) {
  return (
    <View testID="navigation-container" style={estilos.container}>
      {canGoPrev && (
        <TouchableOpacity testID="button-prev-day" style={estilos.sideButton} onPress={onPrev}>
          <Text style={estilos.arrow}>{"<"}</Text>
        </TouchableOpacity>
      )}
      <View style={estilos.currentContainer}>
        <Text testID="navigation-current-day" style={estilos.currentLabel}>
          {current}
        </Text>
      </View>
      {canGoNext && (
        <TouchableOpacity testID="button-next-day" style={estilos.sideButton} onPress={onNext}>
          <Text style={estilos.arrow}>{">"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}