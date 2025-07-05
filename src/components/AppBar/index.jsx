import Box from '@mui/material/Box'
import ModeSelect from '../../components/ModeSelect'

function AppBar() {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: 'primary.light',
        width: '100%',
        height: theme.trello.appbarHeight,
        display: 'flex',
        alignItems: 'center'
      })}
    >
      <ModeSelect />
    </Box>
  )
}

export default AppBar
