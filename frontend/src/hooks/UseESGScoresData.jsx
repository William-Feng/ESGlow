import { useEffect, useState } from "react";

function useESGScoresData(token, selectedCompany) {
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

export default useESGScoresData;