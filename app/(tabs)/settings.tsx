import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { useThemeStore } from '@/store/themeStore';

export default function SettingsScreen() {
  const { resetGame } = useGameStore();
  const { colors } = useThemeStore();

  const handleResetGame = () => {
    Alert.alert(
      'Reset Game',
      'Are you sure you want to reset the game? This will clear all history and current game data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetGame();
            Alert.alert('Success', 'Game has been reset');
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 60,
      marginBottom: 20,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    button: {
      backgroundColor: '#ef4444',
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Management</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleResetGame}>
          <Text style={styles.buttonText}>Reset Game</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}