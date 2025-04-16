import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

interface HistogramChartProps {
  data: number[];
  maxValue: number;
  height?: number;
}

function HistogramChartComponent({ data, maxValue, height = 200 }: HistogramChartProps) {
  const { colors } = useThemeStore();
  
  const getBarHeight = (value: number) => {
    return maxValue > 0 ? (value / maxValue) * height : 0;
  };

  const styles = useMemo(() => StyleSheet.create({
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
  }), [colors]);

  const bars = useMemo(() => {
    return data.map((value, index) => (
      <View key={index} style={styles.barContainer}>
        <View style={[styles.bar, { height: getBarHeight(value) }]} />
        <Text style={styles.label}>{index + 2}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    ));
  }, [data, maxValue, styles]);

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {bars}
      </View>
    </View>
  );
}

export const HistogramChart = React.memo(HistogramChartComponent);