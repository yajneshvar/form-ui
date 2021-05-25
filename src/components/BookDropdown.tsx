import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { DataGrid, GridCellParams, GridEditCellPropsParams, GridColDef, isOverflown  } from '@material-ui/data-grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Select, MenuItem, InputLabel, FormControl, Typography, Paper, Chip, Popper, IconButton, List } from '@material-ui/core';

interface GridCellExpandProps {
  value: string;
  width: number;
}

const useStylesCell = makeStyles(() =>
  createStyles({
    root: {
      alignItems: 'center',
      lineHeight: '24px',
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      '& .cellValue': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
  }),
);

const GridCellExpand = React.memo(function GridCellExpand(
  props: GridCellExpandProps,
) {
  const { width, value } = props;
  const wrapper = React.useRef<HTMLDivElement | null>(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const classes = useStylesCell();
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current!);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent: KeyboardEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <div
      className={classes.root}
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cellDiv}
        style={{
          height: 1,
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <div ref={cellValue} className="cellValue">
        {value}
      </div>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current!.offsetHeight - 3 }}
          >
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </div>
  );
});

function renderCellExpand(params: GridCellParams) {
  return (
    <GridCellExpand
      value={params.value ? params.value.toString() : ''}
      width={params.colDef.width}
    />
  );
}


export interface BookType {
    code: string,
    title: string,
    type: string
}

export interface SelectedBookQuantityType {
    book: BookType,
    quantity: number,
    issued: number | null,
    sold: number | null
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

export function BookDropdownAndSelectedBooks(props: BookDropdownProps) {
     
    let setBooks =  props.setBooks;
    let books = props.books;
    let onDeleteBook = useCallback((code: string) => {
        setBooks(books.filter((item: any) => item.book.code !== code))
    },[books, setBooks]);

    let onUpdateBookQuantity = useCallback((code: string, quantity: number) => {
        let book = books.find( (it) => it.book.code == code);
        if (book !== undefined) {
            book.quantity = quantity;
            let filteredBooks = books.filter((bq) => bq.book.code !== code);
            setBooks([...filteredBooks, book ])
        }
    }, [books, setBooks])

    return (
        <>
            <BookDropdown {...props}/>
            <SelectedBooks books={props.books} onDeleteBook={onDeleteBook} onUpdated={onUpdateBookQuantity}/>
        </>
    )
}
interface SelectedBooksProps {
    books: SelectedBookQuantityType[],
    onDeleteBook: (code: string) =>  void,
    onUpdated:  (code: string, quantity: number) => void
}

function SelectedBooks(props: SelectedBooksProps) {
    let booksAndQuantites: SelectedBookQuantityType[]  = props.books;
    let onDeleteBook = props.onDeleteBook;
    let onUpdateBookQuantity = props.onUpdated;
    let renderRemovableCell = (params: GridCellParams) => {

        return (
            <IconButton onClick={(event: any) => {onDeleteBook(params.id.toString())} }>
                 <HighlightOffIcon color="secondary"/>
            </IconButton>
            
        )
    }

    let columns = [ {field: "id", type: 'string'}, {field: "Title", width: 450, type: 'string', renderCell: renderCellExpand}, {field: "Quantity", width: 150, editable: true, type: 'number'}, {field: "Remove", width: 150, renderCell: renderRemovableCell}]
    let rows = booksAndQuantites.map( (bq) => {
        return {
            id: bq.book.code,
            Title: bq.book.title,
            Quantity: bq.quantity,
            Remove: bq.book.code
        }
    })
    let handleCellChange = (params: GridEditCellPropsParams, event?: any) => {
        let bookId = params.id;
        if (params.field === "Quantity") {
            let value = params.props.value
            if (value) {
                onUpdateBookQuantity(bookId as string, parseInt(value as string))
            }
        }
    }
    
    return (
            <div style={{ height: 250, width: '100%' }}>
                <DataGrid 
                    columns={columns}
                    rows={rows}
                    onEditCellChangeCommitted={handleCellChange}
                    pageSize={10}
                />
            </div>
    )
}

interface BookError {
    books: string | null
}

interface BookDropdownProps {
    books: SelectedBookQuantityType[],
    setBooks: (value: SelectedBookQuantityType[]) => void,
    onChange: () => void,
    errors: BookError
}



export function BookDropdown(props: BookDropdownProps) {

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
        let itemToupdate = books.find( (items) => items.book.code === book?.code)
        if (book !== null && itemToupdate === undefined) {
            onBooksChange([...books, {book, quantity, issued: null, sold: null}])
        } else if (itemToupdate) {
            itemToupdate.quantity += quantity
            onBooksChange([...books])
        }
    }, [books, onBooksChange, book, quantity]);

    let onClickAdd = (event: any) => {
        event.preventDefault();
        onAddBook();
    }

    return (

        <>
                <Grid item xs={12} md={6}>
                    <FormControl variant="outlined" className={classes.formControl} fullWidth >
                        <InputLabel htmlFor="language-select">Language</InputLabel>
                        <Select value={selectedType} onChange={onTypeSelected} id="language-select" fullWidth={true}>
                            { types.map( type =>  (<MenuItem key={type} value={type}>{type}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    {
                        selectedType ? 
                        (<Autocomplete
                            className={classes.book}
                            options={filteredBookList as BookType[]}
                            value={book}
                            onChange={(event: any, newValue: any) => {
                                setBook(newValue);
                            }}
                            renderOption={( option: any ) => (<> 
                                    <span>{`${option.title}`}</span>
                            </> )}
                            renderInput={(params) => {
                                return (
                                    <TextField
                                        {...params}
                                        label="Choose a Book"
                                        variant="outlined"
                                    />
                                )
                            }}
                            getOptionLabel={ (option) => (`${option.title}`) }
                            getOptionSelected={ (option, value) => (
                                option.code === value.code
                            )}
                        />) :
                        (<Autocomplete
                            options={[]}
                            disabled
                            renderInput={ (params) => {
                                return (
                                    <TextField
                                        {...params}
                                        label="Please select a language filter before choosing a book"
                                        variant="outlined"
                                    />
                                )
                            }}
                        
                        />)

                    }
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
        </>
    )

}