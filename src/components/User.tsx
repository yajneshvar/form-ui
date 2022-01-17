import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import { CircularProgress, SnackbarCloseReason } from '@material-ui/core';
import { AuthenticatedUser, UserContext } from '../providers/UserProvider';
import SuccesOrFailureAlert from './SuccesOrFailureAlert';
import { fetchWithAuth } from '../utils/auth';

export default function UserForm(props: UserFormProps) {

  return(
    <UserContext.Consumer>
      {(userState) => <User user={props.user} userState={userState}/>}
    </UserContext.Consumer>
  )

}

export interface Address {
  line: string,
  line2: string | undefined,
  postalCode: string,
  city: string,
  country: string | undefined,
}

export interface UserValue {
  id: string | undefined,
  firstName: string,
  lastName: string,
  address: Address,
  email: string,
  cellPhone: string,
  homePhone: string
}

interface UserFormProps {
  user: UserValue | undefined
}

interface UserProps extends UserFormProps {
  userState: AuthenticatedUser
}

function User(props: UserProps) {

  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [openNotification, setOpenNotification] = useState(false);
  const [success, setSuccess] = useState(false);

  const url = process.env.REACT_APP_API_URL ||  "http://localhost:8080";
    const intialValues = props.user || {
        id: undefined,
        firstName: '',
        lastName: '',
        address: {
            line: '',
            line2: '',
            postalCode: '',
            city: '',
            country: ''
        },
        email: '',
        cellPhone: '',
        homePhone: ''
    }

    const handleAlertClose = (event: any, reason: SnackbarCloseReason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpenNotification(false);
      setSuccess(false);
  };

    const onSubmit = (values: any) => {
      const user = {creator: props.userState?.email, ...values}
      setSubmitting(true);
      fetchWithAuth(`${url}/users`, {
        method: "POST",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }).then(response => {
        if (response.ok) {
            response.json().then(savedUser => {
              let users = []
              const storedUsers = localStorage.getItem("latestCustomer")
              if (storedUsers !== null ) {
                users = JSON.parse(storedUsers)
              }
              users.push(savedUser)
              localStorage.setItem("latestCustomer", JSON.stringify(users))
              
              setSubmitMessage("Success");
              setSuccess(true);
              setSubmitting(false);
            })
        } else {
          setSubmitMessage("Failed to submit")
          setSubmitting(false);
          setSuccess(false);
        }
        setOpenNotification(true);
      }).catch(err => {
          setSubmitMessage("Failed to submit")
          setSubmitting(false);
          setOpenNotification(true);
          setSuccess(false);
      })
    }


    const formik = useFormik({
      initialValues: intialValues,
      validationSchema : Yup.object({
              firstName: Yup.string()
              .required('First Name Reguired'),
              lastName: Yup.string().required('Last Name Required'),
              address: Yup.object({
                  line: Yup.string().required('Address Required'),
                  line2: Yup.string(),
                  postalCode: Yup.string().required("Postal Code Required"),
                  country: Yup.string()
              }),
              email: Yup.string().required('Email Required'),
              cellPhone: Yup.string(),
              homePhone: Yup.string()
          }),
      onSubmit
      });


    return (  
      <Grid container item  alignItems="center" direction="column" spacing={2} xs={12} >
        <form onSubmit = {formik.handleSubmit} >
          <Grid container direction="row" spacing={2}>
            <Grid item xs={4} >
              <TextField
              fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
            </Grid>
            <Grid item  xs={4}>
              <TextField
              fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
          </Grid>
          <Grid item xs={8}>
          <TextField
            fullWidth
            id="AddressLine1"
            name="address.line"
            label="Line"
            value={formik.values.address.line}
            onChange={formik.handleChange}
            error={formik.touched.address?.line && Boolean(formik.errors.address?.line)}
            helperText={formik.touched.address?.line && formik.errors.address?.line2}
          />
          </Grid>
          <Grid item xs={8}>
          <TextField
            fullWidth
            id="AddressLine2"
            name="address.line2"
            label="Line 2 "
            value={formik.values.address.line2}
            onChange={formik.handleChange}
            error={formik.touched.address?.line2 && Boolean(formik.errors.address?.line2)}
            helperText={formik.touched.address?.line2 && formik.errors.address?.line2}
          />
          </Grid>
          <Grid item xs={8}>
          <TextField
            fullWidth
            id="AddressLine3"
            name="address.postalCode"
            label="Postal Code "
            value={formik.values.address.postalCode}
            onChange={formik.handleChange}
            error={formik.touched.address?.postalCode && Boolean(formik.errors.address?.postalCode)}
            helperText={formik.touched.address?.postalCode && formik.errors.address?.postalCode}
          />
          </Grid>
          <Grid item xs={8}>
          <TextField
            fullWidth
            id="AddressLine4"
            name="address.city"
            label="City "
            value={formik.values.address.city}
            onChange={formik.handleChange}
            error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
            helperText={formik.touched.address?.city && formik.errors.address?.city}
          />
          </Grid>
          <Grid item xs={8}>
          <TextField
            fullWidth
            id="AddressLine5"
            name="address.country"
            label="Country"
            value={formik.values.address.country}
            onChange={formik.handleChange}
            error={formik.touched.address?.country && Boolean(formik.errors.address?.country)}
            helperText={formik.touched.address?.country && formik.errors.address?.country}
          />
          </Grid>
          <Grid xs={8}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          </Grid>

        <Grid item xs={8}>
        <TextField
            fullWidth
            id="cellPhone"
            name="cellPhone"
            label="Mobile Phone"
            value={formik.values.cellPhone}
            onChange={formik.handleChange}
            error={formik.touched.cellPhone && Boolean(formik.errors.cellPhone)}
            helperText={formik.touched.cellPhone && formik.errors.cellPhone} 
          />
        </Grid>
        <Grid item xs={6}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
        </Grid>
        <Grid container item xs={12} justify="center" >
          {submitting && (<CircularProgress />)}
        </Grid>
        <Grid item xs={12}>
          <SuccesOrFailureAlert 
            success={success}
            open={openNotification}
            message={submitMessage}
            onClose={handleAlertClose}
          />
        </Grid>
      </form>
      </Grid>
      

    )

}