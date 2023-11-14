export const appBarStyle = {
  background: "linear-gradient(45deg, #A7D8F0 30%, #89CFF0 90%)",
  boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
  height: 128,
  zIndex: (theme) => theme.zIndex.drawer + 1,
}

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
}

export const overviewStyle = {
  position: "fixed",
  top: "128px",
  width: "100%",
  height: "calc(100vh - 128px)",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
}

// Below are Landing Page styles

export const landingPageBoxStyle = {
  my: 8,
  mx: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}