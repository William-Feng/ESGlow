import { useEffect, useState } from "react";

export function useCompanyList(token) {
  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        const response = await fetch("/api/companies/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCompanyList(data.companies);
      } catch (error) {
        console.error(
          "There was an error fetching the company information.",
          error
        );
      }
    };

    fetchAllCompanies();
  }, [token]);

  return companyList;
}

export function useCompanyData(selectedIndustry, token) {
  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      // Reset to null if no industry is selected
      if (!selectedIndustry) {
        setCompanyList([]);
        return;
      }

      try {
        const industryResponse = await fetch(
          `/api/industries/${selectedIndustry}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const industryData = await industryResponse.json();

        // If there are no companies for the selected industry
        if (industryData.companies.length === 0) {
          setCompanyList([]);
          return;
        }

        // Otherwise, fetch the company information
        const companyIds = industryData.companies.join(",");
        const companiesResponse = await fetch(`/api/companies/${companyIds}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const companiesData = await companiesResponse.json();
        setCompanyList(companiesData.companies);
      } catch (error) {
        console.error("Error fetching companies", error);
      }
    };

    fetchCompanies();
  }, [selectedIndustry, token]);

  return companyList;
}
