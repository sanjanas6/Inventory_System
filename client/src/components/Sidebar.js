import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  Toolbar   
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

function Sidebar({ open, setOpen }) {
  const menuItems = [
    { text: "Entry Coupon", path: "/entry" },
    { text: "Supervisor", path: "/entries" },
    { text: "Parts", path: "/parts" },
    { text: "Dashboard", path: "/" },
    { text: "Inventory", path: "/inventory" },
    { text: "Requests", path: "/requests" },
    { text: "Orders", path: "/orders" }
  ];

  return (
    <>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          zIndex: (theme) => theme.zIndex.appBar + 1
        }}
      >
        <Box sx={{ width: 250 }}>

          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={() => setOpen(false)}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        sx={{
          width: 200,
          height: "100vh",
          background: "#f5f5f5",
          display: { xs: "none", md: "block" },
          position: "fixed",
          left: 0,
        }}
      >
        <Toolbar />  

        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} component={Link} to={item.path}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}

export default Sidebar;