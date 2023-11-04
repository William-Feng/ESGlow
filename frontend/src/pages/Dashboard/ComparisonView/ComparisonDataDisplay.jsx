import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
const dummyCompanies = ["Google", "Apple"];
const dummyData = [{ name: "Indicator 1", Google: 90, Apple: 100 }];

export default function ComparisonDataDisplay() {
  return (
    <Box
      sx={{
        padding: "0 20px 24px",
        overflowX: "auto",
        width: "100%",
      }}
    >
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.2em",
                  background: "#D1EFFF",
                  borderRight: "1px solid",
                  borderColor: "divider",
                  padding: "15px",
                  borderBottom: "2px solid",
                }}
              >
                Indicator
              </TableCell>
              {dummyCompanies.map((year) => (
                <TableCell
                  key={year}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    background: "#D1EFFF",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    padding: "5px",
                    borderBottom: "2px solid",
                    textAlign: "center",
                  }}
                >
                  {year}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#FAFAFA" : "#F5F5F5",
                  borderTop: "1px solid #E0E0E0",
                  "&:hover": {
                    backgroundColor: "#E5E5E5",
                  },
                }}
              >
                <TableCell
                  sx={{
                    borderRight: "1px solid",
                    borderColor: "divider",
                    fontSize: "1.05em",
                  }}
                >
                  {row.name}
                </TableCell>
                {dummyCompanies.map((year) => (
                  <TableCell
                    key={year}
                    sx={{
                      borderRight: "1px solid",
                      borderColor: "divider",
                      textAlign: "center",
                      fontSize: "1.05em",
                    }}
                  >
                    {row[year] || null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
