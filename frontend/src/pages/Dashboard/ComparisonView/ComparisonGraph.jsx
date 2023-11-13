import { FormControlLabel, Switch } from "@mui/material";
import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useContext, useEffect, useState } from "react";
import { ComparisonViewContext } from "./ComparisonView";
import { CircularProgress } from "@mui/material";
import { useIndicatorMeanScores } from "../../../hooks/UseGraphData";

function ComparisonGraph({ token }) {
  const {
    selectedCompanies,
    yearsList,
    selectedYearRange,
    selectedIndicators,
  } = useContext(ComparisonViewContext);

  const [currentData, setCurrentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAverage, setShowAverage] = useState(false);
  const [selectedIndicatorAverage, setSelectedIndicatorAverage] = useState([]);

  useEffect(() => {
    // Update the average when the selected indicators change or if the switch is toggled
    if (showAverage && selectedIndicators.length > 0) {
      setSelectedIndicatorAverage([selectedIndicators[0]]);
    }
  }, [selectedIndicators, showAverage]);

  const handleToggleAverage = () => {
    setShowAverage((prev) => !prev);
    if (showAverage) {
      setSelectedIndicatorAverage([]);
    }
  };

  const { indicatorMeanScores } = useIndicatorMeanScores(
    token,
    selectedIndicatorAverage
  );

  useEffect(() => {
    setIsLoading(true);

    if (selectedCompanies.length === 0 || selectedIndicators.length === 0) {
      setIsLoading(false);
      return;
    }

    const indicatorIds = selectedIndicators.join(",");
    let yearsListString = yearsList.join(",");
    const newData = [];
    const promisesList = [];

    selectedCompanies.forEach((c) => {
      promisesList.push(
        fetch(
          `/api/values/${c.company_id}/${indicatorIds}/${yearsListString}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            const dataValues = data.values;

            const indicatorData = {};
            // Initialise the indicatorData object
            selectedIndicators.forEach((indicatorId) => {
              indicatorData[indicatorId] = {
                label: `${c.name}`,
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
            console.error(
              "Error fetching indicator values for company:",
              error
            );
          })
      );
    });

    Promise.all(promisesList)
      .then(() => {
        setCurrentData(newData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching all indicator values:", error);
      });
  }, [token, selectedCompanies, selectedIndicators, yearsList]);

  return (
    <>
      <FormControlLabel
        control={
          <Switch checked={showAverage} onChange={handleToggleAverage} />
        }
        label="Display Indicator Benchmark Average"
      />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <LineChart
          height={480}
          margin={{ bottom: 100 }}
          series={[
            ...currentData.map((item) => ({
              label: item.label,
              data: item.data.filter((_, index) =>
                selectedYearRange.includes(yearsList[index])
              ),
            })),
            ...(showAverage
              ? indicatorMeanScores.map((item) => ({
                  label: item.label,
                  data: item.data.filter((_, index) =>
                    selectedYearRange.includes(yearsList[index])
                  ),
                }))
              : []),
          ]}
          xAxis={[{ scaleType: "point", data: selectedYearRange }]}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "bottom", horizontal: "middle" },
              margin: "70px 0",
            },
          }}
        />
      )}
    </>
  );
}

export default ComparisonGraph;
