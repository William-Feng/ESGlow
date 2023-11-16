import { useCallback, useEffect, useState } from "react";

export function useESGScoresData(token, selectedCompany) {
  const [historicalEsgScores, setHistoricalEsgScores] = useState([]);
  const [EsgScoresYears, setEsgScoresYears] = useState([]);

  useEffect(() => {
    const fetchHistoricalEsgScoresList = async () => {
      if (selectedCompany) {
        try {
          const response = await fetch(
            `/api/values/graph/company/${selectedCompany.company_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          const sortedData = data["year_values"].sort((a, b) => a[0] - b[0]);
          setEsgScoresYears(sortedData.map((tuple) => tuple[0].toString()));
          setHistoricalEsgScores(
            sortedData.map((tuple) => Math.round(tuple[1]))
          );
        } catch (error) {
          console.error("Error fetching historical ESG Scores", error);
        }
      }
    };

    if (selectedCompany) {
      fetchHistoricalEsgScoresList();
    }
  }, [token, selectedCompany]);

  return { historicalEsgScores, EsgScoresYears };
}

export function useIndicatorMeanScores(token, indicatorIds) {
  const [indicatorMeanScores, setIndicatorMeanScore] = useState([]);

  useEffect(() => {
    const fetchHistoricalEsgScoresList = async (indicator) => {
      try {
        const response = await fetch(
          `/api/values/graph/indicator/${indicator}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        setIndicatorMeanScore((prevScores) => {
          const isDuplicate = prevScores.some(
            (entry) =>
              entry.label === `${data["indicator_name"]} Benchmark Average`
          );
          if (!isDuplicate) {
            return [
              ...prevScores,
              {
                data: data["indicator_scores"].map((tuple) => tuple[1]),
                label: `${data["indicator_name"]} Benchmark Average`,
              },
            ];
          }
          return prevScores;
        });
      } catch (error) {
        console.error("Error fetching indicator mean scores", error);
      }
    };

    setIndicatorMeanScore([]);
    indicatorIds.forEach((i) => {
      fetchHistoricalEsgScoresList(i);
    });

    // eslint-disable-next-line
  }, [token, indicatorIds]);

  return { indicatorMeanScores };
}

export function useComparisonTableData(
  token,
  selectedCompanies,
  selectedIndicators,
  selectedYear,
  indicatorsList,
  yearsList,
  dataView
) {
  const [currentData, setCurrentData] = useState({});

  useEffect(() => {
    if (selectedCompanies.length === 0 || selectedIndicators.length === 0) {
      return;
    }

    const indicatorIds = selectedIndicators.join(",");
    let yearsListString = yearsList.join(",");
    if (dataView === "table") {
      yearsListString = selectedYear[0];
    }
    const newData = {};
    const promisesList = [];

    selectedCompanies.forEach((c) => {
      promisesList.push(
        fetch(
          `/api/values/${c.company_id}/${indicatorIds}/${yearsListString}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            const dataValues = data.values;
            dataValues.forEach((indicatorInfo) => {
              if (!newData[indicatorInfo.indicator_id]) {
                const indicator_source = indicatorsList.find(
                  (indicator) =>
                    indicator.indicator_id === indicatorInfo.indicator_id
                )?.indicator_source;
                newData[indicatorInfo.indicator_id] = {
                  name: indicatorInfo.indicator_name,
                  source: indicator_source,
                };
              }
              newData[indicatorInfo.indicator_id][c.company_id] =
                indicatorInfo.value;
            });
          })
          .catch((error) => {
            console.error(
              "Error fetching indicator values for company:",
              error
            );
          })
      );
    });

    Promise.all(promisesList)
      .then(() => {
        setCurrentData(newData);
      })
      .catch((error) => {
        console.error("Error fetching all indicator values:", error);
      });
  }, [
    token,
    selectedCompanies,
    selectedIndicators,
    selectedYear,
    indicatorsList,
    yearsList,
    dataView,
  ]);

  return currentData;
}

export function useComparisonGraphData(
  token,
  selectedCompanies,
  selectedIndicators,
  yearsList
) {
  const [graphData, setGraphData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGraphData = useCallback(async () => {
    if (selectedCompanies.length === 0 || selectedIndicators.length === 0) {
      setIsLoading(false);
      return;
    }

    const indicatorIds = selectedIndicators.join(",");
    const yearsListString = yearsList.join(",");
    const newData = [];
    const promisesList = [];

    selectedCompanies.forEach((company) => {
      promisesList.push(
        fetch(
          `/api/values/${company.company_id}/${indicatorIds}/${yearsListString}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            const dataValues = data.values;
            const indicatorData = {};
            selectedIndicators.forEach((indicatorId) => {
              indicatorData[indicatorId] = {
                label: `${company.name}`,
                data: [],
              };
            });

            dataValues.forEach((dataValue) => {
              indicatorData[dataValue.indicator_id].data.push(dataValue.value);
            });

            selectedIndicators.forEach((indicatorId) => {
              newData.push(indicatorData[indicatorId]);
            });
          })
          .catch((error) =>
            console.error("Error fetching indicator values for company:", error)
          )
      );
    });

    Promise.all(promisesList)
      .then(() => {
        setGraphData(newData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching all indicator values:", error);
        setIsLoading(false);
      });
  }, [token, selectedCompanies, selectedIndicators, yearsList]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  return { graphData, isLoading, setIsLoading };
}
