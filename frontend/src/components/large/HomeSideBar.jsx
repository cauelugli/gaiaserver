/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

import { Collapse, Grid2, IconButton, Typography } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import { icons } from "../../icons";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import UserShortcuts from "../small/UserShortcuts";
import DayEvents from "../small/DayEvents";

const customPtBrLocale = {
  ...dayjs.Ls["pt-br"],
  weekdaysMin: ["D", "S", "T", "Q", "Q", "S", "S"],
  months: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
};

dayjs.locale(customPtBrLocale);

const HomeSideBar = ({
  api,
  userId,
  handleShortcutClick,
  allowedLinks,
  userAgenda,
  mainColor,
  homePagePreferences,
}) => {
  const [selectedDay, setSelectedDay] = React.useState(dayjs());
  const [openCalendar, setOpenCalendar] = React.useState(
    homePagePreferences === 1 ? true : false
  );

  return (
    <Grid2 container direction="column" alignItems="center">
      <Grid2
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        sx={{
          border: "1px solid #e7e7ee",
          borderRadius: 3,
          width: 320,
        }}
      >
        <Typography id="ghost" />
        <Typography
          sx={{
            px: "25%",
            mt: -1,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Calendário
        </Typography>
        <IconButton
          onClick={() => setOpenCalendar(!openCalendar)}
          sx={{ mb: 1 }}
        >
          {openCalendar ? <icons.ExpandLessIcon /> : <icons.ExpandMoreIcon />}
        </IconButton>
        <Grid2 item>
          <Collapse in={openCalendar}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDay}
                onChange={(newDay) => setSelectedDay(newDay)}
                views={["day", "month"]}
                sx={{
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              />
            </LocalizationProvider>
          </Collapse>
        </Grid2>
      </Grid2>

      <DayEvents
        selectedDay={dayjs(selectedDay).format("DD/MM/YYYY")}
        userAgenda={userAgenda}
        mainColor={mainColor}
        api={api}
      />
      <UserShortcuts
        userId={userId}
        onShortcutClick={handleShortcutClick}
        allowedLinks={allowedLinks}
      />
    </Grid2>
  );
};

export default HomeSideBar;
