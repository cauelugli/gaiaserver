/* eslint-disable react/prop-types */
import React from "react";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

import {
  Box,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import ProductsTable from "../tables/ProductsTable";
import ProductsTableButton from "../components/small/buttons/tableButtons/ProductsTableButton";
import RefreshButton from "../components/small/buttons/RefreshButton";
import NoDataText from "../components/small/NoDataText";
import TableOrCardSelector from "../components/small/TableOrCardSelector";
import StockCard from "../components/cards/StockCard";

function CustomTabPanel(props) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Products({
  userId,
  userName,
  userRole,
  userDepartment,
  configData,
  topBar,
  tableOrCardView,
  setUserPreferences,
  cardSize,
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshData, setRefreshData] = React.useState(false);
  const [newDataRefreshButton, setNewDataRefreshButton] = React.useState(true);
  const [configProducts, setConfigProducts] = React.useState({});
  const [configCustomization, setConfigCustomization] = React.useState([]);
  const [value, setValue] = React.useState(0);

  const [baseProducts, setBaseProducts] = React.useState([]);
  const [products, setProducts] = React.useState([]);

  const productTypes = React.useMemo(() => {
    return [...new Set(products.map((product) => product.type))];
  }, [products]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await api.get("/products");
        const config = await api.get("/config");
        setConfigProducts(config.data[0].products);
        setConfigCustomization(config.data[0].customization);
        setBaseProducts(products.data.filter((product) => !product.name));
        setProducts(products.data.filter((product) => product.name));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  console.log("baseProducts", baseProducts);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "50vw" }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ ml: 2 }}
      >
        <Typography sx={{ fontSize: 25, mr: 1, fontWeight: "bold" }}>
          Produtos
        </Typography>
        <ProductsTableButton
          userId={userId}
          userName={userName}
          configCustomization={configCustomization}
          types={configProducts.productTypes}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
          baseProducts={baseProducts}
        />
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { backgroundColor: "black" } }}
        >
          {productTypes.map((type, index) => (
            <Tab
              key={index}
              label={<Typography sx={{ fontSize: 13 }}>{type}</Typography>}
              sx={{ color: "black", "&.Mui-selected": { color: "black" } }}
            />
          ))}
          <RefreshButton
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            configCustomization={configCustomization}
            userId={userId}
            newDataRefreshButton={newDataRefreshButton}
            setNewDataRefreshButton={setNewDataRefreshButton}
          />
          <Grid sx={{ my: "auto", ml: "auto" }}>
            <TableOrCardSelector
              userId={userId}
              refreshData={refreshData}
              setRefreshData={setRefreshData}
              tableOrCard={tableOrCardView}
              setUserPreferences={setUserPreferences}
              cardSize={cardSize}
            />
          </Grid>
        </Tabs>
      </Box>
      {productTypes.map((type, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {products.filter((product) => product.type === type).length === 0 ? (
            <NoDataText option={type} />
          ) : (
            <>
              {tableOrCardView ? (
                <ProductsTable
                  products={products.filter((product) => product.type === type)}
                  baseProduct={baseProducts.filter((product) => product.type === type)}
                  userName={userName}
                  userId={userId}
                  userRole={userRole}
                  userDepartment={userDepartment}
                  configData={configProducts}
                  refreshData={refreshData}
                  setRefreshData={setRefreshData}
                  topBar={topBar}
                />
              ) : (
                <Grid
                  sx={{ mt: 0.5, width: topBar ? "107%" : "100%" }}
                  container
                  spacing={2}
                >
                  {products
                    .filter((product) => product.type === type)
                    .map((item, index) => (
                      <Grid
                        item
                        key={index}
                        md={cardSize}
                        lg={cardSize}
                        xl={cardSize}
                      >
                        <StockCard
                          userId={userId}
                          userName={userName}
                          configData={configData}
                          item={item}
                          type="entry"
                          refreshData={refreshData}
                          setRefreshData={setRefreshData}
                        />
                      </Grid>
                    ))}
                </Grid>
              )}
            </>
          )}
        </CustomTabPanel>
      ))}
    </Box>
  );
}
