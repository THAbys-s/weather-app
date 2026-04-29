import { View, Text, TouchableOpacity } from 'react-native';
import { estilosBoton as estilos } from "../../constantes/estilos";

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
      <TouchableOpacity
        testID="button-prev-day"
        style={estilos.sideButton}
        onPress={canGoPrev ? onPrev : undefined}
        disabled={!canGoPrev}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canGoPrev }}
      >
        <Text style={estilos.arrow}>{"<"}</Text>
      </TouchableOpacity>

      <View style={estilos.currentContainer}>
        <Text testID="navigation-current-day" style={estilos.currentLabel}>
          {current}
        </Text>
      </View>

      <TouchableOpacity
        testID="button-next-day"
        style={estilos.sideButton}
        onPress={canGoNext ? onNext : undefined}
        disabled={!canGoNext}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canGoNext }}
      >
        <Text style={estilos.arrow}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
}