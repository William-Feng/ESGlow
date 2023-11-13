import { useEffect, useState } from "react";

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
