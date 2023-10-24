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
import { Alert, AlertTitle, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { ThemeContext } from '@/utils/contexts';


export default function SignUp() {
  const [isUsernameError, setUsernameError] = React.useState(false);
  const [isSatError, setSatError] = React.useState(false);
  const [isIeltsError, setIeltsError] = React.useState(false);
  const [isToeflError, setToeflError] = React.useState(false);
  const [isFirstnameError, setFirstnameError] = React.useState(false);
  const [isLastnameError, setLastnameError] = React.useState(false);
  const [isBioError, setBioError] = React.useState(false);
  const [isPasswordError, setPasswordError] = React.useState(false);
  const router = useRouter();


  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get('password') === '' || data.get('username') === '') {
      setPasswordError(true);
      setUsernameError(true);
      return;
    }
    else {
      setPasswordError(false);
      setUsernameError(false);
    }


    const res = await fetch("http://localhost:8000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: (data.get('first_name')),
        last_name: (data.get('last_name')),
        username: (data.get('username')),
        bio: (data.get('bio')),
        sat_result: (data.get('sat_result') == '' ? null : data.get('sat_result')),
        ielts_result: (data.get('ielts_result') == '' ? null : data.get('ielts_result')),
        toefl_result: (data.get('toefl_result') == '' ? null : data.get('toefl_result')),
        password: (data.get('password'))
      }),
    }).then((res) => res.json()).then(async (res) => {


      if (Object.keys(res).length !== 0) {
        if (res.username) {
          setUsernameError(true)
        }
        if (res.first_name) {
          setFirstnameError(true);
        }
        if (res.last_name) {
          setLastnameError(true);
        }
        if (res.bio) {
          setBioError(true);
        }
        if (res.ielts_result) {
          setIeltsError(true);
        }
        if (res.toefl_result) {
          setToeflError(true);
        }
        if (res.sat_result) {
          setSatError(true);
        }
        if (res.password) {
          setPasswordError(true);
        }

      }
    });


  };




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
          <AdminPanelSettingsIcon sx={{ color: "#fdd835" }} />
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
                error={isToeflError}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                error={isPasswordError}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "green", ":hover": { bgcolor: "darkgreen" } }}
          >
            Sign Up
          </Button>

        </Box>
      </Box>
    </Container>
  );
}