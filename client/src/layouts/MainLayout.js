import Sidebar from "../components/Sidebar";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

function MainLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "center", position: "relative" }}>

          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              position: "absolute",
              left: 10,
              color: "white",
              display: { xs: "block", md: "none" }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Service System
          </Typography>

        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex" }}>
        <Sidebar open={open} setOpen={setOpen} />

        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            mt: { xs: "56px", sm: "64px" },
            ml: { md: "200px", xs: 0 }
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}

export default MainLayout;