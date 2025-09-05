import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
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
//cấu hình react-router-dom với BrowerRouter
import {BrowserRouter } from 'react-router-dom'
//cấu hình redux-persist
import {PersistGate} from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

//Kỹ thuật Inject Store: là kĩ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios.js
import {injectStore} from '~/utils/authorizeAxios'


injectStore(store)

//cấu hình Socket-io client tại đây và export ra biến socketIoInstance
import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constants'
export const socketIoInstance = io(API_ROOT)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename='/'>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth: 'xs' },
            confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
            cancellationButtonProps: { color: 'inherit' },
            buttonOrder: ['confirm', 'cancel']
          }}>
            <GlobalStyles styles = {{ a: { textDecoration: 'none' } }} />
            <CssBaseline />
            <App />
            <ToastContainer position='bottom-left' theme='colored'/>
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  
)

