"use client"
import { ClubContext } from '@/utils/contexts'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { useSession } from 'next-auth/react'
import React, { useContext, useState } from 'react'

const AddNewMemberDialog = ({isAddMembers, setAddMembers}) => {

  let {clubName} = useContext(ClubContext)  
  let [user,setUser] =useState({username:'', position:''})
  const { data: session} = useSession()
  

  const handleSubmit =async (e)=>{
    e.preventDefault()

    const response1 = await fetch('http://localhost:8000/user/add/member', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.user.access}`
      },
      body: JSON.stringify({
        club_name: clubName,
        position_name: user.position,
        username: user.username
      })
    })

    if (response1.ok){
      setAddMembers(false)
    }
    else{
      console.log(response1.json())
    }
    
  }




  return (
    <Dialog open={isAddMembers} onClose={()=>{setAddMembers(false)}}>
    <DialogTitle>Add a New Member</DialogTitle>
    <DialogContent>
      <DialogContentText>
        To Add a User Please Enter his Username
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        id="username"
        label="username"
        fullWidth
        variant="standard"

        value={user.username}
        onChange={(e)=>setUser({...user, username: e.target.value})}
      />
      <TextField
        autoFocus
        margin="dense"
        id="position"
        label="position"
        fullWidth
        variant="standard"

        value={user.position}
        onChange={(e)=>setUser({...user, position: e.target.value})}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={()=>{setAddMembers(false)}}>Cancel</Button>
      <Button onClick={handleSubmit}>Add Member</Button>
    </DialogActions>
  </Dialog>
  )
}

export default AddNewMemberDialog