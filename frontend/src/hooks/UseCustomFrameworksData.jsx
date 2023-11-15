import { useState, useEffect, useCallback } from "react";

function useCustomFrameworksData(
  token,
  isManagingCustomFrameworks,
  saveTrigger
) {
  const [customFrameworks, setCustomFrameworks] = useState([]);

  useEffect(() => {
    const fetchCustomFrameworks = async () => {
      try {
        const response = await fetch("/api/custom-frameworks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCustomFrameworks(data.custom_frameworks);
      } catch (error) {
        console.error("Error fetching custom frameworks", error);
      }
    };

    fetchCustomFrameworks();
  }, [token, isManagingCustomFrameworks, saveTrigger]);

  const deleteCustomFramework = useCallback(
    async (frameworkId) => {
      try {
        await fetch(`/api/custom-frameworks/${frameworkId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCustomFrameworks((prevFrameworks) =>
          prevFrameworks.filter((f) => f.framework_id !== frameworkId)
        );
        return { success: true };
      } catch (error) {
        console.error("Error deleting custom framework", error);
        return { success: false, error };
      }
    },
    [token]
  );

  return { customFrameworks, deleteCustomFramework };
}

export default useCustomFrameworksData;
