import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    <View style={styles.container}>
      {canGoPrev && (
        <TouchableOpacity style={styles.sideButton} onPress={onPrev}>
          <Text style={styles.arrow}>{"<"}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.currentContainer}>
        <Text style={styles.currentLabel}>{current}</Text>
      </View>
      {canGoNext && (
        <TouchableOpacity style={styles.sideButton} onPress={onNext}>
          <Text style={styles.arrow}>{">"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sideButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  arrow: {
    fontSize: 18,
    color: '#333',
  },
  currentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffffaa',
    borderRadius: 10,
  },
  currentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
});