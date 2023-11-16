import { useState, useEffect } from "react";

function useFrameworkData(
  token,
  selectedCompany,
  yearsList,
  fetchIndicatorValues,
  setOverviewExpanded
) {
  const [frameworksData, setFrameworksData] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [fixedIndicatorValues, setFixedIndicatorValues] = useState([]);

  useEffect(() => {
    const fetchFrameworks = async () => {
      const companyId = selectedCompany ? selectedCompany.company_id : 0;
      if (!companyId) {
        setFrameworksData([]);
        setSelectedFramework(null);
        setOverviewExpanded(false);
        return;
      }

      try {
        const response = await fetch(`/api/frameworks/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFrameworksData(data.frameworks);
        setSelectedFramework(null);
        setOverviewExpanded(true);

        const allIndicators = data.frameworks.flatMap((framework) =>
          framework.metrics.flatMap((metric) =>
            metric.indicators.map((indicator) => indicator.indicator_id)
          )
        );
        setSelectedIndicators(allIndicators);

        try {
          // Fetch fixed indicator values (doesn't change with sidebar selections)
          const fixedValues = await fetchIndicatorValues(
            companyId,
            [...new Set(allIndicators)].join(","),
            yearsList.join(",")
          );
          setFixedIndicatorValues(fixedValues.values);
        } catch (error) {
          console.error("Error fetching fixed indicator values:", error);
        }
      } catch (error) {
        console.error("Error fetching frameworks, metrics, indicators:", error);
      }
    };

    fetchFrameworks();
  }, [
    token,
    selectedCompany,
    yearsList,
    fetchIndicatorValues,
    setOverviewExpanded,
  ]);

  return {
    frameworksData,
    selectedFramework,
    setSelectedFramework,
    selectedIndicators,
    setSelectedIndicators,
    fixedIndicatorValues,
  };
}

export default useFrameworkData;
