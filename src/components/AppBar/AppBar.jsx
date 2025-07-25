import { useState } from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
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
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

function AppBar() {
  const [searchValue , setSearchValue] = useState('')
  return (
    <Box
      px={2}
      sx={(theme) => ({
        width: '100%',
        height: theme.trello.appbarHeight,
        display: 'flex',
        alignItems: 'center',
        
        justifyContent: 'space-between',
        gap:2,
        overflowX:'auto',
        bgcolor:(theme) => {
          return theme.palette.mode==='dark' ? '#2c3e50': '#1565c0'
        }
      })}
    >
      <Box sx={{ display:'flex', alignItems: 'center', gap:2 }}>
        <AppsIcon sx={{ color: 'white' }}/>
        <Box sx={{ display:'flex', alignItems: 'center', gap:0.5 }}>
          <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color:'white'}} />
          <Typography variant="span" sx={{fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }} >
            Trello
          </Typography>
          <Box sx={{ display:{ xs:'none', md: 'flex' }, gap:1}}>
            <Workspaces/>
            <Recent/>
            <Starred/>
            <Templates/>
            <Button
              sx={{ color: 'white',
                border:'none',
                '&:hover': {border: 'none' }
               }}
              variant="outlined" 
              startIcon={<LibraryAddIcon/>}
            >Create
            </Button>
          </Box>
        </Box>

      </Box>
      <Box sx={{ display:'flex', alignItems: 'center', gap:0.5 }}>
        <TextField
          id="standard-search"
          label="Search..."
          type="text" //type="search" sẽ tự động có dấu x đăng sau
          variant="outlined"
          size="small"
          value = {searchValue}
          onChange={(e)=> setSearchValue(e.target.value)}
          InputProps={
            {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{color: 'white'}}/>
                </InputAdornment>
              ),
              endAdornment:(
                <InputAdornment position='end'>
                  <CloseIcon
                    fontSize='small'
                    sx={{color: searchValue? 'white' : 'transparent', cursor:'pointer'}}

                    onClick={()=>setSearchValue('')}
                  />
                </InputAdornment>
              )
            }
          }
          sx={{
            minWidth: 120,
            maxWidth: '170px',
            '& label':{color:'white'},
            '& input':{color:'white'},
            '& label.Mui-focused':{color:'white'},
            '& .MuiOutlinedInput-root':{
              '& fieldset':{
                borderColor: 'white'
              },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset':{borderColor: 'white'}
            }
          }}
        />
        <ModeSelect />
        <Tooltip title="Notification" >
          <Badge color="warning" variant="dot" sx={{ cursor:'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'white' }}/>
          </Badge>
        </Tooltip>

        <Tooltip title="help" >
          <HelpOutlineIcon sx={{ cursor:'pointer', color: 'white' }}/>
        </Tooltip>

        <Profiles/>
      </Box>
    </Box>
  )
}

export default AppBar
