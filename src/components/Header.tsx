import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Drawer } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import Login from "./Login";
import Logout from "./Logout";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 100,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

export default function Header() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            id="simple-menu"
            anchor="top"
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <NavLink to="/order">Order</NavLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <NavLink to="/user">Customer</NavLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <NavLink to="/users">Customers</NavLink>
            </MenuItem>
          </Drawer>
          <Typography variant="h6" className={classes.title}>
            Forms
          </Typography>
          <Login />
          <Logout />
        </Toolbar>
      </AppBar>
    </div>
  );
}
