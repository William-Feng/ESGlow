import { useContext } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import { SingleModeContext } from "./SingleMode";
import { CircularProgress } from "@mui/material";

export default function SingleBarChart({
  structuredData,
  structuredExtraData,
}) {
  const { selectedYears } = useContext(SingleModeContext);

  return (
    <>
      {structuredData.length || structuredExtraData.length ? (
        <BarChart
          dataset={[...structuredData, ...structuredExtraData]}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "name",
              tickLabelStyle: {
                angle: 10,
                textAnchor: "start",
                fontSize: 9,
              },
            },
          ]}
          yAxis={[{ label: "Indicator Value" }]}
          sx={{
            [`.${axisClasses.left} .${axisClasses.label}`]: {
              transform: "translate(-10px, 0)",
            },
          }}
          series={selectedYears.map((year) => ({
            dataKey: `${year}`,
            label: `${year}`,
          }))}
        />
      ) : (
        <CircularProgress />
      )}
    </>
  );
}
