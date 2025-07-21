import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
//cấu hình react-toátify
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import theme from '~/theme'
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <App />
      <ToastContainer position='bottom-left' theme='colored'/>
    </CssVarsProvider>
  // </React.StrictMode>
)

