import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {  Select, MenuItem, InputLabel, FormControl, FormControlLabel, Checkbox, Typography, CircularProgress, TextareaAutosize, SnackbarCloseReason } from '@material-ui/core';
import { UserContext, AuthenticatedUser } from '../providers/UserProvider';
import { Customer, Order, SelectedBookQuantity, SelectedProductQuantity } from './models';
import { ProductDropdownAndSelectedProducts } from './ProductDropdown';
import SuccessOrFailureAlert from './SuccesOrFailureAlert';
import { FormikProps, withFormik } from 'formik';
import { string, object, number, array, boolean } from 'yup';
import { fetchWithAuth } from '../utils/auth';
import { useFetchWithAuth } from '../hooks/fetchWithAuth';


const useStyles = makeStyles( (theme: Theme) => createStyles(
    {
        paper: {
            padding: theme.spacing(4)
        },
        form: {      
            width: 'inherit',
        },
        customer: {
            padding: theme.spacing(2)
        },
        book: {
            justifyContent: "center"
        },
        bookSelector: {
            alignItems: 'center'
        },
        padding: {
            padding: theme.spacing(2)
        },
        bookList: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            listStyle: 'none',
            margin: 0,
          },
        formControl: {
            minWidth: 120
        },
        errorMessage: {
            color: theme.palette.error.main
        }
    }
)
)



export default function OrderForm() {

    return (
        <UserContext.Consumer>
            {(userState) => <EnchancedOrder userState={userState} order={null}></EnchancedOrder>}
        </UserContext.Consumer>
    )
}

const url = process.env.REACT_APP_API_URL ||  "http://localhost:8080";

interface EnhancedOrderProps {
    order: Order | null,
    userState: AuthenticatedUser
}
interface OrderProps {
    order: Order | null,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    success: boolean,
    message: string,
    userState: AuthenticatedUser
}

function EnchancedOrder(orderProps: EnhancedOrderProps) {
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState("")
    let [success, setSuccess] = useState(false)

    const productSchema = object({
        id: string().required(),
        title: string().required(),
        type: string().required(),
    });

    const EnhancedOrder = withFormik<OrderProps,Order>({
        mapPropsToValues: (props) => {
            const initialValues : Order = {
                products: [],
                customer: null,
                delivery: false,
                channel: "",
                additionalNotes: "",
                deliveryNotes: "",
                creator: null
            }
            return initialValues || props.order;
        },
        validateOnChange: false,
        validationSchema: object({
            products: array().of(object({
                product: productSchema,
                startCount: number().required(),
                endCount: number().nullable(),
                netCount: number().nullable(),
            })).min(1).max(25).required(),
            customer: object({
                id: string().required(),
                firstName: string().required(),
                lastName: string().required(),
                postalCode: string().required(),
                email: string().required(),
            }),
            delivery: boolean().required(),
            channel: string().required(),
            additionalNotes: string().default(""),
            deliveryNotes: string().default(""),
        }),
        handleSubmit: (values) => {
            const products = values.products.map((productQuantity) => { return {...productQuantity.product, startCount: productQuantity.startCount } });
            const { customer, ...rest} = values;
            fetchWithAuth(`${url}/orders`,{
                method: "POST",
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({...rest, products, recepient: {customerId: values.customer?.id}, creator: orderProps.userState?.email})
            }).then( response => {
                setOpen(true)
                setSuccess(response.ok)
                if (response.ok) {
                    setMessage("Success")
                } else {
                    setMessage("Failed to submit order")
                }
            }).catch( err => {
                setOpen(true)
                setSuccess(false)
                setMessage("Failed to submit order")
            })
        } 
    }) (OrderComponent)

    return (
        <EnhancedOrder {...{...orderProps, success, open, setOpen, message }}></EnhancedOrder>
    )
}

