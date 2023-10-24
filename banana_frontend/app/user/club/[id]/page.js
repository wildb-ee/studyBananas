"use client"

import { Alert, AlertTitle, Avatar, Box, Button, CircularProgress, Collapse, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import useSWR from "swr";
import { createContext, useContext, useEffect, useState } from "react";
import { ClubContext, ThemeContext } from "@/utils/contexts";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateTimePicker } from "@mui/x-date-pickers";
import AddNewMemberDialog from "@/components/AddNewMemberDialog";
import CreateEventDialog from "@/components/CreateEventDialog";
import EditMembersDialog from "@/components/EditMembersDialog";


const ClubEditor = ({ params }) => {

  const { data: session, status } = useSession()
  const [data, setData] = useState({});
  const [events, setEvents] = useState({});
  const [isCreateEvent, setCreateEvent] = useState(false);
  const [isAddMembers, setAddMembers] = useState(false);
  const [isEditEvent, setEditEvent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated') {

        const response1 = await fetch(`http://localhost:8000/user/get/club/position/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.user.access}`
          },
        })

        const response2 = await fetch(`http://localhost:8000/scheduler/event/get/all/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.user.access}`
          },
        })

        if (!response1.ok || !response2.ok) {
          throw new Error(`HTTP error! status: r1 ${response1.status}, r2 ${response2.status}`)
        }

        const result1 = await response1.json()
        const result2 = await response2.json()

        let temp = []
        for (let i = 0; i < result2.events.length; i++) {
          temp.push({
            title: result2.events[i].title,
            start: result2.events[i].start_time,
            end: result2.events[i].end_time
          })
        }


        setData(result1)
        setEvents(temp)

      }
    }

    fetchData().catch((e) => {
      // handle the error as needed
      console.error('An error occurred while fetching the data: ', e)
    })
  }, [session])


  if (status === "loading") {
    return (
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}

      >
        <CssBaseline />
        <CircularProgress sx={{ color: "darkgreen" }} />
      </Box>
    )
  }

  if (status === "unauthenticated") {
    return (
      <Box sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <CssBaseline />
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          This is an error alert — <strong>Access Denied</strong>
        </Alert>
      </Box>
    )
  }
  return (

    <>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'green' }}>
            <AddIcon sx={{ color: "#fdd835" }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            {data?.position?.club_name}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <Typography component="h2" variant="h6">
                  {data?.position?.position_name}
                </Typography>
              </Grid>
            </Grid>

            {(data?.position?.position_name === 'CEO') ? (<>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "green", ":hover": { bgcolor: "darkgreen" } }}
                onClick={() => { setCreateEvent(true) }}
              >
                Create Event
              </Button>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "green", ":hover": { bgcolor: "darkgreen" } }}
                onClick={() => { setAddMembers(true) }}
              >
                Add Members
              </Button>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "green", ":hover": { bgcolor: "darkgreen" } }}
              >
                Edit Event
              </Button>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "green", ":hover": { bgcolor: "darkgreen" } }}
                onClick={() => { setEditEvent(true) }}
              >
                Edit Members
              </Button>


            </>) : (<></>)}
            <Fullcalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={"dayGridMonth"}
              headerToolbar={{
                start: "today prev,next", // will normally be on the left. if RTL, will be on the right
                center: "title",
                end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
              }}
              height={"90vh"}
              events={events}
            />
          </Box>

        </Box>
      </Container>


      <ClubContext.Provider value={{ clubName: data?.position?.club_name }}>
        <CreateEventDialog isCreateEvent={isCreateEvent} setCreateEvent={setCreateEvent} />
        <AddNewMemberDialog setAddMembers={setAddMembers} isAddMembers={isAddMembers} />
        <EditMembersDialog isEditEvent={isEditEvent} setEditEvent={setEditEvent} />
      </ClubContext.Provider>

    </>

  )
}

export default ClubEditor