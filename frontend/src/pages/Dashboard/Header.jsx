import { Box, Typography, Button, Avatar, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";

function Header(token) {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401 || response.status === 500) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setName(data.name);
      })
      .catch((error) =>
        console.error("There was an error fetching the user's name.", error)
      );
  }, [token, navigate]);

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (e) => {
    setAnchorElUser(e.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleCloseUserMenu();
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box display="flex" alignItems="center">
        <Box component="img" src={Logo} alt="logo" sx={{ height: 50 }} />
      </Box>
      <Box display="flex" alignItems="center">
        <Button onClick={handleOpenUserMenu}>
          <Avatar
            sx={{
              background: "#003366",
              boxShadow: 2,
            }}
          >
            {name[0]}
          </Avatar>
        </Button>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem key="Logout" onClick={handleLogout}>
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export default Header;
