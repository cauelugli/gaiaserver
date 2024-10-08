/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, forwardRef } from "react";
import { Calendar, luxonLocalizer } from "react-big-calendar";
import { DateTime, Settings } from "luxon";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";

Settings.defaultLocale = "pt-BR";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Slide,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import CalendarEventModal from "../../forms/misc/CalendarEventModal";
import AgendaActions from "../small/buttons/AgendaActions";
import CalendarEvents from "../small/CalendarEvents";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const localizer = luxonLocalizer(DateTime);

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const MyCalendar = ({ userId, config, selectedWorker }) => {
  const [events, setEvents] = React.useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [customer, setCustomer] = useState({});
  const [service, setService] = useState({});
  const [worker, setWorker] = useState("");
  const [group, setGroup] = useState("");
  const [newEvent, setNewEvent] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const parseDateString = (dateStr, timeStr = "00:00") => {
    const [day, month, year] = dateStr.split("/");
    const [hours, minutes] = timeStr.split(":");
    return new Date(year, month - 1, day, hours, minutes);
  };

  const fetchData = async () => {
    try {
      let url = `/agenda/${userId}`;
      if (selectedWorker) {
        url = `/agenda/${selectedWorker._id}`;
      }
      let userAgenda = await api.get(url);
      if (!userAgenda.data || userAgenda.data === undefined) {
        userAgenda = [];
      }
      const convertedEvents = userAgenda.data.map((event) => {
        const start = event.start
          ? parseDateString(
              event.start.split(" ")[0],
              event.start.split(" ")[1]
            )
          : parseDateString(event.date);
        const end = event.end
          ? parseDateString(event.end.split(" ")[0], event.end.split(" ")[1])
          : start;
        return { ...event, start, end };
      });
      setEvents(convertedEvents);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [selectedWorker]);

  const handleAddEvent = () => {
    if (title) {
      const eventToAdd = {
        title,
        start: moment(newEvent.start).format("DD/MM/YYYY HH:mm"),
        end: moment(newEvent.end).format("DD/MM/YYYY HH:mm"),
        status: "Aberto",
        type,
        customer,
        service,
        worker,
        group,
      };
      api
        .post("/agenda/addAgendaEvent", {
          ...eventToAdd,
          userId: selectedWorker ? selectedWorker._id : userId,
        })
        .then(() => {
          fetchData();
          toast.success("Evento Adicionado!", {
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
            autoClose: 1200,
          });
        })
        .catch((error) => {
          console.error("Erro ao salvar o evento:", error);
          toast.error("Houve algum erro...", {
            closeOnClick: true,
            pauseOnHover: false,
            theme: "colored",
            autoClose: 1200,
          });
        });
      setOpen(false);
      setTitle("");
      setType("");
      setCustomer({});
      setWorker("");
      setGroup("");
    }
  };

  const handleDeleteEvent = () => {
    const payload = {
      userId: selectedWorker ? selectedWorker._id : userId,
      start: moment(selectedEvent.start).format("DD/MM/YYYY HH:mm"),
      end: moment(selectedEvent.end).format("DD/MM/YYYY HH:mm"),
    };

    api
      .put("/agenda/deleteAgendaEvent", payload)
      .then(() => {
        fetchData();
        toast.error("Evento Deletado", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
          icon: <DeleteIcon />,
        });
      })
      .catch((error) => {
        console.error("Erro ao excluir o evento:", error);
      });
    setDetailsDialogOpen(false);
  };

  const handleResolveEvent = () => {
    const startFormatted = moment(selectedEvent.start).format(
      "DD/MM/YYYY HH:mm"
    );
    const endFormatted = moment(selectedEvent.end).format("DD/MM/YYYY HH:mm");

    api
      .put(`/agenda/resolveAgendaEvent`, {
        userId: selectedWorker ? selectedWorker._id : userId,
        start: startFormatted,
        end: endFormatted,
      })
      .then(() => {
        fetchData();
        setDetailsDialogOpen(false);
        toast.success("Evento Resolvido!", {
          closeOnClick: true,
          pauseOnHover: false,
          theme: "colored",
          autoClose: 1200,
        });
      })
      .catch((error) => {
        console.error("Erro ao atualizar o status do evento:", error);
      });
  };

  const handleSelectSlot = ({ start, end }) => {
    setOpen(true);
    setNewEvent({ start, end });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const EventDetailsDialog = ({ event, open, onClose }) => (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      handleResolveEvent={handleResolveEvent}
      BackdropProps={{ style: { backgroundColor: "transparent" } }}
    >
      <DialogTitle>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            mt: 1,
            mb: 2,
          }}
        >
          Detalhes do Evento
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ width: 450 }}>
        <Typography gutterBottom>Título: {event?.title}</Typography>
        <Typography gutterBottom>
          Início: {moment(event?.start).format("DD/MM/YYYY HH:mm")}
        </Typography>
        <Typography gutterBottom>
          Fim: {moment(event?.end).format("DD/MM/YYYY HH:mm")}
        </Typography>
        <Typography gutterBottom>Status: {event?.status}</Typography>
        <Typography gutterBottom>Tipo de Evento: {event?.type.name}</Typography>
        {event.customer.name && (
          <Typography gutterBottom>Cliente: {event.customer.name}</Typography>
        )}
        {event.service && event.service.name && (
          <Typography gutterBottom>Serviço: {event.service.name}</Typography>
        )}
        {event.group && event.group.name && (
          <Typography gutterBottom>Grupo: {event.group.name}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <AgendaActions
          onClose={onClose}
          handleResolveEvent={handleResolveEvent}
          handleDeleteEvent={handleDeleteEvent}
        />
      </DialogActions>
    </Dialog>
  );

  const eventStyleGetter = (event) => {
    const hexToRGB = (hex) => {
      let r, g, b;
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
      return [r, g, b];
    };

    const [r, g, b] = hexToRGB(
      config.showServiceColorOnEvents
        ? event.service.color
        : event.type.color || "#ffffff"
    );

    let style = {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.55)`,
      border: "1px solid white",
      color: "white",
    };

    return {
      style: style,
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  const minTime = new Date();
  minTime.setHours(config.minTime || 7, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(config.maxTime || 22, 0, 0);

  const customFormats = {
    eventTimeRangeFormat: () => "",
  };

  return (
    <>
      <div style={{ height: 700 }}>
        <Calendar
          onSelectEvent={(event) => handleSelectEvent(event)}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={handleSelectSlot}
          selectable={true}
          defaultView="week"
          formats={customFormats}
          min={minTime}
          max={maxTime}
          components={{
            event: CalendarEvents,
          }}
          eventPropGetter={eventStyleGetter}
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "Não há eventos neste período.",
            showMore: (total) => `+ Ver mais (${total})`,
          }}
        />
      </div>
      <CalendarEventModal
        selectedDate={`${moment(newEvent.start).format(
          "DD/MM/YYYY HH:mm"
        )} até ${moment(newEvent.end).format("HH:mm")}`}
        open={open}
        userId={userId}
        handleClose={handleClose}
        title={title}
        setTitle={setTitle}
        type={type}
        types={config.eventTypes}
        setType={setType}
        setService={setService}
        setCustomer={setCustomer}
        setWorker={setWorker}
        setGroup={setGroup}
        handleAddEvent={handleAddEvent}
      />
      {selectedEvent && (
        <EventDetailsDialog
          event={selectedEvent}
          handleResolveEvent={handleResolveEvent}
          open={detailsDialogOpen}
          onClose={handleCloseDetailsDialog}
        />
      )}
    </>
  );
};

export default MyCalendar;
