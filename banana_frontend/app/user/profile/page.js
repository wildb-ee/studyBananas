"use client"

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSession, getSession, signOut } from "next-auth/react"
import { Alert, AlertTitle, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import SettingsIcon from '@mui/icons-material/Settings';
import { ThemeContext } from '@/utils/contexts';


export default function Profile() {
  const [isUsernameError, setUsernameError] = React.useState(false);
  const [isSatError, setSatError] = React.useState(false);
  const [isIeltsError, setIeltsError] = React.useState(false);
  const [isToeflError, setToeflError] = React.useState(false);
  const [isFirstnameError, setFirstnameError] = React.useState(false);
  const [isLastnameError, setLastnameError] = React.useState(false);
  const [isBioError, setBioError] = React.useState(false);


  const { data: session, status, update } = useSession()
  const router = useRouter();


  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const res = await fetch("http://localhost:8000/user/edit/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.user.access}`
      },
      body: JSON.stringify({
        first_name: (data.get('first_name')),
        last_name: (data.get('last_name')),
        username: (data.get('username')),
        bio: (data.get('bio')),
        sat_result: (data.get('sat_result' == '') ? (null) : data.get('sat_result')),
        ielts_result: (data.get('ielts_result' == '') ? (null) : data.get('ielts_result')),
        toefl_result: (data.get('toefl_result' == '') ? (null) : data.get('toefl_result')),
      })
    }).then((res) => res.json()).then(async (res) => {
      if (Object.keys(res.messages).length === 0) {
        await update({
          ...session,
          user: {
            ...session?.user,
            first_name: data.get('first_name'),
            last_name: data.get('last_name'),
            username: data.get('username'),
            bio: data.get('bio'),
            sat_result: data.get('sat_result'),
            ielts_result: data.get('ielts_result'),
            toefl_result: data.get('toefl_result'),

          },
        });

        router.push('/');
      }
      else {
        if (res.messages.username) {
          setUsernameError(true)
        }
        if (res.messages.first_name) {
          setFirstnameError(true);
        }
        if (res.messages.last_name) {
          setLastnameError(true);
        }
        if (res.messages.bio) {
          setBioError(true);
        }
        if (res.messages.ielts_result) {
          setIeltsError(true);
        }
        if (res.messages.toefl_result) {
          setToeflError(true);
        }
        if (res.messages.sat_result) {
          setSatError(true);
        }

      }
    });


  };



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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', bgcolor: "darkgreen" }}>
          <SettingsIcon sx={{ color: "#fdd835" }} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Profile
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="first_name"
                fullWidth
                id="first_name"
                label="First Name"
                autoFocus
                variant='standard'
                defaultValue={session.user.first_name}
                error={isFirstnameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="last_name"
                label="Last Name"
                name="last_name"
                variant='standard'
                defaultValue={session.user.last_name}
                error={isLastnameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="User Name"
                name="username"
                variant='standard'
                defaultValue={session.user.username}
                error={isUsernameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="bio"
                label="Bio"
                name="bio"
                multiline
                maxRows={4}
                defaultValue={session.user.bio}
                error={isBioError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField

                fullWidth
                id="sat_result"
                label="SAT Result"
                name="sat_result"
                variant='standard'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                defaultValue={session.user.sat_result}
                error={isSatError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField

                fullWidth
                id="ielts_result"
                label="IELTS Result"
                name="ielts_result"
                variant='standard'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                defaultValue={session.user.ielts_result}
                error={isIeltsError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField

                fullWidth
                id="toefl_result"
                label="TOEFL Result"
                name="toefl_result"
                variant='standard'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                defaultValue={session.user.toefl_result}
                error={isToeflError}

              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "green", ":hover": { bgcolor: "darkgreen" } }}
          >
            Save
          </Button>

        </Box>
      </Box>
    </Container>
  );
}