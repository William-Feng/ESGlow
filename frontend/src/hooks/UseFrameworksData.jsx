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
    const companyId = selectedCompany ? selectedCompany.company_id : 0;
    if (!companyId) {
      setFrameworksData([]);
      setSelectedFramework(null);
      setOverviewExpanded(false);
      return;
    }

    fetch(`/api/frameworks/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFrameworksData(data.frameworks);
        setSelectedFramework(null);
        setOverviewExpanded(true);

        const allIndicators = data.frameworks.flatMap((framework) =>
          framework.metrics.flatMap((metric) =>
            metric.indicators.map((indicator) => indicator.indicator_id)
          )
        );
        setSelectedIndicators(allIndicators);

        // Fetch fixed indicator values (doesn't change with sidebar selections)
        fetchIndicatorValues(
          companyId,
          [...new Set(allIndicators)].join(","),
          yearsList.join(",")
        )
          .then((data) => setFixedIndicatorValues(data.values))
          .catch((error) => console.error(error));
      })
      .catch((error) =>
        console.error("Error fetching frameworks, metrics, indicators:", error)
      );
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
