"use client"
import { ClubContext } from '@/utils/contexts'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import React, { useContext, useState } from 'react'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'

const CreateEventDialog = ({isCreateEvent, setCreateEvent}) => {
  let {clubName} = useContext(ClubContext)  
  let [event,setEvent] =useState({title:'', description:'', end_time:new Date(), start_time:new Date()})
  const { data: session} = useSession()


  const handleSubmit =async (e)=>{
    e.preventDefault()

    const response1 = await fetch(`http://localhost:8000/scheduler/event/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.user.access}`
      },
      body: JSON.stringify({
        title: event.title,
        description: event.description,
        club_name: clubName,
        start_time: event.start_time,
        end_time: event.end_time,
      })
    })

    if (response1.ok){
      setCreateEvent(false)
    }
    else{
      console.log(response1)
    }
    
  }
  

  return (
    <Dialog open={isCreateEvent} onClose={()=>{setCreateEvent(false)}}>
        <DialogTitle>Create Event for {clubName} </DialogTitle>
         <Box component="form" noValidate onSubmit={handleSubmit}>
        <DialogContent >
          <DialogContentText>
            Fill the form
          </DialogContentText>


          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            fullWidth

            onChange={(e)=>setEvent({...event,title:e.target.value})}
            value={event.title}

            />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            fullWidth

            onChange={(e)=>setEvent({...event,description:e.target.value})}
            value={event.description}

            
            />
          <DateTimePicker 
          id="startDate"
          label="Start Date" 

          onChange={(e)=>{setEvent({...event,start_time:e.$d})}}
          value={dayjs(event.start_time)}

          />
          <DateTimePicker
           id="endDate"
           label="End Date"

           onChange={(e)=>setEvent({...event,end_time:e.$d})}
           value={dayjs(event.end_time)}

           />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{setCreateEvent(false)}}>Cancel</Button>
          <Button type='submit'>Create</Button>
        </DialogActions>
           </Box>
      </Dialog>
  )
}

export default CreateEventDialog