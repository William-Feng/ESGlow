function ScoreCalculation(
  savedWeights,
  filteredData,
  savedAdditionalIndicatorWeights,
  additionalIndicatorsData
) {
  let totalWeightSum = 0;
  let frameworkScore = 0;
  let additionalScore = 0;

  // Calculate total weight sum from savedWeights, and add the weights from the additional indicators
  if (savedWeights && savedWeights.metrics) {
    totalWeightSum += savedWeights.metrics.reduce(
      (accumulator, metric) => accumulator + metric.metric_weight,
      0
    );
  }

  Object.values(savedAdditionalIndicatorWeights).forEach((weight) => {
    totalWeightSum += weight;
  });

  // Calculate scores for the default framework
  // For each selected indicator within a metric, the score contribution is its value multiplied by its
  // relative weight within the metric, then multiplied by the metric's weight relative to the total weight sum.
  if (savedWeights && savedWeights.metrics) {
    frameworkScore = savedWeights.metrics.reduce((accumulator, metric) => {
      const filteredIndicatorIds = filteredData.map(
        (data) => data.indicator_id
      );

      const selectedIndicators = metric.indicators.filter((indicator) =>
        filteredIndicatorIds.includes(indicator.indicator_id)
      );

      const totalIndicatorWeight = selectedIndicators.reduce(
        (acc, indicator) => acc + indicator.indicator_weight,
        0
      );

      const metricScore = metric.indicators.reduce((acc, indicator) => {
        const matchingIndicator = filteredData.find(
          (data) =>
            data.indicator_id === indicator.indicator_id &&
            data.year === savedWeights.year
        );

        if (matchingIndicator) {
          const indicatorRelativeWeight =
            indicator.indicator_weight / totalIndicatorWeight;
          const indicatorScore =
            matchingIndicator.value *
            indicatorRelativeWeight *
            (metric.metric_weight / totalWeightSum);

          return acc + indicatorScore;
        }
        return acc;
      }, 0);

      return accumulator + metricScore;
    }, 0);
  }

  // Calculate scores for the additional indicators (note that these are not grouped into metrics)
  // For each, the score contribution is its value multiplied by its relative weight in the total weight sum.
  if (Object.keys(savedAdditionalIndicatorWeights).length > 0) {
    additionalScore = additionalIndicatorsData.reduce((accumulator, data) => {
      if (!savedWeights || savedWeights.year === data.year) {
        const weight =
          savedAdditionalIndicatorWeights[data.indicator_id.toString()] || 0;
        const normalisedWeight = weight / totalWeightSum;
        const indicatorScore = data.value * normalisedWeight;
        return accumulator + indicatorScore;
      }
      return accumulator;
    }, 0);
  }

  return frameworkScore + additionalScore;
}

export default ScoreCalculation;
