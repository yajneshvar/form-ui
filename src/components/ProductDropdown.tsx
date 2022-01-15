import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { DataGrid, GridCellParams, GridEditCellPropsParams, isOverflown  } from '@material-ui/data-grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Select, MenuItem, InputLabel, FormControl, Typography, Paper, Popper, IconButton } from '@material-ui/core';
import { SelectedProductQuantity, Product } from './models';
import { useFetchWithAuth } from '../hooks/fetchWithAuth';

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

const useStyles = makeStyles( (theme: Theme) => createStyles(
    {
        product: {
            justifyContent: "center"
        },
        productSelector: {
            alignItems: 'center'
        },
        padding: {
            padding: theme.spacing(2)
        },
        productList: {
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

export function ProductDropdownAndSelectedProducts(props: ProductDropdownProps) {
     
    let setProducts =  props.setProducts;
    let products = props.products;
    let onDeleteProduct = useCallback((id: string) => {
        setProducts(products.filter((item: any) => item.product.code !== id))
    },[products, setProducts]);

    let onUpdateProductQuantity = useCallback((id: string, quantity: number) => {
        let product = products.find( (it) => it.product.id === id);
        if (product !== undefined) {
            product.startCount = quantity;
            let filteredProducts = products.filter((selectedProduct) => selectedProduct.product.id !== id);
            setProducts([...filteredProducts, product ])
        }
    }, [products, setProducts])

    return (
        <>
            <ProductDropdown {...props}/>
            <SelectedProducts products={props.products} onDeleteProduct={onDeleteProduct} onUpdated={onUpdateProductQuantity}/>
        </>
    )
}
interface SelectedProductsProps {
    products: SelectedProductQuantity[],
    onDeleteProduct: (id: string) =>  void,
    onUpdated:  (id: string, quantity: number) => void
}

function SelectedProducts(props: SelectedProductsProps) {
    let productsAndQuantites: SelectedProductQuantity[]  = props.products;
    let onDeleteProduct = props.onDeleteProduct;
    let onUpdateProductQuantity = props.onUpdated;
    let renderRemovableCell = (params: GridCellParams) => {
        return (
            <IconButton onClick={(event: any) => {onDeleteProduct(params.id.toString())} }>
                 <HighlightOffIcon color="secondary"/>
            </IconButton>
        )
    }

    let columns = [ {field: "id", type: 'string'}, {field: "Title", width: 450, type: 'string', renderCell: renderCellExpand}, {field: "Quantity", width: 150, editable: true, type: 'number'}, {field: "Remove", width: 150, renderCell: renderRemovableCell}]
    let rows = productsAndQuantites.map( (bq) => {
        return {
            id: bq.product.code,
            Title: bq.product.title,
            Quantity: bq.startCount,
            Remove: bq.product.id
        }
    })
    let handleCellChange = (params: GridEditCellPropsParams, event?: any) => {
        let productId = params.id;
        if (params.field === "Quantity") {
            let value = params.props.value
            if (value) {
                onUpdateProductQuantity(productId as string, parseInt(value as string))
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

interface ProductDropdownProps {
    products: SelectedProductQuantity[],
    setProducts: (value: SelectedProductQuantity[]) => void,
    onChange: () => void,
    errors: any,
    touched: any,
}



export function ProductDropdown(props: ProductDropdownProps) {

    let products: SelectedProductQuantity[]  = props.products;
    let setProducts: (value: SelectedProductQuantity[]) => void = props.setProducts;
    let onChange: () => void = props.onChange
    let onProductsChange = useCallback((products: SelectedProductQuantity[]) => {
        setProducts(products);
        onChange();
    },[setProducts, onChange])

    let errors = props.errors;

    let url = process.env.REACT_APP_API_URL ||  "http://localhost:8080";

    let classes = useStyles();

    let [product, setProduct] = useState<Product | null>(null);
    let [quantity, setQuantity] = useState(1);
    let [filteredProductList, setFilteredProductList] = useState<Product[]>([]);
    let [productList, setProductsList] = useState<Product[]>([]);
    let [types, setTypes] = useState<string[]>([]);
    let [selectedType, setSelectedType] = useState<string>("");

    const {response, error } = useFetchWithAuth(`${url}/books/items`, {
      method: 'GET'
    });

    // if (error) {
    //   throw error
    // }

    useEffect(() => {
      if (response?.ok) {
        response.json().then( listOfProducts => {
            setProductsList(listOfProducts)
            setFilteredProductList(listOfProducts)
            let retrievedProducts = listOfProducts as Product[];
            let uniqueTypes = new Set(retrievedProducts.map(product => product.type));
            let uniqTypeList: string[] = []
            uniqueTypes.forEach ( type => uniqTypeList.push(type))
            setTypes(uniqTypeList);
        })
      }
    }, [response])

    let onTypeSelected =  (event: React.ChangeEvent<{ value: unknown }>) => {
        let newType = event.target.value as string
        setSelectedType(newType);
        setProduct(null);
        if (newType !== "") {
            setFilteredProductList(productList.filter( b => b.type === newType))
        }
      };

    let onQuantityChange = useCallback((event: any) => {
        let value: number = parseInt(event.target.value)
        setQuantity(value)
    }, [setQuantity])


    let onAddProduct = useCallback(() => {
        let itemToupdate = products.find( (items) => items.product.id === product?.id)
        if (product !== null && itemToupdate === undefined) {
            onProductsChange([...products, {product, startCount: quantity, endCount: null, netCount: null}])
        } else if (itemToupdate) {
            itemToupdate.startCount += quantity
            onProductsChange([...products])
        }
    }, [products, onProductsChange, product, quantity]);

    let onClickAdd = (event: any) => {
        event.preventDefault();
        onAddProduct();
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
                            className={classes.product}
                            options={filteredProductList as Product[]}
                            value={product}
                            onChange={(event: any, newValue: any) => {
                                setProduct(newValue);
                            }}
                            renderOption={( option: any ) => (<> 
                                    <span>{`${option.title}`}</span>
                            </> )}
                            renderInput={(params) => {
                                return (
                                    <TextField
                                        {...params}
                                        label="Choose a Product"
                                        variant="outlined"
                                    />
                                )
                            }}
                            getOptionLabel={ (option) => (`${option.title}`) }
                            getOptionSelected={ (option, value) => (
                                option.id === value.id
                            )}
                        />) :
                        (<Autocomplete
                            options={[]}
                            disabled
                            renderInput={ (params) => {
                                return (
                                    <TextField
                                        {...params}
                                        label="Please select a language filter before choosing a product"
                                        variant="outlined"
                                    />
                                )
                            }}
                        
                        />)

                    }
                    {errors.products && props.touched && (<Typography className={classes.errorMessage} variant="caption" display="block" gutterBottom>{errors.products}</Typography>)}
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        id="quantity"
                        name="quantity"
                        label="Product Quantity"
                        type="number"
                        value={quantity}
                        onChange={onQuantityChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button fullWidth variant="contained" color="secondary" onClick={onClickAdd}>Add Product</Button>
                </Grid>
        </>
    )

}