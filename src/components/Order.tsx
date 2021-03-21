import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Chip, Link, Paper, Typography, Select, MenuItem, Menu, InputLabel, FormControl, FormControlLabel, Checkbox } from '@material-ui/core';
import { UserContext, UserStateType } from '../providers/UserProvider';

const useStyles = makeStyles( (theme: Theme) => createStyles(
    {
        root: {
            width: '100%',
            listStyle: 'none'
        },
        paper: {
            padding: theme.spacing(4)
        },
        form: {      
            width: 'inherit',
        },
        customer: {
            width: 'inherit',
            justifyContent: "center",
            padding: theme.spacing(2)
        },
        book: {
            width: 'inherit',
            justifyContent: "center",
            padding: theme.spacing(2)
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
            padding: theme.spacing(0.5),
            margin: 0,
          },
        formControl: {
            minWidth: 120
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

    let [customer, setCustomer] = useState<CustomerType | null>( null);
    let [customers, setCustomers] = useState<CustomerType[]>([]);
    let [book, setBook] = useState<BookType | null>(null);
    let [quantity, setQuantity] = useState(1);
    let [delivery, setDelivery] = useState(true);
    let [books, setBooks] = useState<SelectedBookQuantityType[]>([]);
    let [filteredBookList, setFilteredBookList] = useState<BookType[]>([]);
    let [bookList, setBooksList] = useState<BookType[]>([]);
    let [types, setTypes] = useState<string[]>([]);
    let [selectedType, setSelectedType] = useState<string>("");
    let [channels, setChannels] = useState<string[]>([]);
    let [channel, setChannel] = useState("");
    let [paymentNotes, setPaymentNotes] = useState("")
    let [deliveryNotes, setDeliveryNotes] = useState("")

    let intialValues = {
        customerId: '',
        books: []
    }

    let storageEventHandler = useCallback((event: StorageEvent) => {
        let newCustomers: CustomerType[] = []
        if (event.key == "latestCustomer" && event.newValue != null) {
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
        fetch('http://localhost:8080/users', {
            method: 'GET'
        }).then( (response) => {
            if (response.ok) {
                response.json().then( users => setCustomers(users))
            }
        }).catch(err => {
            alert("Failed to fetch customers")
        })
    }, [])

    useEffect(() => {
        fetch('http://localhost:8080/books', {
            method: 'GET'
        }).then( (response) => {
            if (response.ok) {
                response.json().then( listOfBooks => {
                    setBooksList(listOfBooks)
                    setFilteredBookList(listOfBooks)
                    let retrievedBooks = listOfBooks as BookType[];
                    let uniqueTypes = new Set(retrievedBooks.map(book => book.type));
                    let uniqTypeList: string[] = []
                    uniqueTypes.forEach ( type => uniqTypeList.push(type))
                    setTypes(uniqTypeList);
                })
            }
        })
    }, [])

    useEffect(() => {
        fetch('http://localhost:8080/channels', {
            method: "GET"
        }).then( (response) => {
            if (response.ok) {
                response.json().then( channelList => setChannels(channelList))
            }
        }).catch( err => {
            alert("Failed to fetch channels")
        })
    },[])

    let onTypeSelected =  (event: React.ChangeEvent<{ value: unknown }>) => {
        let newType = event.target.value as string
        setSelectedType(newType);
        if (newType !== "") {
            setFilteredBookList(bookList.filter( b => b.type == newType))
        }
        
      };

    let onChannelSelected = (event: React.ChangeEvent<{ value: unknown }>) => {
        let channelSelection = event.target.value as string
        setChannel(channelSelection);
      };

    let getTypes = useCallback( () => {
        let uniqueTypes = new Set(bookList.map(book => book.type));
        let uniqTypeList: string[] = []
        uniqueTypes.forEach ( type => uniqTypeList.push(type))
        setTypes(uniqTypeList);
    }, [bookList])

    let onDeliverySelected = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setDelivery(del => !del);
    }

    let onQuantityChange = useCallback((event: any) => {
        let value = event.target.value
        setQuantity(value)
    }, [setQuantity])

    // let onSubmit = (event:any) => {
    //     event.preventDefault()
    //     setTimeout(() => {
    //         alert(JSON.stringify({
    //             books
    //         }, null, 2));
    //       }, 400);
    // }

    let onAddBook = useCallback(() => {
        let itemToupdate = books.find( (items) => items.book.code === book?.code)
        if (book !== null && itemToupdate === undefined) {
            setBooks([...books, {book, quantity}])
        } else if (itemToupdate) {
            itemToupdate.quantity += quantity
            setBooks([...books])
        }
    }, [books, setBooks, book, quantity]);

    let onClickAdd = (event: any) => {
        event.preventDefault();
        onAddBook();
    }

    let onDeleteBook = (event: any) =>  () => {
        setBooks(books.filter((item: any) => item.book.code !== event.book.code))
    }

    let onPaymentNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentNotes(event.target.value);
      };

    let onDeliveryNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDeliveryNotes(event.target.value);
      };

    let getFormValue = useCallback(() => {
        return {
            customerId: customer?.id,
            books: books.map( b => {return {...b.book, quantity: b.quantity}}),
            channel,
            delivery,
            deliveryNotes,
            paymentNotes,
            creator: userState?.user?.email
        }
    }, [books, channel, customer, delivery, deliveryNotes, paymentNotes, quantity])

    let classes = useStyles();

    let onFormSubmit = (event: any) => {
        event.preventDefault();
        fetch("http://localhost:8080/order", {
            method: "POST",
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(getFormValue())
        }).then( response => {
            if (response.ok) {
                alert("Success")
            } else {
                alert("Failed")
            }
        }).catch( err => {
            alert("Failed to submit order")
        })
    }

    return (  
        <>
            <Typography variant="h1" component="h2" gutterBottom> New Orders Form</Typography>
            <form className={classes.form} >
            <Grid className={classes.root} alignItems="center" justify="space-around" spacing={2}>
            <Grid item xs={12} md={6} justify="space-around">
                        <Autocomplete
                            className={classes.customer}
                            options={customers as CustomerType[]}
                            value={customer}
                            onChange={(event: any, newValue: any) => {
                                setCustomer(newValue);
                            }}
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
                
                </Grid>

                <Grid container item xs={12} md={12} direction="row" spacing={2} className={classes.bookSelector} justify="space-around">
                    <Grid item xs={2} className={classes.padding}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="language-select">Language</InputLabel>
                            <Select value={selectedType} onChange={onTypeSelected} id="language-select" fullWidth={true}>
                                { types.map( type =>  (<MenuItem value={type}>{type}</MenuItem>))}
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            className={classes.book}
                            options={filteredBookList as BookType[]}
                            value={book}
                            onChange={(event: any, newValue: any) => {
                                setBook(newValue);
                            }}
                            renderOption={( option: any ) => (<> 
                                    <span>{`${option.title}`}</span>
                            </> )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Choose a Book"
                                    variant="outlined"
                                />
                            )}
                            getOptionLabel={ (option) => (`${option.title}`) }
                            getOptionSelected={ (option, value) => (
                                option.code === value.code
                            )}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            fullWidth
                            id="quantity"
                            name="quantity"
                            label="Book Quantity"
                            type="number"
                            value={quantity}
                            onChange={onQuantityChange}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="secondary" onClick={onClickAdd}>Add</Button>
                    </Grid>
                    <Grid item xs={12}>
                        {books.length > 0 && 
                                <Paper variant="outlined" className={classes.bookList}>
                                {books.map((data: any) => {
                                    return(
                                        <li key={data.book.code}>
                                            <Chip
                                                label={`${data.book.title} - ${data.quantity}`}
                                                onDelete={onDeleteBook(data)}
                                                className={classes.padding}
                                            ></Chip>
                                        </li>
                                    )
                                })}
                            </Paper>
                        
                        }

                    </Grid>
                </Grid>

            </Grid>

            <Grid item xs={2} className={classes.padding} >
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="channel-select">Channel</InputLabel>
                    <Select value={channel} onChange={onChannelSelected} id="channel-select">
                        {channels.map( ch => (<MenuItem value={ch}>{ch}</MenuItem>))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item className={classes.padding}>
                <FormControlLabel
                    control={<Checkbox checked={delivery} onChange={onDeliverySelected}></Checkbox>}
                    label="Delivery Required"
                ></FormControlLabel>
                { delivery && 
                    <TextField value={deliveryNotes} onChange={onDeliveryNotesChange} id="delivery-notes" placeholder="Delivery Notes"></TextField>
                }
            </Grid>

            <Grid item className={classes.padding}>
                <TextField  value={paymentNotes} onChange={onPaymentNotesChange}  id="payment-notes" placeholder="Payment Notes"></TextField>
                      
            </Grid>


            
          <Grid item className={classes.padding}>
            <Button variant="contained" color="primary" type="submit" onClick={onFormSubmit}>
              Submit
            </Button>
          </Grid>
      </form>

        </>

    )

}