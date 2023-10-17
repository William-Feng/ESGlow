import { Box, Typography, Button, Avatar, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo-white.png";

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
        if (response.status === 401) {
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
        console.error("There was an error fetching the user's name!", error)
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
    <>
      <Box
        component="img"
        sx={{
          height: 64,
        }}
        alt="logo"
        src={Logo}
      />
      <Box sx={{ flexGrow: 0, marginLeft: "auto" }}>
        <Button onClick={handleOpenUserMenu}>
          <Avatar>{name[0]}</Avatar>
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
    </>
  );
}

export default Header;
