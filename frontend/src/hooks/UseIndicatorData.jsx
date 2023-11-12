import { useState, useEffect } from "react";

function UseIndicatorData(token, selectedCompany, yearsList) {
  const [allIndicators, setAllIndicators] = useState([]);
  const [allIndicatorValues, setAllIndicatorValues] = useState([]);

  useEffect(() => {
    const companyId = selectedCompany ? selectedCompany.company_id : 0;
    if (!companyId) {
      setAllIndicators([]);
      setAllIndicatorValues([]);
      return;
    }

    fetch("/api/indicators/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAllIndicators(data.indicators);
        const indicatorIds = data.indicators
          .map((d) => d.indicator_id)
          .join(",");

        fetch(
          `/api/values/${companyId}/${indicatorIds}/${yearsList.join(",")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => setAllIndicatorValues(data.values))
          .catch((error) =>
            console.error("Error fetching indicator values:", error)
          );
      })
      .catch((error) => console.error("Error fetching all indicators:", error));
  }, [token, selectedCompany, yearsList]);

  return [allIndicators, allIndicatorValues];
}

export default UseIndicatorData;
