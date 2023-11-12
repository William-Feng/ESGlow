import { useCallback } from "react";

function useIndicatorValuesData(token) {
  const fetchIndicatorValues = useCallback(
    async (companyId, indicatorIds, yearsString) => {
      try {
        const response = await fetch(
          `/api/values/${companyId}/${indicatorIds}/${yearsString}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return await response.json();
      } catch (error) {
        return console.error("Error fetching indicator values:", error);
      }
    },
    [token]
  );

  return fetchIndicatorValues;
}

export default useIndicatorValuesData;
