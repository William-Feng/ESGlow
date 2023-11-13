import { useState, useEffect } from "react";

function UseIndicatorData(token, selectedCompany, yearsList) {
  const [allIndicators, setAllIndicators] = useState([]);
  const [allIndicatorValues, setAllIndicatorValues] = useState([]);

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

        try {
          const valuesResponse = await fetch(
            `/api/values/${companyId}/${indicatorIds}/${yearsList.join(",")}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const valuesData = await valuesResponse.json();
          setAllIndicatorValues(valuesData.values);
        } catch (error) {
          console.error("Error fetching indicator values:", error);
        }
      } catch (error) {
        console.error("Error fetching all indicators:", error);
      }
    };

    fetchIndicators();
  }, [token, selectedCompany, yearsList]);

  return [allIndicators, allIndicatorValues];
}

export default UseIndicatorData;
