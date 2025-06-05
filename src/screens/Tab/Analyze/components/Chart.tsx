import React from 'react';
import {Text, View} from 'react-native';
import {BarChart, PieChart, pieDataItem, stackDataItem} from 'react-native-gifted-charts';

import {useTheme} from '@/contexts/ThemeContext';
import {toDP} from '@/theme/typography';

interface Props {
  pieData?: pieDataItem[];
  barData?: stackDataItem[];
  chartType: 'bar' | 'pie';
}

const Chart = ({pieData, barData, chartType}: Props) => {
  const {theme, typography} = useTheme();

  if (!pieData && !barData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
      {chartType === 'bar' ? (
        <BarChart
          stackData={barData}
          barBorderTopLeftRadius={12}
          barBorderTopRightRadius={12}
          barWidth={18}
          hideRules
          rulesType="solid"
          rulesColor={theme.inactive}
          noOfSections={3}
          // disablePress
          hideYAxisText
          // yAxisLabelSuffix="분"
          yAxisThickness={0}
          xAxisThickness={0}
          initialSpacing={0}
          // showValuesAsTopLabel
          xAxisColor={theme.inactive}
          xAxisLabelTextStyle={{color: theme.text}}
          disableScroll
          isAnimated
          animationDuration={200}
          yAxisExtraHeight={32}
          autoCenterTooltip
          renderTooltip={(item: any) => {
            return (
              <View
                style={{
                  backgroundColor: theme.background,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                  borderColor: theme.primary,
                }}>
                <Text style={[typography.baseTextStyle, {color: theme.text, fontSize: toDP(12), fontWeight: '500'}]}>{item.stacks.map((stack: any) => stack.value).reduce((a: number, b: number) => a + b, 0)} 분</Text>
              </View>
            );
          }}
        />
      ) : (
        <PieChart donut data={pieData ?? []} innerRadius={62} backgroundColor={theme.card} />
      )}
    </View>
  );
};

export default Chart;
