"use client"

import { Alert, AlertTitle, Avatar, Box, Button, CircularProgress, Collapse, Container, CssBaseline, Grid, IconButton, ThemeProvider, Typography, createTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import useSWR from "swr";
import { useContext, useState } from "react";
import { ThemeContext } from "@/utils/contexts";

const fetcher = (...args) => fetch(...args).then((res) => res.json())


export default function Page({ params }) {

  const [errors, setErrors] = useState([])
  const { data: session, status } = useSession()

  const { data, error, isLoading } = useSWR('http://localhost:8000/user/get/public/clubs', fetcher)


  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch("http://localhost:8000/user/join/public/club", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.user.access}`
      },
      body: JSON.stringify({
        name: data.clubs.find((element) => element.id == params.id).name
      })
    }).then((res) => res.json()).then((res) => {

      if (errors.find((element) => element.details === res.details)) {

      }
      else {
        setErrors([...errors, res])
      }


    });
  };


  if (status === "loading" || isLoading) {
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

  if (error) {
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
          This is an error alert — <strong>Internal Server Error</strong>
        </Alert>
      </Box>
    )
  }
  else if (status === "unauthenticated") {
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
    <Container component="main" maxWidth="xs">
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
          {data.clubs.find((element) => element.id == params.id).name}
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <Typography component="h2" variant="h6">
                {data.clubs.find((element) => element.id == params.id).description}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="h2" variant="h6">
                PUBLIC CLUB
              </Typography>
            </Grid>

          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "green", ":hover": { bgcolor: "darkgreen" } }}
          >
            Join
          </Button>

        </Box>

        {
          (Object.keys(errors).length !== 0) ?
            (
              errors.map((error, i) => (
                <Collapse in key={i}>
                  <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                  >
                    {error.detail}
                  </Alert>
                </Collapse>

              ))



            ) : (<></>)


        }


      </Box>
    </Container>
  );
}