import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Profiles from './Menus/Profiles'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
function AppBar() {
  return (
    <Box
      px={2}
      sx={(theme) => ({
        width: '100%',
        height: theme.trello.appbarHeight,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        justifyContent: 'space-between'
      })}
    >
      <Box sx={{ display:'flex', alignItems: 'center', gap:2 }}>
        <AppsIcon sx={{ color: 'primary.main' }}/>
        <Box sx={{ display:'flex', alignItems: 'center', gap:0.5 }}>
          <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color:'primary.main'}} />
          <Typography variant="span" sx={{fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main' }} >
            Trello
          </Typography>
          <Workspaces/>
          <Recent/>
          <Starred/>
          <Templates/>

          <Button variant="outlined">Create</Button>
        </Box>

      </Box>
      <Box sx={{ display:'flex', alignItems: 'center', gap:0.5 }}>
        <TextField
          id="standard-search"
          label="Search..."
          type="search"
          variant="outlined"
          size="small"
        />
        <ModeSelect />
        <Tooltip title="Notification" >
          <Badge color="secondary" variant="dot" sx={{ cursor:'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'primary.main' }}/>
          </Badge>
        </Tooltip>

        <Tooltip title="help" >
          <HelpOutlineIcon sx={{ cursor:'pointer', color: 'primary.main' }}/>
        </Tooltip>

        <Profiles/>
      </Box>
    </Box>
  )
}

export default AppBar
