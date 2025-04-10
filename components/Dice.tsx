import { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface DiceProps {
  value: number;
  size?: number;
  color?: string;
  isCityDice?: boolean;
  highlightColor?: string;
}

export function Dice({ value, size = 80, color = '#6366f1', isCityDice = false, highlightColor }: DiceProps) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(spinValue, {
        toValue: 360,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.timing(spinValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true
      })
    ]).start();
  }, [value]);

  const spin = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg']
  });

  const getCityDiceColor = () => {
    switch (value) {
      case 1: return '#eab308'; // Yellow
      case 2: return '#22c55e'; // Green
      case 3: return '#3b82f6'; // Blue
      default: return '#1e293b'; // Black (4, 5, 6)
    }
  };

  const getDots = () => {
    if (isCityDice) return null;

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
              transform: [{ translateX: -dotSize / 2 }, { translateY: -dotSize / 2 }]
            }
          ]}
        />
      );
    }
    return dots;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ rotate: spin }]
        },
        highlightColor && {
          borderWidth: 3,
          borderColor: highlightColor,
          borderRadius: size / 8 + 3,
          padding: 3
        }
      ]}>
      <LinearGradient
        colors={isCityDice ? 
          [getCityDiceColor(), `${getCityDiceColor()}dd`] : 
          [color, `${color}dd`]
        }
        style={[styles.dice, { borderRadius: size / 8 }]}>
        {getDots()}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
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