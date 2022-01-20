import React, { useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router";
import { UserContext, AuthenticatedUser } from "../providers/UserProvider";
import { googleSignIn } from "../login/Firebase";

export default function Login() {
  return (
    <UserContext.Consumer>
      {(userState) => <LoginButton user={userState} />}
    </UserContext.Consumer>
  );
}

interface LoginProps {
  user: AuthenticatedUser;
}

function LoginButton({ user }: LoginProps) {
  const login = (event: any) => {
    event?.preventDefault();
    googleSignIn();
  };

  if (user == null) {
    return <Button
      variant="contained"
      color="secondary"
      onClick={login}
      disableElevation
    >
      Sign In With Google
    </Button>;
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

const useStyles = makeStyles({
  body: {
    marginTop: "20px",
  },
  loginPage: {},
});

export function LoginPage() {
  const classes = useStyles();
  return (
    <div>
      <Grid container className={classes.body} justify="center">
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography>Please login to proceed</Typography>
              <Login />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
