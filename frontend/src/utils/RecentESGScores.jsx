function RecentESGScores(frameworksData, indicatorValues) {
  if (!frameworksData) {
    return [];
  }
  let ESGScores = [];

  // Iterate over the frameworks relevant to a company
  frameworksData.forEach((framework) => {
    let frameworkScore = 0;
    const { framework_name } = framework;

    // Map to store the most recent year's indicator values by indicator_id
    const mostRecentIndicatorValues = new Map();

    // Find the most recent values for each indicator_id
    indicatorValues.forEach((indicatorValue) => {
      if (
        !mostRecentIndicatorValues.has(indicatorValue.indicator_id) ||
        indicatorValue.year >
          mostRecentIndicatorValues.get(indicatorValue.indicator_id).year
      ) {
        mostRecentIndicatorValues.set(
          indicatorValue.indicator_id,
          indicatorValue
        );
      }
    });

    // Calculate each metric score
    framework.metrics.forEach((metric) => {
      const { predefined_weight, indicators } = metric;
      const metricScore = indicators.reduce((accumulator, indicator) => {
        const indicatorValue = mostRecentIndicatorValues.get(
          indicator.indicator_id
        );

        if (indicatorValue) {
          const indicatorScore =
            indicatorValue.value * indicator.predefined_weight;
          return accumulator + indicatorScore;
        }

        return accumulator;
      }, 0);

      frameworkScore += predefined_weight * metricScore;
    });

    const mostRecentYear = [...mostRecentIndicatorValues.values()].reduce(
      (maxYear, indicatorValue) => {
        return Math.max(maxYear, indicatorValue.year);
      },
      -Infinity
    );

    ESGScores.push({
      framework_name,
      year: mostRecentYear,
      score: Math.round(frameworkScore),
    });
  });

  return ESGScores;
}

export default RecentESGScores;
