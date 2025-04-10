import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useGameStore, calculateHistogram } from '@/store/gameStore';
import { useThemeStore } from '@/store/themeStore';
import { HistogramChart } from '@/components/HistogramChart';

export default function HistoryScreen() {
  const { rollHistory, clearHistory, games } = useGameStore();
  const { colors } = useThemeStore();

  // Calculate histogram for current session
  const currentHistogram = calculateHistogram(rollHistory);
  const maxCurrentValue = Math.max(...currentHistogram);

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
    subtitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginTop: 32,
      marginBottom: 16,
    },
    clearButton: {
      backgroundColor: '#ef4444',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignSelf: 'flex-end',
      marginBottom: 20,
    },
    clearButtonText: {
      color: 'white',
      fontWeight: '600',
    },
    emptyText: {
      textAlign: 'center',
      color: colors.subtext,
      fontSize: 16,
      marginTop: 20,
    },
    gameContainer: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    gameTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    gameSubtitle: {
      fontSize: 14,
      color: colors.subtext,
      marginBottom: 2,
    },
    rollCount: {
      fontSize: 12,
      color: colors.subtext,
      textAlign: 'right',
      marginTop: 8,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Current Game Statistics</Text>
      
      {rollHistory.length > 0 && (
        <>
          <HistogramChart 
            data={currentHistogram}
            maxValue={maxCurrentValue}
          />
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearHistory}>
            <Text style={styles.clearButtonText}>Clear History</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.subtitle}>Previous Games</Text>
      
      {games.map((game) => {
        const histogram = calculateHistogram(game.rolls);
        const maxValue = Math.max(...histogram);
        
        return (
          <View key={game.id} style={styles.gameContainer}>
            <Text style={styles.gameTitle}>
              Game from {new Date(game.startTime).toLocaleDateString()}
            </Text>
            <Text style={styles.gameSubtitle}>
              Duration: {Math.round((game.endTime! - game.startTime) / 1000 / 60)} minutes
            </Text>
            <Text style={styles.gameSubtitle}>
              Players: {game.players.map(p => p.name).join(', ')}
            </Text>
            <HistogramChart 
              data={histogram}
              maxValue={maxValue}
            />
            <Text style={styles.rollCount}>
              Total Rolls: {game.rolls.length}
            </Text>
          </View>
        );
      })}

      {games.length === 0 && rollHistory.length === 0 && (
        <Text style={styles.emptyText}>No games played yet</Text>
      )}
    </ScrollView>
  );
}