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
import { useSession } from 'next-auth/react';


export default function PrivateClubs() {
  const { data: session, status } = useSession();
  const [clubs, setClubs] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated') {

      }
      else {

        const response = await fetch('http://localhost:8000/user/get/clubs', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.user.access}`
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()

        setClubs(result)
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

        {clubs.map((club) => (
          <ListItem disablePadding alignItems="flex-start" key={club.id}>
            <ListItemButton button='true' component="a" href={'/user/club/' + club.id}>
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