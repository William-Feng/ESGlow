import {
  Box,
  Typography
} from "@mui/material";
import { useContext, createContext, useEffect, useState } from "react";
import { ComparisonViewContext } from "./ComparisonView";
import ComparisonTable from "./ComparisonTable";
import ComparisonGraph from "./ComparisonGraph";

export const ComparisonDataViewContext = createContext();

function ComparisonDataDisplay({ token }) {
  const {
    dataView,
    selectedCompanies,
    selectedYear,
    selectedIndicators,
    yearsList
  } = useContext(ComparisonViewContext);

  const [currentData, setCurrentData] = useState({})

  useEffect(() => {
    if (selectedCompanies.length === 0 || selectedIndicators.length === 0) {
      return;
    }
    const indicatorIds = selectedIndicators.join(",");
    let yearsListString = yearsList.join(",");
    if (dataView === 'table') {
      yearsListString = selectedYear[0]
    }
    const newData = {};

    const promisesList = [];
    
    selectedCompanies.forEach((c) => {
      promisesList.push(
        fetch(`/api/values/${c.company_id}/${indicatorIds}/${yearsListString}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const dataValues = data.values
            console.log(dataValues)
            dataValues.forEach((indicatorInfo) => {
              if (!newData[indicatorInfo.indicator_id]) {
                newData[indicatorInfo.indicator_id] = {
                  name: indicatorInfo.indicator_name,
                };
              }
              newData[indicatorInfo.indicator_id][c.company_id] = indicatorInfo.value;
            });
          })
          .catch((error) => {
            console.error("Error fetching indicator values for company:", error);
          })
      )
    });

    Promise.all(promisesList)
    .then(() => {
      setCurrentData(newData)
    })
    .catch((error) => {
      console.error("Error fetching all indicator values:", error);
    })

  }, [token, selectedCompanies, selectedIndicators, selectedYear, yearsList, dataView]);

  if (selectedCompanies.length === 0 || selectedYear.length === 0 || selectedIndicators.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          bgcolor: "#f5f5f5",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {selectedCompanies.length === 0
            ? "Please select one or more companies to see the ESG data."
            : selectedYear.length === 0
            ? "Please select a year to see the ESG data."
            : "Please select one or more indicators to see the ESG data"
          }
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "0 20px 24px",
        overflowX: "auto",
        width: "100%",
      }}
    >
      {dataView === 'table' ? (
        <ComparisonTable selectedCompanies={selectedCompanies} currentData={currentData}/>
      ) : (
        <ComparisonGraph />
      )}
    </Box>
  );
}

export default ComparisonDataDisplay;
