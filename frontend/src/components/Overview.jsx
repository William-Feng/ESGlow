import { Box, Container, Typography } from "@mui/material";
import React from "react";

export default function Overview() {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        mx: "auto",
        padding: "16px 0",
      }}
    >
      <Typography
        component="h1"
        variant="h3"
        color="text.primary"
        gutterBottom
        textAlign="center"
      >
        Company Name
      </Typography>
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          alignItems: "center",
          border: 1,
          borderRadius: 4,
          padding: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" color="text.secondary" paragraph>
            Summary of company's ESG reporting...
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h2" color="text.primary" paragraph>
              50
            </Typography>
            <Typography variant="h6" color="text.secondary">
              ESG Rating
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" color="text.primary" paragraph>
              43
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Industry Mean
            </Typography>
            <Typography
              variant="h5"
              color="text.primary"
              sx={{ margin: "24px 0px" }}
              paragraph
            >
              24/185
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Industry Ranking
            </Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            textAlign="center"
          >
            Chart
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
