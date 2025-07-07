// import { BorderColor, Height } from '@mui/icons-material'
// import { teal,red, deepOrange, cyan, orange } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  // ✅ Prefix cho CSS Variables (tự động tạo biến màu như `--mui-palette-primary-main`)
  cssVarPrefix: 'mui',

  // ✅ Đây là cấu trúc theme mới cho dark/light
  colorSchemes: {
    light: {}, dark: {}
  },

  // ✅ Custom variables riêng của bạn (appbarHeight, v.v.)
  trello: {
    appbarHeight: '58px',
    boardbarHeight: '60px'
  },
  components: {
    MuiCssBaseline:{
      styleOverrides:{
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height:'8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white',
            borderRadius: '8px'
          }
        }
      }
    },

    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          textTransform: 'none',
          borderWidth: '0.5px',
          '&:hover':{
            borderWidth: '0.5px',
          }
        }
      }
    },
    
    MuiInputLabel:{
      styleOverrides: {
        root: { fontSize:'0.875rem' }
      }
    },
    MuiOutlinedInput:{
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset':{
            borderWidth:'0.5px !important' //bỏ cái nháy trên thanh search khi bấm
          },
          '&:hover fieldset':{
            borderWidth:'2px !important' //bỏ cái nháy trên thanh search khi bấm
          },
          '&.Mui-focused fieldset':{
            borderWidth:'2px !important' //bỏ cái nháy trên thanh search khi bấm
          }
        }
      }
    }

  }
})

export default theme

