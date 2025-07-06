import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENUS_STYLE = {
  color: 'primary.main',
  bgcolor:'white',
  border: 'none',
  paddingX:'5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root':{
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }

}

function BoardBar() {
  return (
    <Box px={2}
      sx={(theme) => ({
        
        width: '100%',
        height: theme.trello.boardbarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap:2,
        overflowX:'auto',
        borderTop:'1px solid #00bfa5',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      })}
    >
      <Box sx={{ display:'flex', alignItems: 'center', gap:2 }}>
        <Chip 
          sx={MENUS_STYLE}
          icon={<DashboardIcon/>}
          label="truong0323 MERN stack" 
          clickable
        />
        <Chip 
          sx={MENUS_STYLE}
          icon={<VpnLockIcon/>}
          label="Public/Private Workspace" 
          clickable
        />
        <Chip 
          sx={MENUS_STYLE}
          icon={<AddToDriveIcon/>}
          label="Add to Google Drive" 
          clickable
        />
        <Chip 
          sx={MENUS_STYLE}
          icon={<BoltIcon/>}
          label="Automation" 
          clickable
        />
        <Chip 
          sx={MENUS_STYLE}
          icon={<FilterListIcon/>}
          label="Filter" 
          clickable
        />
        
          
      </Box>
      <Box sx={{ display:'flex', alignItems: 'center', gap:2 }}>
        <Button variant="outlined" startIcon={ <PersonAddIcon/> }>Invite</Button>
        <AvatarGroup max={7}
        sx={{
          '& .MuiAvatar-root': {
            width: 34,
            height: 34,
            fontSize: '16px'
          }
        }}
        >
          <Tooltip title="Lê Mạnh trường">
            <Avatar alt="Trevor Henderson" 
              src="/static/images/avatar/5.jpg" />
          </Tooltip>
          
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar

