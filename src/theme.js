import { teal, deepOrange, cyan, orange } from '@mui/material/colors'
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
    appbarHeight: '48px',
    boardbarHeight: '58px'
  }
})

export default theme

