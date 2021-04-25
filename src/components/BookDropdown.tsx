import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Select, MenuItem, InputLabel, FormControl, Typography, Paper, Chip } from '@material-ui/core';

interface BookType {
    code: string,
    title: string,
    type: string
}

interface SelectedBookQuantityType {
    book: BookType,
    quantity: number
}

const useStyles = makeStyles( (theme: Theme) => createStyles(
    {
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

export function BookDropdown(props: any) {

    let books: SelectedBookQuantityType[]  = props.books;
    let setBooks: (value: SelectedBookQuantityType[]) => void = props.setBooks;
    let onChange: () => void = props.onChange
    let onBooksChange = useCallback((books: SelectedBookQuantityType[]) => {
        setBooks(books);
        onChange();
    },[setBooks, onChange])

    let errors = props.errors;

    let url = process.env.REACT_APP_API_URL ||  "http://localhost:8080";

    let classes = useStyles();

    let [book, setBook] = useState<BookType | null>(null);
    let [quantity, setQuantity] = useState(1);
   // let [books, setBooks] = useState<SelectedBookQuantityType[]>([]);
    let [filteredBookList, setFilteredBookList] = useState<BookType[]>([]);
    let [bookList, setBooksList] = useState<BookType[]>([]);
    let [types, setTypes] = useState<string[]>([]);
    let [selectedType, setSelectedType] = useState<string>("");

    useEffect(() => {
        fetch(`${url}/books`, {
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
    }, [url])

    let onTypeSelected =  (event: React.ChangeEvent<{ value: unknown }>) => {
        let newType = event.target.value as string
        setSelectedType(newType);
        setBook(null);
        if (newType !== "") {
            setFilteredBookList(bookList.filter( b => b.type === newType))
        }
      };

    let onQuantityChange = useCallback((event: any) => {
        let value: number = parseInt(event.target.value)
        setQuantity(value)
    }, [setQuantity])


    let onAddBook = useCallback(() => {
        // errorDispatch({type: 'books'})
        let itemToupdate = books.find( (items) => items.book.code === book?.code)
        if (book !== null && itemToupdate === undefined) {
            onBooksChange([...books, {book, quantity}])
        } else if (itemToupdate) {
            itemToupdate.quantity += quantity
            onBooksChange([...books])
        }
    }, [books, onBooksChange, book, quantity]);

    let onClickAdd = (event: any) => {
        event.preventDefault();
        onAddBook();
    }

    let onDeleteBook = (event: any) =>  () => {
        setBooks(books.filter((item: any) => item.book.code !== event.book.code))
    }

    return (

        <>
                <Grid item xs={12} md={6}>
                    <FormControl variant="outlined" className={classes.formControl} fullWidth >
                        <InputLabel htmlFor="language-select">Language</InputLabel>
                        <Select value={selectedType} onChange={onTypeSelected} id="language-select" fullWidth={true}>
                            { types.map( type =>  (<MenuItem value={type}>{type}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
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
                    {errors.books && (<Typography className={classes.errorMessage} variant="caption" display="block" gutterBottom>{errors.books}</Typography>)}
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        id="quantity"
                        name="quantity"
                        label="Book Quantity"
                        type="number"
                        value={quantity}
                        onChange={onQuantityChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button fullWidth variant="contained" color="secondary" onClick={onClickAdd}>Add Book</Button>
                </Grid>
                <Grid item xs={12} md={12}>
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
        </>
    )

}