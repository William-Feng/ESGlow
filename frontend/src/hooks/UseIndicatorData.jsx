import { useState, useEffect, useCallback } from "react";

function useIndicatorData(token, selectedCompany, yearsList) {
  const [allIndicators, setAllIndicators] = useState([]);
  const [allIndicatorValues, setAllIndicatorValues] = useState([]);

  // Fetch the specific indicator values for a company over the years
  const fetchIndicatorValues = useCallback(
    async (companyId, indicatorIds) => {
      try {
        const response = await fetch(
          `/api/values/${companyId}/${indicatorIds}/${yearsList.join(",")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return await response.json();
      } catch (error) {
        console.error("Error fetching indicator values:", error);
        return null;
      }
    },
    [token, yearsList]
  );

  useEffect(() => {
    const fetchIndicators = async () => {
      const companyId = selectedCompany ? selectedCompany.company_id : 0;
      if (!companyId) {
        setAllIndicators([]);
        setAllIndicatorValues([]);
        return;
      }

      try {
        const indicatorsResponse = await fetch("/api/indicators/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const indicatorsData = await indicatorsResponse.json();
        setAllIndicators(indicatorsData.indicators);
        const indicatorIds = indicatorsData.indicators
          .map((d) => d.indicator_id)
          .join(",");

        const valuesData = await fetchIndicatorValues(companyId, indicatorIds);
        if (valuesData) {
          setAllIndicatorValues(valuesData.values);
        }
      } catch (error) {
        console.error("Error fetching all indicators:", error);
      }
    };

    fetchIndicators();
  }, [token, selectedCompany, yearsList, fetchIndicatorValues]);

  return [allIndicators, allIndicatorValues, fetchIndicatorValues];
}

export default useIndicatorData;
