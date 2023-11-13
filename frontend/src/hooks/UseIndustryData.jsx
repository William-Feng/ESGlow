import { useEffect, useState } from "react";

function useIndustryData(token, selectedIndustry, selectedCompany) {
  const [industryList, setIndustryList] = useState([]);
  const [industryMean, setIndustryMean] = useState(0);
  const [industryRanking, setIndustryRanking] = useState("");

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await fetch("/api/industries/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setIndustryList(data.industries);

        if (selectedIndustry) {
          const industryId = data.industries.indexOf(selectedIndustry) + 1;
          await fetchIndustryData(industryId);
        }
      } catch (error) {
        console.error("Error fetching industries", error);
      }
    };

    const fetchIndustryData = async (industryId) => {
      try {
        const industryResponse = await fetch(
          `/api/values/industry/${industryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const industryData = await industryResponse.json();
        setIndustryMean(industryData.average_score);
      } catch (error) {
        console.error("Error fetching industry data", error);
      }
    };

    const fetchIndustryRanking = async () => {
      if (selectedCompany) {
        try {
          const response = await fetch(
            `/api/values/ranking/company/${selectedCompany.company_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setIndustryRanking(`${data.ranking}/${data.industry_company_count}`);
        } catch (error) {
          console.error("Error fetching industry ranking", error);
        }
      }
    };

    fetchIndustries();
    if (selectedCompany) {
      fetchIndustryRanking();
    }
  }, [token, selectedIndustry, selectedCompany]);

  return { industryList, industryMean, industryRanking };
}

export default useIndustryData;
