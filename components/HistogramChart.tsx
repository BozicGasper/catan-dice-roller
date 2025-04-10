import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

interface HistogramChartProps {
  data: number[];
  maxValue: number;
  height?: number;
}

export function HistogramChart({ data, maxValue, height = 200 }: HistogramChartProps) {
  const { colors } = useThemeStore();
  
  const getBarHeight = (value: number) => {
    return maxValue > 0 ? (value / maxValue) * height : 0;
  };

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginVertical: 8,
    },
    chart: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height: 200,
    },
    barContainer: {
      flex: 1,
      alignItems: 'center',
      marginHorizontal: 2,
    },
    bar: {
      width: '80%',
      backgroundColor: colors.primary,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
    label: {
      marginTop: 4,
      fontSize: 12,
      color: colors.subtext,
    },
    value: {
      fontSize: 10,
      color: colors.subtext,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((value, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={[styles.bar, { height: getBarHeight(value) }]} />
            <Text style={styles.label}>{index + 2}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}