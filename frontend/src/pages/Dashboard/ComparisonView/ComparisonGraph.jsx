import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useContext, useEffect, useState } from "react";
import { ComparisonViewContext } from "./ComparisonView";
import { CircularProgress } from '@mui/material';

export default function ComparisonGraph({ token }) {
  const {
    selectedCompanies,
    selectedYear,
    selectedIndicators,
  } = useContext(ComparisonViewContext);

  const [currentData, setCurrentData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (selectedCompanies.length === 0 || selectedIndicators.length === 0) {
      return;
    }
    const indicatorIds = selectedIndicators.join(",");
    let yearsListString = selectedYear.join(",");

    const newData = [];
    const promisesList = []
    // Create an object to store data for each indicator_id
    setIsLoading(true)
    selectedCompanies.forEach((c) => {
      promisesList.push(
        fetch(`/api/values/${c.company_id}/${indicatorIds}/${yearsListString}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const dataValues = data.values;

            const indicatorData = {};
            // Initialize the indicatorData object
            selectedIndicators.forEach((indicatorId) => {
              indicatorData[indicatorId] = {
                label: `${c.name} #${indicatorId}`,
                data: [],
              };
            });

            dataValues.forEach((dataValue) => {
              indicatorData[dataValue.indicator_id].data.push(dataValue.value);
            });
            
            selectedIndicators.forEach((indicatorId) => {
              newData.push(indicatorData[indicatorId]);
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
      setIsLoading(false)
    })
    .catch((error) => {
      console.error("Error fetching all indicator values:", error);
    })

  }, [token, selectedCompanies, selectedIndicators, selectedYear]);

  console.log(selectedYear)

  return (
    <>
    {isLoading ?
      <CircularProgress />
      :
      <LineChart
        series={currentData}
        xAxis={[{ scaleType: 'point', data: selectedYear }]}
      />
    }
    </>
  );
}