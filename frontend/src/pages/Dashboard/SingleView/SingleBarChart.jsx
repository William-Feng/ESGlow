import { useContext } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from '@mui/x-charts';
import { SingleViewContext } from "./SingleView";
import { CircularProgress } from "@mui/material";

export default function SingleBarChart({
  structuredData,
  structuredExtraData,
}) {
  const { selectedYears } = useContext(SingleViewContext);

  console.log("structured", structuredData);
  console.log("extra", structuredExtraData);

  return (
    <>
      {structuredData.length || structuredExtraData.length ?
        <BarChart
          dataset={structuredData}
          xAxis={[{ scaleType: "band", dataKey: "name" }]}
          yAxis={[
            {
              label: "ESG Score",
            },
          ]}
          sx={{
            [`.${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translate(-10px, 0)',
            },
          }}
          series={selectedYears.map((year) => ({
            dataKey: `${year}`,
            label: `${year}`,
          }))}
        />
        :
        <CircularProgress/>
      }
    </>
  );
}
