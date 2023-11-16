import { FormControlLabel, Switch } from "@mui/material";
import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useContext, useEffect, useState, useRef } from "react";
import { ComparisonModeContext } from "./ComparisonMode";
import { Box, Button, CircularProgress } from "@mui/material";
import {
  useIndicatorMeanScores,
  useComparisonGraphData,
} from "../../../hooks/UseComparisonData";

function ComparisonGraph({ token }) {
  const {
    selectedCompanies,
    yearsList,
    selectedYearRange,
    selectedIndicators,
  } = useContext(ComparisonModeContext);

  const { graphData, isLoading, setIsLoading } = useComparisonGraphData(
    token,
    selectedCompanies,
    selectedIndicators,
    yearsList
  );
  const [showAverage, setShowAverage] = useState(false);
  const [selectedIndicatorAverage, setSelectedIndicatorAverage] = useState([]);
  const chartRef = useRef(null);

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

  // Download graph display as SVG
  const handleDownload = () => {
    setIsLoading(true);

    try {
      const chartNode = chartRef.current;
      const svgData = new XMLSerializer().serializeToString(chartNode);

      // Find path elements with the specified classes
      let parser = new DOMParser();
      let svgDoc = parser.parseFromString(svgData, "image/svg+xml");
      let pathElements = svgDoc.querySelectorAll(
        ".css-wn5hww-MuiLineElement-root, .css-a8rcf6-MuiLineElement-root, .css-1l0ye40-MuiLineElement-root, .css-u0sr46-MuiLineElement-root"
      );

      // Apply legend color to each line and remove fill attribute
      let legendColors = [];
      svgDoc.querySelectorAll(".MuiChartsLegend-mark").forEach((rect) => {
        legendColors.push(rect.getAttribute("fill"));
      });
      pathElements.forEach((path, index) => {
        path.setAttribute("fill", "transparent");
        path.setAttribute("stroke", legendColors[index]);
      });

      // Serialize the modified SVG document back to a string
      let modifiedSvgData = new XMLSerializer().serializeToString(svgDoc);

      const blob = new Blob([modifiedSvgData], { type: "image/svg+xml" });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const indicator = indicatorMeanScores[0].label.replace(/\s+/g, "_");
      a.download = `${indicator}_Chart.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error capturing chart as image:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <>
          <LineChart
            ref={(ref) => (chartRef.current = ref)}
            height={480}
            margin={{ bottom: 100 }}
            series={[
              ...graphData.map((item) => ({
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
          <Box
            sx={{
              pt: 3,
              display: "flex",
              float: "left",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
              sx={{
                width: "150px",
                height: "55px",
                whiteSpace: "normal",
                textAlign: "center",
              }}
            >
              Download
            </Button>
          </Box>
        </>
      )}
    </>
  );
}

export default ComparisonGraph;
