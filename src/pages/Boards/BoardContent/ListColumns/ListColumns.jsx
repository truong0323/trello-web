import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import {SortableContext , horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { generatePlaceholderCard } from '~/utils/formatters'
import { createNewColumnAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

function ListColumns({columns }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [openNewColumnForm , setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const [newColumnTitle, setNewColumnTitle] = useState(' ')

  const addNewColumn = async() => {
    if(!newColumnTitle) {
      // console.error('hãy nhập column title')
      toast.error('bị lỗi vui lòng nhập đầy đủ')
      return
    }
    // console.log(newColumnTitle);
    //đóng trạng thái thêm column mới & clear Input

    //tạo dự liệu để gọi API(vd69)
    const newColumnData = {
      title: newColumnTitle
    }
    //Gọi APi tọa mới Column và làm lại dữ liệu State Board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

      //vd 70 : cần xử lý vấn đề kéo thả với column rỗng (nhứo lại vd 37.2)

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
        
    // console.log('created Colum: ',createdColumn);
    //cập nhạt state board(vd69)
    //phía front-end chúng ta phải tự làm đúng lại state databoard (thay vì phải gọi lại api fetchBoardDetailsAPI)
    
    // Đoạn này sẽ dính lỗi object is not extensible bở dù đã copy/clone ra giá trị newBoard nhưng bản chất của
    // spread operator là Shallow Copy/Clone , nên dính phải rules Immutability trong Redux Toolkit 
    // không dùng dùng được hàm Push (sửa giá trị trực tiếp của mảng) ,cách đơn giản nhanh trong th này là dùng tới 
    // Deep Cpy/Clone toàn bộ cái Board cho dễ hiểu và code đơn giản
    
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    //Cách số 2 là vẫn dùng array.concat thay thế cho push như docs của Redux Toolkit ở trên vì push như đã nói
    // nó sẽ thay đổi giá trị mảng trực tiếp .còn thằng concat thì nó merge-ghép mảng lại và 
    // tạo ra 1 mảng mới để chúng ta gán lại giá trị nên không vấn đề gì

    // const newBoard = { ...board }
    // newBoard.columns =  newBoard.columns.concat([createdColumn])
    // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createdColumn._id])
    // // setBoard(newBoard)
    // console.log(board);

    //cập  nhật dữ liệu board vào redux store
    dispatch(updateCurrentActiveBoard(newBoard))
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
        {columns?.map((column,index) => 
        <Column key = {column?._id || `temp-col-${index}`} 
        column={column} 
        />)}
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
