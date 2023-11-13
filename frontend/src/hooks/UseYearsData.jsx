import { useState, useEffect } from "react";

function useYearsData(token) {
  const [yearsList, setYearsList] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch("/api/years/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setYearsList(data.years);
        setSelectedYears(data.years);
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };

    fetchYears();
  }, [token]);

  return [yearsList, selectedYears, setSelectedYears];
}

export default useYearsData;
