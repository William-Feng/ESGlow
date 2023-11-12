import { useState, useEffect } from "react";

function useCustomFrameworksData(
  token,
  isManagingCustomFrameworks,
  saveTrigger
) {
  const [customFrameworks, setCustomFrameworks] = useState([]);

  useEffect(() => {
    const fetchCustomFrameworks = () => {
      fetch("/api/custom-frameworks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setCustomFrameworks(data.custom_frameworks);
        })
        .catch((error) =>
          console.error("Error fetching custom frameworks", error)
        );
    };

    fetchCustomFrameworks();
  }, [token, isManagingCustomFrameworks, saveTrigger]);

  return customFrameworks;
}

export default useCustomFrameworksData;
