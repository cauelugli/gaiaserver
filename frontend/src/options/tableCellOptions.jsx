/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import {
  Checkbox,
  Grid,
  InputLabel,
  Table,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import ColorPicker from "../components/small/ColorPicker";
import CurrencyTableCell from "../components/tableCells/CurrencyTableCell";
import DateTableCell from "../components/tableCells/DateTableCell";
import DynamicDataTableCell from "../components/tableCells/DynamicDataTableCell";
import IdDocTableCell from "../components/tableCells/IdDocTableCell";
import PhoneTableCell from "../components/tableCells/PhoneTableCell";
import ProductsTableCell from "../components/tableCells/ProductsTableCell";
import ManagerSelectTableCell from "../components/tableCells/ManagerSelectTableCell";
import MembersTableCell from "../components/tableCells/MembersTableCell";
import SelectTableCell from "../components/tableCells/SelectTableCell";
import ServicesTableCell from "../components/tableCells/ServicesTableCell";
import StringTableCell from "../components/tableCells/StringTableCell";
import AllCustomersTableCell from "../components/tableCells/AllCustomersTableCell";
import UsersTableCell from "../components/tableCells/UsersTableCell ";

const TableCellOptions = ({
  field,
  fields,
  handleChange,
  modalOptions,
  setFields,
  handleMemberChange,
  handleProductChange,
  handleServiceChange,
  selectedMembers,
  selectedProducts,
  selectedServices,
  color,
  priceDifference,
  setPriceDifference,
  setFinalPrice,
  setOkToDispatch,
  serviceLength
}) => {
  return (
    <>
      {field.type === "string" && (
        <StringTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
      {field.type === "allCustomers" && (
        <AllCustomersTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
      {field.type === "idDoc" && (
        <IdDocTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
      {field.type === "phone" && (
        <PhoneTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
      {field.type === "currency" && (
        <CurrencyTableCell
          fields={fields}
          field={field}
          setFields={setFields}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
      {field.type === "password" && (
        <StringTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          isPassword
        />
      )}
      {field.type === "fullWidth" && (
        <StringTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          isFullWidth
        />
      )}
      {field.type === "select" && (
        <SelectTableCell
          fields={fields}
          field={field}
          menuOptions={field.options}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          isFullWidth
        />
      )}
      {field.type === "multipleSelect" && (
        <SelectTableCell
          fields={fields}
          field={field}
          menuOptions={field.options}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          multiple
        />
      )}
      {field.type === "date" && (
        <DateTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
      {field.type === "members" && (
        <MembersTableCell
          fields={fields}
          field={field}
          selectedMembers={selectedMembers}
          modalOptions={modalOptions}
          handleMemberChange={handleMemberChange}
          isEditing={true}
        />
      )}
      {field.type === "dynamicData" && (
        <DynamicDataTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          multiple={field.multiple}
          serviceLength={serviceLength}
        />
      )}
      {field.type === "users" && (
        <UsersTableCell
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          multiple={field.multiple}
          serviceLength={serviceLength}
        />
      )}
      {field.type === "managerSelect" && (
        <ManagerSelectTableCell
          oldManager={fields["manager"]}
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
          multiple={field.multiple}
        />
      )}
      {field.type === "productList" && (
        <Grid direction="column" alignItems="center" justifyContent="center">
          <ProductsTableCell
            selectedProducts={
              fields[field.name]?.selectedProducts || fields[field.name] || []
            }
            onChange={handleChange(field.name)}
            size="small"
            required={field.required}
            handleProductChange={handleProductChange}
          />
          {selectedProducts.length !== 0 && (
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
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
                      Quantidade
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
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
                {selectedProducts.map((product, index) => (
                  <TableRow key={index} sx={{ mt: 3 }}>
                    <TableCell>
                      <Typography sx={{ fontSize: 14 }}>
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: 14 }}>
                        {product.count}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: 14 }}>
                        R$
                        {field.type === "productList"
                          ? product.sellValue
                          : product.buyValue.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: 14 }}>
                        R$
                        {(field.type === "productList"
                          ? product.sellValue * product.count
                          : product.buyValue * product.count
                        ).toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {selectedProducts.length > 1 && (
                  <TableRow sx={{ mt: 3 }}>
                    <TableCell colSpan={3} />
                    <TableCell align="right">
                      <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                        R$
                        {selectedProducts
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
              </Table>
            </Grid>
          )}
        </Grid>
      )}
      {field.type === "servicesList" && (
        <ServicesTableCell
          value={fields[field.name] || ""}
          onChange={handleChange(field.name)}
          size="small"
          required={field.required}
          handleServiceChange={handleServiceChange}
          selectedServices={selectedServices}
          priceDifference={priceDifference}
          setPriceDifference={setPriceDifference}
          setFinalPrice={setFinalPrice}
          setOkToDispatch={setOkToDispatch}
        />
      )}
      {field.type === "list" && (
        <TextField
          value={fields[field.name] || ""}
          onChange={handleChange(field.name)}
          sx={{ width: "336%" }}
          size="small"
          required={field.required}
        />
      )}
      {field.type === "checkbox" && (
        <>
          <InputLabel>{field.label}</InputLabel>
          <Checkbox
            checked={fields[field.name] || false}
            onChange={() =>
              setFields({
                ...fields,
                [field.name]: !fields[field.name],
              })
            }
            size="small"
            required={field.required}
          />
        </>
      )}
      {field.type === "color" && (
        <ColorPicker
          prevColor={color}
          fields={fields}
          field={field}
          handleChange={handleChange}
          modalOptions={modalOptions}
          required={field.required}
        />
      )}
    </>
  );
};

export default TableCellOptions;
