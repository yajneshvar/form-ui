import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React from "react";

export default function SuccessOrFailureAlert(props: any) {
  return (
    <Snackbar open={props.open} autoHideDuration={3000} onClose={props.onClose}>
      <Alert
        severity={props.success ? "success" : "error"}
        onClose={props.onClose}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}
