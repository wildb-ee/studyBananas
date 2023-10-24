"use client"
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StarIcon from '@mui/icons-material/Star';
import { Alert, AlertTitle, Avatar, Box, CircularProgress, CssBaseline, ListItemAvatar, Typography } from '@mui/material';
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())


export default function PublicClubs() {

  const { data, error, isLoading } = useSWR('http://localhost:8000/user/get/public/clubs', fetcher)

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
    );
  }

  if (isLoading) {
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

    );

  }



  //if you change the name of a club CHECK
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

      <List
        sx={{ width: '100%', maxWidth: 900, bgcolor: 'background.paper' }}
        aria-label="contacts"
      >

        {data.clubs.map((club) => (
          <ListItem disablePadding alignItems="flex-start" key={club.id}>
            <ListItemButton button='true' component="a" href={'/user/join/club/' + club.id}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "darkgreen", color: "#fdd835" }}>{club.name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={club.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {club.description}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}

      </List>
    </Box>
  );
}