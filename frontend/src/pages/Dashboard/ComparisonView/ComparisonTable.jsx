import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export default function ComparisonTable({ selectedCompanies, currentData }) {
  console.log(currentData)
  return (
    <>
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
                  fontSize: "1.25em",
                  background: "#D1EFFF",
                  borderRight: "1px solid",
                  borderColor: "divider",
                  padding: "15px",
                  borderBottom: "2px solid",
                }}
              >
                Indicator
              </TableCell>
              {selectedCompanies.map((company) => (
                <TableCell
                  key={company.company_id}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.25em",
                    background: "#D1EFFF",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    padding: "10px",
                    borderBottom: "2px solid",
                    textAlign: "center",
                  }}
                >
                  {company.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(currentData).map(([index, row]) => (
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
                    fontSize: "1.1em",
                  }}
                >
                  {row.name}
                </TableCell>
                {selectedCompanies.map((company) => (
                  <TableCell
                    key={company.company_id}
                    sx={{
                      borderRight: "1px solid",
                      borderColor: "divider",
                      textAlign: "center",
                      fontSize: "1.1em",
                    }}
                  >
                    {row[company.company_id] || null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  )
}
