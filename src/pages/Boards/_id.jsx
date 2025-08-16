// boardsDetails

import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import CircularProgress from '@mui/material/CircularProgress';

import { useEffect } from 'react'
import { 
  
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,

} from '~/apis'
import { cloneDeep } from 'lodash'
import { Box, Typography } from '@mui/material'

import { 
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
}from '~/redux/activeBoard/activeBoardSlice'
import {useDispatch, useSelector} from 'react-redux'

import {useParams} from 'react-router-dom'
function Board() {
  const dispatch = useDispatch()
  //không dung state của component nữa mà chuyển qua dùng state của redux
  // const [board , setBoard ] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)

  const { boardId } =  useParams()

  useEffect( () => {
    //Call API
    dispatch(fetchBoardDetailsAPI(boardId))
    
    
  }, [dispatch,boardId])
  
  
  //vd:70 function này có nhiệm vụ gọi Api và xử lí khi kéo thả column xong xuôi
  //chỉ cần gọi API để cập nhật mảng OrderColumnIds của board chứa nó

  const moveColumns =  (dndOrderedColumns ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c=>c._id)
    //Trường hợp Spread Operator thì lại không sao bởi vì ở đây chúng ta khoong push như ở trên
    // làm thay đổi trực tiếp kiểu mở rộng mảng ,mà chỉ đang gán lại toàn bộ giá trị columns và columnOrderIds
    // bằng 2 mảng mới .Tương tự như cách làm concat ở trường hợp createNewCOlumn thôi
    const newBoard = { ...board }
    newBoard.columns= dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))
    // setBoard(newBoard)
    // // Gọi API update board
    updateBoardDetailsAPI(newBoard._id , { columnOrderIds: dndOrderedColumnsIds })
  }

  //khi di chuyển card trong cùng Column:
  //chỉ cần gọi API để cập nhật cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
  const moveCardInTheSameColumn = (dndOrderedCards , dndOrderedCardIds , columnId) => {
    // const newBoard = { ...board }
    //Trường hợp này đnag cloneDeeep vì Immutabbility ở đây đã đụng tới giá trị cards đnag được coi là read only-(nested object -can thiệp sau dữ liệu)
    const newBoard  = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if(columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    updateColumnDetailsAPI(columnId , {cardOrderIds: dndOrderedCardIds})
  }

  // khi di chuyển card sang column khác chúng ta  có 3 bước:
  // b1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (hiểu bản chất là xóa cái _id của Card ra khỏi mảng)
  // b2: Cập nhật mảng cardOrderIds của Column  tiếp theo (là thêm _id của Card vào mảng )
  // b3: cập nhật lại trường columnId của cái Card đã kéo 
  // => làm 1 API support riêng
  // -----------------------------
  //currentCardId: card chungs ta đang kéo
  // prevColumnId:column ban đầu
  // nextColumnId: column lúc sau
  const moveCardToDifferentColumn = ( currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
          console.log('moveCardToDifferentColumn - currentCardId',currentCardId);
          console.log('moveCardToDifferentColumn - prevColumnId',prevColumnId);
          console.log('moveCardToDifferentColumn - nextColumnId',nextColumnId);
          console.log('moveCardToDifferentColumn - dndOrderedColumns',dndOrderedColumns);
          //update cho chuẩn dữ liệu state Board
          const dndOrderedColumnsIds = dndOrderedColumns.map(c=>c._id)
          const newBoard = { ...board }
          newBoard.columns = dndOrderedColumns 
          newBoard.columnOrderIds = dndOrderedColumnsIds
          // setBoard(newBoard)
          dispatch(updateCurrentActiveBoard(newBoard))

          //gọi API xử lý dữ liệu Backend'
          // vd: 73
          let prevCardOrderIds =  dndOrderedColumns.find(c => c._id ===prevColumnId)?.cardOrderIds
          // console.log('prevCardOrderIds' , prevCardOrderIds); 
        //xử lí vấn đề khi kéo phần tử cuối cùng ra khỏi column,khi đó prevCardOrderIds sẽ có 'placeholder-card' ,cần xóa nó trước khi gửi dữ liệu lên cho phía baken
          if( prevCardOrderIds[0].includes('placeholder-card')) { prevCardOrderIds = [] }
          moveCardToDifferentColumnAPI({
            currentCardId,
            prevColumnId,
            prevCardOrderIds,
            nextColumnId,
            nextCardOrderIds:dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
          })
          //end: 73
  }
  

  if( !board) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center',justifyContent: 'center', gap: 2, width: '100vw' , height: '100vh' }}>
        <CircularProgress />
        <Typography>...LoadingBoard</Typography>
      </Box>
    )
  }

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: '100vh', backgroundColor: 'primary.main' }}
    >
      <AppBar/>

      {/* Chỉ render khi board đã load xong */}
      
        <>
          <BoardBar board={board} />
          <BoardContent 
            board={board} 

            // createNewColumn = {createNewColumn}
            // createNewCard = {createNewCard}
            // deleteColumnDetail= {deleteColumnDetail}

            //3 cái trường hợp move di chuyển thì giữ nguyên code ở phần BoardContent không bị
            //quá dài mất kiểm soát khi đọc code ,maintain 
            //vì chỉ đi từ _id xuống 1 cấp nên không có quá nhiều vấn đề
            moveColumns = {moveColumns}
            moveCardInTheSameColumn={moveCardInTheSameColumn}
            moveCardToDifferentColumn = {moveCardToDifferentColumn}
          />
        </>
      
    </Container>
  )
}

export default Board
