import { BorderColor } from '@mui/icons-material'
import { teal,red, deepOrange, cyan, orange } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  // ✅ Prefix cho CSS Variables (tự động tạo biến màu như `--mui-palette-primary-main`)
  cssVarPrefix: 'mui',

  // ✅ Đây là cấu trúc theme mới cho dark/light
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: teal[500]
        },
        secondary: deepOrange
      }
    },
    dark: {
      palette: {
        primary: {
          main: cyan[500]
        },
        secondary: orange
      }
    }
  },

  // ✅ Custom variables riêng của bạn (appbarHeight, v.v.)
  trello: {
    appbarHeight: '58px',
    boardbarHeight: '60px'
  },
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          textTransform: 'none'
        }
      }
    },
    
    MuiInputLabel:{
      styleOverrides: {
        // Name of the slot
        root: ({theme})=> ({
          color: theme.palette.primary.main,
          fontSize:'0.875rem'
        })
      }
    },
    MuiOutlinedInput:{
      styleOverrides: {
        
        root: ({ theme }) => {
          return {
            color: theme.palette.primary.main,
            fontSize: '0.875rem',
            '.MuiOutlinedInput-notchedOutline':{
              borderColor: theme.palette.primary.light
            },
            '&:hover':{
              '.MuiOutlinedInput-notchedOutline':{
                borderColor: theme.palette.primary.main
              }
            },
            '& fieldset':{
              borderWidth:'1px !important' //bỏ cái nháy trên thanh search khi bấm
            }
          }
        }
      }
    }
    

  }
})

export default theme

