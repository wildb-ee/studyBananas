"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeContext } from '@/utils/contexts'
import { useState } from "react";
import { createTheme } from "@ant-design/cssinjs";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function Provider({ children }) {

  return (


    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <SessionProvider>{children}</SessionProvider>
    </LocalizationProvider>

  );
}

export default Provider;