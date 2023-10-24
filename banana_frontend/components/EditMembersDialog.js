"use client"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import React from 'react'

const EditMembersDialog = ({isEditEvent, setEditEvent}) => {

  const handleSubmit = (e) =>{
    e.preventDefault();
    setEditEvent(false)
  }


  return (
    <Dialog open={isEditEvent} onClose={()=>{setEditEvent(false)}}>
        <DialogTitle>Edit Members</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit your Club Members as the CEO
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{setEditEvent(false)}}>Cancel</Button>
          <Button onClick={handleSubmit}>Done</Button>
        </DialogActions>
      </Dialog>
  )
}

export default EditMembersDialog