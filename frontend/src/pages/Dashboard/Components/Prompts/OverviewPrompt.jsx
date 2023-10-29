import { Box, Typography } from "@mui/material";

export default function OverviewPrompt() {
  return (
    <Box
      sx={{
        display: "flex",
        padding: "32px 0",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "34.5vh",
        bgcolor: "#f5f5f5",
        mx: "auto",
      }}
    >
      <Typography
        variant="h4"
        color="text.secondary"
        paragraph
        textAlign="center"
      >
        Please select a company from the search bar above to view its details.
      </Typography>
    </Box>
  );
}
