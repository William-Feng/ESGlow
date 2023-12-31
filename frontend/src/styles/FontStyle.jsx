import { maxWidthMedium, maxWidthSmall } from "./ViewportSizes";

export const logoFont = {
  fontWeight: 700,
  letterSpacing: "0.2rem",
  textAlign: "center",
  fontSize: "5rem",
  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)",
  mb: "5px",
  [`@media (max-width: ${maxWidthMedium}px)`]: {
    fontSize: "3rem",
    mb: "20px",
  },
};

export const logoSizeStyle = {
  width: "200px",
  marginBottom: "1rem",
  maxWidth: "100%",
  height: "auto",
  [`@media (max-width: ${maxWidthSmall}px)`]: {
    width: "150px",
  },
};

export const headingFont = {
  textAlign: "center",
  fontSize: "2.5rem",
  [`@media (max-width: ${maxWidthMedium}px)`]: {
    fontSize: "2rem",
  },
  [`@media (max-width: ${maxWidthSmall}px)`]: {
    fontSize: "8vw",
  },
};

export const iconCaptionFont = {
  maxWidth: "200px",
  textAlign: "center",
  [`@media (max-width: ${maxWidthSmall}px)`]: {
    display: "none",
  },
};

export const accordionSummaryFont = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
};

export const landingPageLinkFont = {
  fontSize: "1rem",
};

// Below is table font size

export const tableCellStyle = {
  fontWeight: "bold",
  fontSize: "1.25em",
  background: "#D1EFFF",
  borderRight: "1px solid",
  borderColor: "divider",
  borderBottom: "2px solid",
  textAlign: "center",
  [`@media (max-width: ${maxWidthSmall}px)`]: {
    fontSize: "0.8em",
  },
};

export const tableCellTitleStyle = {
  fontWeight: "bold",
  fontSize: "1.25em",
  background: "#D1EFFF",
  borderRight: "1px solid",
  borderColor: "divider",
  padding: "15px",
  borderBottom: "2px solid",
  [`@media (max-width: ${maxWidthSmall}px)`]: {
    fontSize: "1em",
  },
};

export const tableRowTitleStyle = {
  borderRight: "1px solid",
  borderColor: "divider",
  fontSize: "1.1em",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [`@media (max-width: ${maxWidthSmall}px)`]: {
    fontSize: "0.7em",
  },
};

export const tableRowStyle = {
  borderRight: "1px solid",
  borderColor: "divider",
  textAlign: "center",
  fontSize: "1.1em",
};
