import React from "react";
import { TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function DataRow({
  row,
  backgroundColor,
  borderTopColor,
  hoverColor,
  selectedYears,
}) {
  return (
    <TableRow
      sx={{
        backgroundColor: backgroundColor,
        borderTop: `1px solid ${borderTopColor}`,
        "&:hover": {
          backgroundColor: hoverColor,
        },
      }}
    >
      <TableCell
        sx={{
          borderRight: "1px solid",
          borderColor: "divider",
          fontSize: "1.1em",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {row.name}
        <Tooltip
          title={
            <React.Fragment>
              {row.source.split(";").map((source, index) => {
                // Splitting the source string into three parts: the source number, name and description
                const [sourceNumber, sourceRest] = source.split(/:(.+)/);
                const [sourceName, sourceDescription] =
                  sourceRest.split(/\((.+)/);

                return (
                  <div
                    key={index}
                    style={{
                      marginBottom:
                        index < row.source.split(";").length - 1 ? 10 : 0,
                    }}
                  >
                    <Typography
                      component="span"
                      style={{ fontStyle: "italic" }}
                    >
                      {sourceNumber.trim()}:
                    </Typography>{" "}
                    <Typography component="span" style={{ fontWeight: "bold" }}>
                      {sourceName.trim()}
                    </Typography>
                    {" (" + sourceDescription.trim()}
                  </div>
                );
              })}
            </React.Fragment>
          }
          sx={{ marginLeft: "4px" }}
        >
          <InfoOutlinedIcon style={{ cursor: "pointer" }} />
        </Tooltip>
      </TableCell>
      {selectedYears.map((year) => (
        <TableCell
          key={year}
          sx={{
            borderRight: "1px solid",
            borderColor: "divider",
            textAlign: "center",
            fontSize: "1.1em",
          }}
        >
          {row[year] || null}
        </TableCell>
      ))}
    </TableRow>
  );
}

export default DataRow;
