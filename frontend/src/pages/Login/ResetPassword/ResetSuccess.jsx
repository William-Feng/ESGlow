import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { landingPageBoxStyle } from "../../../styles/ComponentStyle";

function ResetSuccess({ remover }) {
  const navigate = useNavigate();

  function handleResetSuccess() {
    remover("email");
    navigate("/");
  }

  return (
    <Box sx={landingPageBoxStyle}>
      <Typography variant="h4" gutterBottom>
        Password Reset Successful
      </Typography>

      <Box
        component="div"
        sx={{
          width: "90%",
          maxWidth: "420px",
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="subtitle1" color="textSecondary" mb={2}>
          You can now use your new password to log in.
        </Typography>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleResetSuccess}
        >
          Go to Login
        </Button>
      </Box>
    </Box>
  );
}

export default ResetSuccess;
