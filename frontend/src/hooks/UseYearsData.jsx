import { useState, useEffect } from "react";

function useYearsData(token) {
  const [yearsList, setYearsList] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  useEffect(() => {
    fetch("/api/values/years", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setYearsList(data.years);
        setSelectedYears(data.years);
      })
      .catch((error) => console.error("Error fetching years:", error));
  }, [token]);

  return [yearsList, selectedYears, setSelectedYears];
}

export default useYearsData;
