import React, { Reducer, useCallback, useEffect, useReducer, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {  Select, MenuItem, InputLabel, FormControl, FormControlLabel, Checkbox, Typography, CircularProgress, TextareaAutosize, Snackbar, SnackbarCloseReason } from '@material-ui/core';
import { UserContext, UserStateType } from '../providers/UserProvider';
import { DispatchAction } from './models';
import { BookDropdown } from './BookDropdown';
import SuccessOrFailureAlert from './SuccesOrFailureAlert';


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
            {(userState) => <Order userState={userState}></Order>}
        </UserContext.Consumer>
    )
}

export function Order(props: any) {

    let userState: UserStateType = props.userState

    let url = process.env.REACT_APP_API_URL ||  "http://localhost:8080";

    interface CustomerType {
        id: String,
        firstName: string,
        lastName: string,
        postalCode: string,
        email: string
      }

    interface BookType {
        code: string,
        title: string,
        type: string
    }

    interface SelectedBookQuantityType {
        book: BookType,
        quantity: number
    }

    let errorInitialState = {
        customer: null,
        books: null,
        channel: null
    }

    interface ErrorMessage {
        customer: string | null,
        books: string | null,
        channel: string | null
    }

    let errorReducer = (state: ErrorMessage, action: DispatchAction) => {
        switch(action.type) {
            case 'customerError':
                return {...state, customer: "Please select a customer"};
            case 'booksError':
                return {...state, books: "Please add a book"};
            case 'channelError': 
                return {...state, channel: "Please select a channel"};
            case 'customer':
                return {...state, customer: null};
            case 'books':
                return {...state, books: null};
            case 'channel': 
                return {...state, channel: null};
            default:
                throw new Error();
        }
    }

    let [books, setBooks] = useState<SelectedBookQuantityType[]>([]);
    let [customer, setCustomer] = useState<CustomerType | null>( null);
    let [customers, setCustomers] = useState<CustomerType[]>([]);
    let [delivery, setDelivery] = useState(false);
    let [channels, setChannels] = useState<string[]>([]);
    let [channel, setChannel] = useState("");
    let [additionalNotes, setAdditionaltNotes] = useState("")
    let [deliveryNotes, setDeliveryNotes] = useState("")
    let [errors, errorDispatch] = useReducer<Reducer<ErrorMessage, DispatchAction>, ErrorMessage>(errorReducer, errorInitialState, (d) => d)
    let [submitting, setSubmitting] = useState(false)
    let [open, setOpen] = useState(false)
    let [submitMessage, setSubmitMessage] = useState("")
    let [success, setSuccess] = useState(false)

    let storageEventHandler = useCallback((event: StorageEvent) => {
        let newCustomers: CustomerType[] = []
        if (event.key === "latestCustomer" && event.newValue !== null) {
            newCustomers = JSON.parse(event.newValue) as CustomerType[]
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

    useEffect(() => {
        fetch(`${url}/users`, {
            method: 'GET'
        }).then( (response) => {
            if (response.ok) {
                response.json().then( users => setCustomers(users))
            }
        }).catch(err => {
            alert("Failed to fetch customers")
        })
    }, [url])

    useEffect(() => {
        fetch(`${url}/channels`, {
            method: "GET"
        }).then( (response) => {
            if (response.ok) {
                response.json().then( channelList => setChannels(channelList))
            }
        }).catch( err => {
            alert("Failed to fetch channels")
        })
    },[url])

    let onChannelSelected = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
        errorDispatch({type: 'channel'});
        let channelSelection = event.target.value as string
        setChannel(channelSelection);
      },[]);


    let onDeliverySelected = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setDelivery(del => !del);
    }

    let onPaymentNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAdditionaltNotes(event.target.value);
      };

    let onDeliveryNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDeliveryNotes(event.target.value);
      };

    let onCustomerChange = useCallback((event: any, newValue: any) => {
        errorDispatch({type: 'customer'})
        setCustomer(newValue);
    },[])

    const handleAlertClose = (event: any, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };

    let classes = useStyles();

    let onFormSubmit = useCallback((event: any) => {
        event.preventDefault();
        let values = {
            customerId: customer?.id,
            books: books.map( b => {return {...b.book, quantity: b.quantity}}),
            channel,
            delivery,
            deliveryNotes,
            paymentNotes: additionalNotes,
            creator: userState?.user?.email
        };
        let valid = true;

        if (values.customerId === undefined) {
            errorDispatch({type: 'customerError'})
            valid = false;
        }

        if (values.channel === undefined || values.channel === null || values.channel === "") {
            errorDispatch({type: 'channelError'})
            valid = false;
        }

        if (values.books.length === 0) {
            errorDispatch({type: 'booksError'})
            valid = false;
        }

        if (!valid) {
            return;
        }

        setSubmitting(true)
        
        fetch(`${url}/order`, {
            method: "POST",
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values)
        }).then( response => {
            setOpen(true)
            setSuccess(response.ok)
            if (response.ok) {
                setSubmitMessage("Success")
            } else {
                setSubmitMessage("Failed to submit order")
            }
            setSubmitting(false)
        }).catch( err => {
            setOpen(true)
            setSuccess(false)
            setSubmitMessage("Failed to submit order")
            setSubmitting(false)
        })
    },[ errorDispatch, books, channel, customer, delivery, deliveryNotes, additionalNotes, url, userState])

    return (  
            <Grid container xs={12} md={12} lg={12} alignItems="baseline" justify="center">
                <form className={classes.form} >
                <Grid container xs={12} md={12} lg={12} alignItems="baseline" spacing={2}>
                <Grid item xs={12} md={12} lg={12} >
                    <Autocomplete
                        options={customers as CustomerType[]}
                        value={customer}
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
                    {errors.customer && (<Typography className={classes.errorMessage} variant="caption" display="block" gutterBottom>{errors.customer}</Typography>)}
                </Grid>
                <BookDropdown
                    onChange = {() => { errorDispatch({type: 'books'}) }}
                    books = {books}
                    setBooks = {setBooks}
                    errors = {{
                        books: errors.books
                    }}
                />
                <Grid item xs={12} md={6} className={classes.padding} >
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="channel-select">Channel</InputLabel>
                        <Select value={channel} onChange={onChannelSelected} id="channel-select">
                            {channels.map( ch => (<MenuItem value={ch}>{ch}</MenuItem>))}
                        </Select>
                    </FormControl>
                    {errors.channel && (<Typography className={classes.errorMessage} variant="caption" display="block" gutterBottom>{errors.channel}</Typography>)}
                </Grid>

                <Grid item xs={6} className={classes.padding} >
                    <FormControlLabel
                        control={<Checkbox checked={delivery} onChange={onDeliverySelected}></Checkbox>}
                        label="Delivery Required"
                    ></FormControlLabel>
                                    { delivery && 
                        <TextareaAutosize value={deliveryNotes} onChange={onDeliveryNotesChange} id="delivery-notes" rowsMin={3} placeholder="Delivery Notes"></TextareaAutosize>
                    }

                </Grid>

                <Grid item xs={12} md={6} className={classes.padding} alignItems="flex-start">
                    <TextareaAutosize aria-label="additonal-notes" value={additionalNotes} onChange={onPaymentNotesChange} rowsMin={3} placeholder="Additional Notes"/>       
                </Grid>

            <Grid item xs={6} className={classes.padding}>
                <Button variant="contained" color="primary" type="submit" onClick={onFormSubmit}>
                    Submit
                </Button>
            </Grid>
            <Grid container item xs={6} md={12} justify="center" spacing={2}>
                {submitting && (<CircularProgress></CircularProgress>)}
            </Grid>
            <Grid item xs={12}>
                <SuccessOrFailureAlert
                    open={open}
                    onClose={handleAlertClose}
                    success={success}
                    message={submitMessage}
                />
            </Grid>
            </Grid>
        </form>
        </Grid>

    )

}