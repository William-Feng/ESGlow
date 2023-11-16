import { useState, useEffect } from "react";

function useESGData(token, selectedCompanies) {
  const [companyData, setCompanyData] = useState([]);
  const [portfolioRating, setPortfolioRating] = useState([]);
  const [bestPerformer, setBestPerformer] = useState(0);
  const [worstPerformer, setWorstPerformer] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCompanies.length === 0) {
        return;
      }

      try {
        let company_ids = selectedCompanies.map((c) => c.company_id).join(",");

        const response = await fetch(`/api/values/company/${company_ids}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // Clear previous data before updating
        setCompanyData([]);

        const esgScores = selectedCompanies.map((company) => {
          const esgScore = data[company.company_id].value.ESGscore;
          const year = data[company.company_id].value.year;

          // Update companyData only for the selected companies
          setCompanyData((prevData) => [
            ...prevData,
            {
              company_id: company.company_id,
              name: company.name,
              score: esgScore,
              year: year,
            },
          ]);

          return esgScore;
        });

        if (esgScores.length === 0) {
          // No scores available
          setPortfolioRating([]);
          setBestPerformer(0);
          setWorstPerformer(0);
        } else {
          // Calculate average ESG score
          const totalScore = esgScores.reduce((sum, score) => sum + score, 0);
          const averageScore = totalScore / esgScores.length;
          setPortfolioRating(averageScore.toFixed(1));

          // Find best and worst performers
          setBestPerformer(Math.max(...esgScores));
          setWorstPerformer(Math.min(...esgScores));
        }
      } catch (error) {
        console.error("There was an error fetching the ESG scores.", error);
      }
    };

    fetchData();
  }, [token, selectedCompanies]);

  return { companyData, portfolioRating, bestPerformer, worstPerformer };
}

export default useESGData;
