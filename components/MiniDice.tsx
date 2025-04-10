import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MiniDiceProps {
  value: number;
  size?: number;
  isSelected?: boolean;
  color?: string;
  muted?: boolean;
}

export function MiniDice({ value, size = 32, isSelected = false, color = '#6366f1', muted = false }: MiniDiceProps) {
  const getDots = () => {
    const dots = [];
    const dotSize = size / 8;
    const positions = getDotPositions(value);

    for (let i = 0; i < positions.length; i++) {
      const [x, y] = positions[i];
      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            {
              position: 'absolute',
              width: dotSize,
              height: dotSize,
              backgroundColor: 'white',
              left: `${x}%`,
              top: `${y}%`,
              transform: [{ translateX: -dotSize / 2 }, { translateY: -dotSize / 2 }],
              opacity: muted ? 0.5 : 1,
            }
          ]}
        />
      );
    }
    return dots;
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}>
      <LinearGradient
        colors={[
          muted ? `${color}66` : color,
          muted ? `${color}44` : `${color}dd`
        ]}
        style={[
          styles.dice,
          { borderRadius: size / 8 },
          isSelected && styles.selected
        ]}>
        {getDots()}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 4,
  },
  dice: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dot: {
    borderRadius: 100,
  },
  selected: {
    borderWidth: 2,
    borderColor: 'white',
  },
});

// Standard dice dot positions (in percentages)
const getDotPositions = (value: number): [number, number][] => {
  const positions: Record<number, [number, number][]> = {
    1: [[50, 50]], // Center
    2: [[25, 25], [75, 75]], // Top-left to bottom-right
    3: [[25, 25], [50, 50], [75, 75]], // Diagonal with center
    4: [[25, 25], [25, 75], [75, 25], [75, 75]], // Four corners
    5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]], // Four corners + center
    6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]], // Three on each side
  };
  return positions[value] || [];
};