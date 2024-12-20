/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { Grid, Table, TableCell, TableRow, Typography } from "@mui/material";

const ProductsDisplayTableCell = (props) => {
  const handleIncrement = (productId) => {
    const updatedProducts = props.selectedProducts.map((product) => {
      if (product._id === productId) {
        return { ...product, count: product.count + 1 };
      }
      return product;
    });
    props.setSelectedProducts(updatedProducts);
  };

  const handleDecrement = (productId) => {
    const updatedProducts = props.selectedProducts.map((product) => {
      if (product._id === productId && product.count > 1) {
        return { ...product, count: product.count - 1 };
      }
      return product;
    });
    props.setSelectedProducts(updatedProducts);
  };

  return (
    <Grid
      sx={{
        m: 2,
        mt: 4,
        border: "1px solid #ccc",
        borderRadius: 4,
      }}
    >
      <Table size="small">
        <TableRow>
          <TableCell>
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              Nome
            </Typography>
          </TableCell>
          <TableCell align="center">
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              Quantidade
            </Typography>
          </TableCell>
          <TableCell align="right" sx={{ width: 200 }}>
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              Valor por Item
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              Total
            </Typography>
          </TableCell>
        </TableRow>
        {props.selectedProducts?.map((product, index) => (
          <TableRow key={index} sx={{ mt: 3 }}>
            <TableCell>
              <Typography sx={{ fontSize: 14 }}>{product.name}</Typography>
            </TableCell>
            <TableCell align="right">
              <Grid container direction="row" justifyContent="center">
                <Typography
                  sx={{ fontSize: 16, cursor: "pointer" }}
                  onClick={() => handleDecrement(product._id)}
                >
                  -
                </Typography>
                <Typography sx={{ fontSize: 14, mx: 2 }}>
                  {product.count}
                </Typography>
                <Typography
                  sx={{ fontSize: 16, cursor: "pointer" }}
                  onClick={() => handleIncrement(product._id)}
                >
                  +
                </Typography>
              </Grid>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontSize: 14 }}>
                R$
                {product.sellValue?.toFixed(2)}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontSize: 14 }}>
                R$
                {product.sellValue &&
                  product.sellValue * product.count.toFixed(2)}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
        {props.selectedProducts?.length > 1 && (
          <TableRow sx={{ mt: 3 }}>
            <TableCell id="ghost" />
            <TableCell id="ghost" />
            <TableCell id="ghost" />
            <TableCell align="right">
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                R$
                {props.fieldType === "productList"
                  ? props.selectedProducts
                      .reduce(
                        (sum, product) =>
                          sum + product.buyValue * product.count,
                        0
                      )
                      .toFixed(2)
                  : props.selectedProducts
                      .reduce(
                        (sum, product) =>
                          sum + product.sellValue * product.count,
                        0
                      )
                      .toFixed(2)}
              </Typography>
            </TableCell>
          </TableRow>
        )}
        {props.fieldType === "productList" && (
          <>
            <TableRow sx={{ mt: 0.5 }}>
              <TableCell id="ghost" />
              <TableCell id="ghost" />
              <TableCell id="ghost" />
              {props.servicePrice ? (
                <TableCell align="right" sx={{ width: 200 }}>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Serviço - R${props.servicePrice}
                  </Typography>
                </TableCell>
              ) : (
                <TableCell id="ghost" />
              )}
            </TableRow>
            <TableRow sx={{ mt: 0.5 }}>
              <TableCell id="ghost" />
              <TableCell id="ghost" />
              <TableCell id="ghost" />
              <TableCell align="right" sx={{ width: 200 }}>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Total R$
                  {props.selectedProducts
                    .reduce(
                      (sum, product) => sum + product.buyValue * product.count,
                      Number(props.servicePrice)
                    )
                    .toFixed(2)}
                </Typography>
              </TableCell>
            </TableRow>
          </>
        )}
      </Table>
    </Grid>
  );
};

export default ProductsDisplayTableCell;
