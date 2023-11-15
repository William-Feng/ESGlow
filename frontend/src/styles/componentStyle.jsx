import { bigDashboard, mediumDashboard, smallDashboard } from "./viewportSizes";

// Below are Landing Page styles

export const landingPageBoxStyle = {
  my: 8,
  mx: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

// Below are Dashboard component styles

export const appBarStyle = (isSingleView) => {
  const baseStyle = {
    background: "linear-gradient(45deg, #A7D8F0 30%, #89CFF0 90%)",
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
    height: 128,
    zIndex: (theme) => theme.zIndex.drawer + 1,
  };

  if (isSingleView) {
    baseStyle[`@media (max-width: ${mediumDashboard}px)`] = {
      height: "300px",
    };
  } else {
    baseStyle[`@media (max-width: ${mediumDashboard}px)`] = {
      height: "200px",
    };
  }

  return baseStyle;
};

export const drawerStyle = (isCompanySelected) => {
  return {
    width: 360,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      position: "static",
      width: 360,
      boxSizing: "border-box",
      overflowY: "auto",
      maxHeight: "100%",
      backgroundColor: isCompanySelected ? "transparent" : "#f5f5f5",
    },
  };
};

export const drawerBoxStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "row",
  overflowY: "auto",
};

export const overviewStyle = (isSingleView) => {
  const baseStyle = {
    position: "fixed",
    top: "128px",
    width: "100%",
    height: "calc(100vh - 128px)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  };

  if (isSingleView) {
    baseStyle[`@media (max-width: ${mediumDashboard}px)`] = {
      top: "300px",
      height: "calc(100vh - 300px)",
    };
  } else {
    baseStyle[`@media (max-width: ${mediumDashboard}px)`] = {
      top: "200px",
      height: "calc(100vh - 200px)",
    };
  }
  return baseStyle;
};

export const toggleButtonStyle = {
  fontSize: "13px",
  [`@media (max-width: ${bigDashboard}px)`]: {
    fontSize: "10px",
  },
  [`@media (max-width: ${mediumDashboard}px)`]: {
    fontSize: "1rem",
  },
  [`@media (max-width: ${smallDashboard}px)`]: {
    fontSize: "4vw",
  },
};

export const searchBarBoxStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 5,
  [`@media (max-width: ${mediumDashboard}px)`]: {
    flexDirection: "column",
    gap: 2,
  },
};

export const searchBarStyle = {
  width: "300px",
  backgroundColor: "white",
  borderRadius: 1,
  [`@media (max-width: ${mediumDashboard}px)`]: {
    width: "80vw",
  },
};
