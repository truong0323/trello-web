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
import { capitalizeFirstLetter } from '~/utils/formatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
const MENUS_STYLE = {
  color: 'white',
  bgcolor:'transparent',
  border: 'none',
  paddingX:'5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root':{
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }

}

function BoardBar({ board }) {
  // const board = props.board
  // const{board} = props

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
        
        bgcolor:(theme) => {
          return theme.palette.mode==='dark' ? '#34495e': '#1976d2'
        }
      })}
    >
      <Box sx={{ display:'flex', alignItems: 'center', gap:2 }}>
        <Tooltip title={board?.description}>
          <Chip 
            sx={MENUS_STYLE}
            icon={<DashboardIcon/>}
            label={capitalizeFirstLetter(board?.title)}
            clickable
          />
        </Tooltip>
        <Chip 
          sx={MENUS_STYLE}
          icon={<VpnLockIcon/>}
          label={capitalizeFirstLetter(board?.type)}
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

        {/* xử lí mời user vào làm thành viên của board */}
        <InviteBoardUser boardId={ board._id}/>
        {/* Xử lí hiển thị danh sách thành viên của board */}
        <BoardUserGroup  boardUsers={board?.FE_allUsers}/>
      </Box>
    </Box>
  )
}

export default BoardBar