export function OrderComponent(props: OrderProps & FormikProps<Order>) {

    let {
        errors,
        touched,
        values,
        setFieldValue,
        handleSubmit,
        isSubmitting,
        message,
        open,
        setOpen,
        success,
    } = props

    let [customers, setCustomers] = useState<Customer[]>([]);
    let [channels, setChannels] = useState<string[]>([]);

    let storageEventHandler = useCallback((event: StorageEvent) => {
        let newCustomers: Customer[] = []
        if (event.key === "latestCustomer" && event.newValue !== null) {
            newCustomers = JSON.parse(event.newValue) as Customer[]
        }
        setCustomers([...newCustomers, ...customers])
    },[customers])

    useEffect(() => {
        window.addEventListener("storage", storageEventHandler)
        return () => {
            window.removeEventListener("storage", storageEventHandler)
        }
    });

    useEffect(() => {
        localStorage.removeItem("latestCustomer")
    }, []);

    const {response: userPayload, error: userError} = useFetchWithAuth(`${url}/users`, {
        method: 'GET'
    })

    useEffect(() => {
        if (userError) {
            alert("Failed to fetch customers")
        }

        if (userPayload?.ok) {
            userPayload.json().then( users => setCustomers(users))
        }
    }, [userPayload, userError])

    const {response: channelPayload, error: channelError} = useFetchWithAuth(`${url}/channels`, {
        method: "GET"
    })

    useEffect(() => {
        if (channelError) {
            alert("Failed to fetch channels")
        }

        if (channelPayload?.ok) {
            channelPayload.json().then( channelList => setChannels(channelList))
        }
    },[channelPayload, channelError])

    let onChannelSelected = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
        let channelSelection = event.target.value as string
        setFieldValue("channel", channelSelection);
      },[setFieldValue]);


    let onDeliverySelected = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setFieldValue("delivery", checked);
    }

    let onPaymentNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFieldValue("additionalNotes", event.target.value);
      };

    let onDeliveryNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFieldValue("deliveryNotes", event.target.value);
      };

    let onCustomerChange = useCallback((event: any, newValue: any) => {
        setFieldValue("customer", newValue)
    },[setFieldValue])

    let onProductsChange = useCallback((productsAndQuantity: SelectedProductQuantity[]) => {
        setFieldValue("products",productsAndQuantity);
    },[setFieldValue])

    const handleAlertClose = (event: any, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
          return;
        }

        setOpen(false);
    };

    let classes = useStyles();

    let submit = useCallback((event: any) => {
        event.preventDefault();
        handleSubmit()
    }, [handleSubmit])

    return (  
            <Grid container xs={12} md={12} lg={12} alignItems="baseline" justify="center">
                <form className={classes.form} >
                <Grid container xs={12} md={12} lg={12} alignItems="baseline" spacing={2}>
                <Grid item xs={12} md={12} lg={12} >
                    <Autocomplete
                        options={customers as Customer[]}
                        value={values.customer}
                        onChange={onCustomerChange}
                        renderOption={( option: any ) => (<> 
                                <span>{`${option.firstName} - ${option.postalCode}`}</span>
                        </> )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Choose a Customer"
                                variant="outlined"
                            />
                        )}
                        getOptionLabel={ (option) => (option.firstName) }
                        getOptionSelected={ (option, value) => (
                            option.firstName === value.firstName &&
                            option.email === value.email
                        )}
                    />
                    {errors.customer && touched.customer && (<Typography className={classes.errorMessage} variant="caption" display="block" gutterBottom>{errors.customer}</Typography>)}
                </Grid>
                <ProductDropdownAndSelectedProducts 
                    onChange = {() => {}}
                    products = {values.products}
                    setProducts = {onProductsChange}
                    errors = {errors}
                    touched = {touched.products}
                />
                <Grid item xs={12} md={6} className={classes.padding} >
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="channel-select">Channel</InputLabel>
                        <Select value={values.channel} onChange={onChannelSelected} id="channel-select">
                            {channels.map( ch => (<MenuItem value={ch}>{ch}</MenuItem>))}
                        </Select>
                    </FormControl>
                    {errors.channel && touched.channel && (<Typography className={classes.errorMessage} variant="caption" display="block" gutterBottom>{errors.channel}</Typography>)}
                </Grid>

                <Grid item xs={6} className={classes.padding} >
                    <FormControlLabel
                        control={<Checkbox checked={values.delivery} onChange={onDeliverySelected}></Checkbox>}
                        label="Delivery Required"
                    ></FormControlLabel>
                                    { values.delivery && 
                        <TextareaAutosize value={values.deliveryNotes} onChange={onDeliveryNotesChange} id="delivery-notes" rowsMin={3} placeholder="Delivery Notes"></TextareaAutosize>
                    }

                </Grid>

                <Grid item xs={12} md={6} className={classes.padding} alignItems="flex-start">
                    <TextareaAutosize aria-label="additonal-notes" value={values.additionalNotes} onChange={onPaymentNotesChange} rowsMin={3} placeholder="Additional Notes"/>       
                </Grid>

            <Grid item xs={6} className={classes.padding}>
                <Button variant="contained" color="primary" type="submit" onClick={submit}>
                    Submit
                </Button>
            </Grid>
            <Grid container item xs={6} md={12} justify="center" spacing={2}>
                {isSubmitting && (<CircularProgress></CircularProgress>)}
            </Grid>
            <Grid item xs={12}>
                <SuccessOrFailureAlert
                    open={open}
                    onClose={handleAlertClose}
                    success={success}
                    message={message}
                />
            </Grid>
            </Grid>
        </form>
        </Grid>

    )

}