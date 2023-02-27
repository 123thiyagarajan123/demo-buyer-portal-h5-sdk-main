export const createDataSetItem = (
  percentage: number,
  text: string
): SohoDataSetItem => {
  const color = determineColor(percentage);

  const chartData: SohoChartData = createChartData(
    parseInt(percentage.toString()),
    color,
    text
  );

  const chartDataSetItem: SohoDataSetItem = {
    data: [chartData],
  };

  return chartDataSetItem;
};

export const createChartData = (
  value: number,
  color: string,
  text: string
): SohoChartData => {
  return {
    name: {
      text,
    },
    completed: {
      value,
      color,
    },
    total: {
      value: 100,
    },
  };
};

export const determineColor = (percentage: number): string => {
  let color = 'primary';
  if (percentage > 100) {
    color = '#C31014';
  } else if (percentage >= 90) {
    color = '#DF6F00';
  } else {
    color = '#25AF65';
  }
  return color;
};
