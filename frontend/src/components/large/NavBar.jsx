/* eslint-disable react/prop-types */
import * as React from "react";
import { Link } from "react-router-dom";

import { Grid } from "@mui/material";

import UserButton from "../small/buttons/UserButton";
import NotificationsButton from "../small/buttons/NotificationsButton";
import TopBar from "../large/TopBar";

export default function NavBar({ user, api, socket, configData, barPosition }) {
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const notifications = await api.get(`/get/notifications/${user._id}`);
        setNotifications(notifications.data);
      } catch (error) {
        if (error.response.status !== 404) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [api, user._id]);

  const fetchData = async () => {
    try {
      const notifications = await api.get(`/get/notifications/${user._id}`);
      setNotifications(notifications.data);
    } catch (error) {
      if (error.response.status !== 404) {
        console.error("Error fetching data:", error);
      }
    }
  };

  React.useEffect(() => {
    const handleNewNotificationToList = (notificationData) => {
      // doesn't apply to 'self' emitter user
      if (notificationData && user._id !== notificationData.emitterId) {
        fetchData();
      }
    };
    const handleNewNotificationToAssignee = (notificationData) => {
      // doesn't apply to 'self' emitter user
      if (notificationData && user._id !== notificationData.receiver) {
        fetchData();
      }
    };

    socket.on("newNotificationToList", handleNewNotificationToList);
    socket.on("newNotificationToAssignee", handleNewNotificationToAssignee);

    return () => {
      socket.off("newNotificationToList", handleNewNotificationToList);
      socket.off("newNotificationToAssignee", handleNewNotificationToAssignee);
    };
  });

  return (
    <>
      {configData && configData.customization && (
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ backgroundColor: configData.customization.mainColor }}
        >
          <Grid
            item
            sx={{
              ml: 1,
              maxWidth: "10%",
              height: "auto",
              cursor: "pointer",
            }}
          >
            <Link to={"/"}>
              <img
                src={`http://localhost:3000/static/${
                  configData && configData.customization
                    ? configData.customization.logo
                    : ""
                }`}
                alt="logo"
                style={{
                  width: "100%",
                }}
              />
            </Link>
          </Grid>

          {barPosition && (
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="space-evenly"
              sx={{ width: "auto" }}
            >
              <TopBar configData={configData} user={user} />
            </Grid>
          )}

          <Grid item sx={{ mr: 2 }}>
            <Grid container direction="row">
              <NotificationsButton
                sx={{ mr: 3, color: "#333" }}
                api={api}
                socket={socket}
                mainColor={configData.customization.mainColor}
                user={user}
                notifications={notifications}
                setNotifications={setNotifications}
                fetchData={fetchData}
              />
              <UserButton user={user} />
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}
