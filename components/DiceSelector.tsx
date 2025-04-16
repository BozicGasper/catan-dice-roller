import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MiniDice } from './MiniDice';

interface DiceSelectorProps {
  value: number;
  onChange: (value: number) => void;
  color?: string;
  isHighlightable?: boolean;
  isHighlighted?: boolean;
}

function DiceSelectorComponent({ value, onChange, color = '#6366f1', isHighlightable = false, isHighlighted = false }: DiceSelectorProps) {
  const styles = useMemo(() => StyleSheet.create({
    container: {
      marginVertical: 12,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    diceButton: {
      padding: 4,
    },
    highlightText: {
      fontSize: 12,
      color: '#94a3b8',
      textAlign: 'center',
      marginTop: 8,
    },
  }), []);

  const diceButtons = useMemo(() => {
    return [1, 2, 3, 4, 5, 6].map((diceValue) => (
      <TouchableOpacity
        key={diceValue}
        onPress={() => onChange(diceValue)}
        style={styles.diceButton}>
        <MiniDice
          value={diceValue}
          isSelected={value === diceValue}
          muted={value !== diceValue}
          color={color}
        />
      </TouchableOpacity>
    ));
  }, [value, onChange, color, styles.diceButton]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {diceButtons}
      </View>
      {isHighlightable && (
        <Text style={[styles.highlightText, isHighlighted && { color }]}>
          This value will be assigned to the highlighted dice
        </Text>
      )}
    </View>
  );
}

export const DiceSelector = React.memo(DiceSelectorComponent);