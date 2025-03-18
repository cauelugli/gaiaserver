/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Grid2,
} from "@mui/material";

import { icons } from "../../icons";

const ChartReportsHeader = ({
  displayChart,
  setDisplayChart,
  chartType,
  setChartType,
  groupBy,
  setGroupBy,
  isChartFocused,
  setIsChartFocused,
}) => {
  return (
    <Grid2 sx={{ m: 2 }} container direction="row" alignItems="center">
      <Grid2 item>
        <Grid2>
          <Typography
            id="title"
            sx={{ fontSize: "2vw", mr: "1vw", ml: -1, cursor: "pointer" }}
            onClick={() => setDisplayChart(!displayChart)}
          >
            Relatórios
          </Typography>

          {displayChart && (
            <Grid2
              container
              direction="row"
              justifyContent="space-evenly"
              sx={{ mt: 1 }}
            >
              <Tooltip title="Gráfico em Linhas">
                <Button
                  variant={chartType === "line" ? "contained" : "outlined"}
                  onClick={() => setChartType("line")}
                >
                  <icons.ShowChartIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Gráfico em Barras">
                <Button
                  variant={chartType === "bar" ? "contained" : "outlined"}
                  onClick={() => setChartType("bar")}
                >
                  <icons.BarChartIcon />
                </Button>
              </Tooltip>
            </Grid2>
          )}
        </Grid2>
      </Grid2>

      <icons.ExpandLessIcon
        onClick={() => setDisplayChart(!displayChart)}
        sx={{ cursor: "pointer", mb: 2 }}
      />
      <FormControl sx={{ ml: 2, mb: 2 }}>
        <InputLabel>Período</InputLabel>
        <Select
          value={groupBy}
          label="Período"
          onChange={(e) => setGroupBy(e.target.value)}
        >
          <MenuItem value="day">Por Dia</MenuItem>
          <MenuItem value="month">Por Mês</MenuItem>
        </Select>
      </FormControl>
      {groupBy === "day" ? (
        <Grid2>
          <>day</>
        </Grid2>
      ) : groupBy === "month" ? (
        <Grid2>
          <>month</>
        </Grid2>
      ) : (
        ""
      )}

      {isChartFocused && (
        <Button
          sx={{ ml: "auto", height: "auto" }}
          variant="contained"
          color="error"
          onClick={() => setIsChartFocused(false)}
        >
          X
        </Button>
      )}
    </Grid2>
  );
};

export default ChartReportsHeader;
