import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import {SortableContext , horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
function ListColumns({columns}) {
  const [openNewColumnForm , setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  
  const [newColumnTitle, setNewColumnTitle] = useState(' ')

  const addNewColumn = () => {
    if(!newColumnTitle) {
      // console.error('hãy nhập column title')
      toast.error('bị lỗi vui lòng nhập đầy đủ')
      return
    }
    // console.log(newColumnTitle);
    //đóng trạng thái thêm column mới & clear Input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')

  }
  return (
    <SortableContext items={columns?.map(c=> c._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          bgcolor: 'inherit', // kế thừa background của thằng ngoài cùng
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 } // để cho thanh kéo bên dưới không sát lề trái phải
        }}
      >
        {/* Hiển thị danh sách columns */}
        {columns?.map(column => <Column key = {column._id} column={column}/>)}
        {/* nút thêm column */}
        {!openNewColumnForm
          ? <Box onClick ={toggleOpenNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button
              sx={{ 
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
              startIcon ={<NoteAddIcon/>}
            >
                Add New Column
            </Button>
          </Box>

          : <Box 
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              display: 'flex',
              bgcolor: '#ffffff3d',
              flexDirection: 'column',
              gap: 1
            }}>
              <TextField
              label="Enter column title.."
              type="text" //type="search" sẽ tự động có dấu x đăng sau
              variant="outlined"
              size="small"
              autoFocus
              value = {newColumnTitle}
              onChange={(e)=> setNewColumnTitle(e.target.value)}
              
              sx={{
                minWidth: '180px',
                maxWidth: '190px',
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
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap:1
            }}>
              <Button
                onClick={addNewColumn}
                variant="contained" color="success" size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main ,
                  '&: hover': {bgcolor: (theme)=> theme.palette.success.main}
                }}
              >Add column</Button>
              <CloseIcon
                    fontSize='small'
                    sx={{color: 'white' , cursor:'pointer'}}

                    onClick={toggleOpenNewColumnForm}
                  />
            </Box>
            
          </Box>
        }
        
      </Box>
    </SortableContext>
  )
}

export default ListColumns
