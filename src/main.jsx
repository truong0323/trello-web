import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
//cấu hình react-toátify
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
//vd 74: caasu hinhf dialog
import { ConfirmProvider } from 'material-ui-confirm'

import theme from '~/theme'
import {store} from '~/redux/store'
import { Provider } from 'react-redux'
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <CssVarsProvider theme={theme}>
      <ConfirmProvider defaultOptions={{
        allowClose: false,
        dialogProps: { maxWidth: 'xs' },
        confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
        cancellationButtonProps: { color: 'inherit' },
        buttonOrder: ['confirm', 'cancel']
      }}>
        <CssBaseline />
        <App />
        <ToastContainer position='bottom-left' theme='colored'/>
      </ConfirmProvider>
    </CssVarsProvider>
  </Provider>
)

