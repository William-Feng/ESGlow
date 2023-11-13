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
          const sortedData = data['year_values'].sort((a, b) => a[0] - b[0]);
          setEsgScoresYears(sortedData.map(tuple => tuple[0].toString()))
          setHistoricalEsgScores(sortedData.map(tuple => Math.round(tuple[1])))

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
        console.log(data);
        setIndicatorMeanScore((prev) => {
          const newIndicatorGraph =
            {
              data: data['indicator_scores'].map((tuple) => tuple[1]),
              label: indicator.toString()
            }
            console.log('new line', newIndicatorGraph)
          return [ ...prev, newIndicatorGraph]
        });
      
      } catch (error) {
        console.error("Error fetching indicator mean scores", error);
      }
    }
    
    indicatorIds.forEach((i) => {
      fetchHistoricalEsgScoresList(i);
    })

  }, [token, indicatorIds]);

  return { indicatorMeanScores }
}