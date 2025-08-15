import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentPaste from '@mui/icons-material/ContentPaste'
import ContentCopy from '@mui/icons-material/ContentCopy'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Box from '@mui/material/Box'
import ListCards from './ListCards/ListCards'
import theme from '~/theme'
import { mapOrder } from '~/utils/sorts'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
//vd: 74
import { useConfirm } from 'material-ui-confirm'
import { createNewCardAPI, deleteColumnDetailsAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import {  useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

function Column({column}) {

  //code của phần useSortable và css
  const { attributes, listeners, setNodeRef, transform, transition,isDragging} = useSortable( {
    id: column._id,
    data: {...column}
  } )
  
  const dndKitColumnStyles = {
    // touchAction: 'none',// dành cho sessor default dạng pointer
    transform: CSS.Translate.toString(transform),
    transition,

    //Chiều cao phải luôn max :100% nếu không sẽ lỗi lúc
    //kéo column ngắn qua 1 cái column dài thì phải kéo ở khu vự giữ rất khó chịu
    // Lưu ý phải kết hợp với {..listenmer} nằm ở Boxx
    //chứu k phải ở div ngoài cùng tránh kéo vào nền xnah vẫn lướt
    height: '100%',
    opacity: isDragging ? 0.5 : undefined //khi kéo thì sẽ mờ thằng được kéo
  }
  //code khi lấy biến từ list content
  //đây là biến đã cards đã được mapOrder ở board/_id.jsx(vd71)
  const orderedCards= column.cards

  //code của dropdown menu
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    
  }

  const handleClose = () => {
    setAnchorEl(null)
  }


  //vd64
    const [openNewCardForm , setOpenNewCardForm] = useState(false)
    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
    
    const [newCardTitle, setNewCardTitle] = useState('')
    const dispatch=useDispatch()
    const board = useSelector(selectCurrentActiveBoard)

    const addNewCard = async() => {
      if(!newCardTitle) {
        // console.error('hãy nhập Card title')
        toast.error('Please enter Cart title', {position: 'bottom-right'})
        return
      }
      //vd 69
      const newCardData = {
        title:newCardTitle,
        columnId : column._id
      }
      // Gọi Api tạo mới card và làm lại duwx liệu state Board
      // createNewCard(newCardData)
      const createdCard = await createNewCardAPI({
            ...newCardData,
            boardId: board._id,
          })
          
          // console.log('created card: ',createdCard);
          // const newBoard = { ...board }
          const newBoard = cloneDeep(board)
          const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
          if(columnToUpdate) {
            //nếu column rỗng bản chất là đang chứa một cái placeholdercard (vd 37.2 ,hiện tại vd 69)
            if(columnToUpdate.cards.some(card => card.Card)) {
              columnToUpdate.cards = [createdCard]
              columnToUpdate.cardOrderIds = [createdCard._id]
            }
            else {
              columnToUpdate.cards.push(createdCard)
              columnToUpdate.cardOrderIds.push(createdCard._id)
            }
            
          }
          console.log('columnToUpdate',columnToUpdate);
      
          // setBoard(newBoard)
          dispatch(updateCurrentActiveBoard(newBoard))

      // console.log(newCardTitle);
      //đóng trạng thái thêm Card mới & clear Input
      toggleOpenNewCardForm()
      setNewCardTitle('')
  
    }

    const confimDeleteColumn = useConfirm()

    //xử lí xóa 1column và cards trong nó
    const handleDeleteColumn = () => {
      confimDeleteColumn({
        title: 'Delete Column? ',
        description: 'Hành động này sẽ xóa vĩnh viễn column của bạn ,bạn chắc chưa!!',
        
        
        // description: 'Hành động này sẽ xóa vĩnh viễn column của bạn ,bạn chắc chưa!!',
        // confirmationKeyword: 'truong0323'
      
      }).then(() => {
      //update cho chuẩn dữ liệu state Board
      // console.log('columnId :',column._id);
      const newBoard = { ...board }
      newBoard.columns = newBoard.columns.filter(c => c._id !== column._id) 
      newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== column._id)
      // setBoard(newBoard)
      dispatch(updateCurrentActiveBoard(newBoard))
      //xử lí dữ liệu phía backend
      deleteColumnDetailsAPI(column._id).then(res => {
        toast.success(res?.deleteResult)
        // console.log('res-from deleteColumndetaiAPI: ',res);
      })
    })
      .catch(() => {
        
      })
      
    }


  return (
    //phải bọc div ở ngoài để fix bug kéo k mượt phải kéo ở giữa
    <div 
      ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}
      
    >
      <Box
        {...listeners}
        sx={(theme) => ({
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
        })}
        
      >
        {/* Header */}
        <Box
          sx={{
            height: theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-column-dropdown',
                }
              }}
            >
              <MenuItem
                onClick={toggleOpenNewCardForm}
                sx={{
                  '&:hover' : {
                    color: 'success.light',
                    '& .add-card-icon': {color: 'success.light'}
                  }
                }}
              >
                <ListItemIcon>
                  <AddCardIcon  className='add-card-icon' fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new Card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': {color: 'warning.dark'}
                  }
                }}
              >
                <ListItemIcon>
                  <DeleteForeverIcon className='delete-forever-icon' fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Body */}
        <ListCards cards={orderedCards}/>

        {/* Footer */}
        <Box
          sx={{
            height: theme.trello.columnFooterHeight,
            p: 2
            
          }}
        >
          {!openNewCardForm
          ?<Box sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1
          }}>
            <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add new card</Button>
            <Tooltip title="Drag to move">
              <DragHandleIcon sx={{ cursor: 'pointer' }} />
            </Tooltip>
          </Box>
          : <Box sx={{ 
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <TextField
              label="Enter card title.."
              type="text" //type="search" sẽ tự động có dấu x đăng sau
              variant="outlined"
              size="small"
              autoFocus
              data-no-dnd = "true" ///video 64.1
              value = {newCardTitle}
              onChange={(e)=> setNewCardTitle(e.target.value)}
              
              sx={{
                
                '& label':{color:'text.primary'},
                '& input':{color:(theme) => theme.palette.primary.main,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643': 'white')

                },
                '& label.Mui-focused':{color: (theme) => theme.palette.primary.main},
                '& .MuiOutlinedInput-root':{
                  '& fieldset':{
                    borderColor: (theme) => theme.palette.primary.main
                  },
                  '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main},
                  '&.Mui-focused fieldset':{borderColor: (theme) => theme.palette.primary.main}
                },
                '& .MuiOutlinedInput-input': {
                  borderRadius: 1
                }
              }}
            />
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap:1
            }}>
              <Button
                onClick={addNewCard}
                variant="contained" color="success" size='small'
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main ,
                  '&: hover': {bgcolor: (theme)=> theme.palette.success.main}
                }}
              >Add</Button>
              <CloseIcon
                    fontSize='small'
                    sx={{color: (theme) => theme.palette.warning.light, cursor:'pointer'}}

                    onClick={toggleOpenNewCardForm}
                  />
            </Box>
          </Box>
          }
          
        </Box>
      </Box>
    </div>
  );
}

export default Column;
