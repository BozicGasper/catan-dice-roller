import { View, Text, StyleSheet } from 'react-native';
import { Ship } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '@/store/themeStore';

interface PirateProgressProps {
  progress: number;
}

export function PirateProgress({ progress }: PirateProgressProps) {
  const { colors } = useThemeStore();

  // Calculate colors based on progress
  const getProgressColors = (progress: number) => {
    if (progress < 25) return ['#22c55e', '#4ade80']; // Green
    if (progress < 50) return ['#eab308', '#facc15']; // Yellow
    if (progress < 75) return ['#f97316', '#fb923c']; // Orange
    return ['#dc2626', '#ef4444']; // Red
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      marginVertical: 8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    progressContainer: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      borderRadius: 4,
    },
    progressText: {
      marginTop: 8,
      fontSize: 12,
      color: colors.subtext,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ship size={24} color={colors.subtext} />
        <Text style={styles.title}>Pirate Progress</Text>
      </View>
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={getProgressColors(progress)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBar, { width: `${progress}%` }]}
        />
      </View>
      <Text style={styles.progressText}>
        {Math.round(progress)}% ({Math.floor(progress / 12.5)}/8)
      </Text>
    </View>
  );
}