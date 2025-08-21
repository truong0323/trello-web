import React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'

// ✅ Thêm các icon còn thiếu
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import { useSelector,useDispatch } from 'react-redux'
import { selectCurrentUser ,logoutUserAPI} from '~/redux/user/userSlice'
import { useConfirm } from 'material-ui-confirm'


function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const confirmLogout =useConfirm()

  const handleLoggout = () => {
    confirmLogout({
      title: 'Bạn có chắc chắn muốn đăng xuất không',
      confirmationText: 'Đồng ý ',
      cancellationText: 'Hủy'
    }).then(() => {
      //thực hiện gọi API logout
      dispatch(logoutUserAPI())
    }).catch(() => {})

  }
  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          id="basic-button-profiles"
          onClick={handleClick}
          size="small"
          sx={{ p: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt="truong0323"
            src= {currentUser?.avatar}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClick={handleClose}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button-profiles',
          },
        }}
      >
        <MenuItem onClick={handleClose} sx={{ 
          '&:hover' : {
            color: 'success.light'
          } 
        }}>
          <ListItemIcon>
            <Avatar sx={{ width: 28,mr:2, height: 28 }} alt="Le manh truong" src={currentUser?.avatar}/>
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem >
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLoggout} sx={{
          '&:hover' : {
            color: 'warning.dark',
            '& .loggout-icon': {color: 'warning.dark'}
          } 
        }}>
          <ListItemIcon>
            <Logout fontSize="small"  className='loggout-icon'/>
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles
