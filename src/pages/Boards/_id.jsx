// boardsDetails

import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sorts'
import CircularProgress from '@mui/material/CircularProgress';

import { useEffect, useState } from 'react'
import { 
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI

} from '~/apis'
import { Sledding } from '@mui/icons-material'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { Box, Typography } from '@mui/material'

function Board() {
  const [board , setBoard ] = useState(null)
  useEffect( () => {
    //Tam thời fick cứng boardId chuẩn chỉnh về sau khi học nâng cao trực tiếp là sử dụng react-router-dom để lấy boardId từ URL

    const boardId = '687a4e1419077f7ff489e057'
    //Call API
    fetchBoardDetailsAPI(boardId).then( board => {
      console.log('API DATA:', board)
      //sắp xếp thứ tự các column luôn ở đây trước khi đưa xuống bên dưới các componment con (vd71)
      board.columns = mapOrder(board.columns,board.columnOrderIds,'_id') 


      board.columns.forEach(column => {
        //vd 69 : khi f5 trang web cần xử lý vấn đề kéo thả với column rỗng (nhứo lại vd 37.2)
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
        else{
          //sắp xếp thứ tự các cards luôn ở đây trước khi đưa xuống bên dưới : vd71
          column.cards = mapOrder(column.cards,column.cardOrderIds, '_id')
        }

      })
      console.log(board);
      setBoard(board)
    })
    
  }, [])
  //vd68 : function này có nhiệm vụ gọi API tạo mới column và (quantrong)làm lại dữ liệu stateBoard
  const createNewColumn = async( newColumnData) => {
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
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
    // console.log(board);
  }
    //vd68 : function này có nhiệm vụ gọi API tạo mới card và (quantrong)làm lại dữ liệu stateBoard
  const createNewCard = async( newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    })
    
    // console.log('created card: ',createdCard);
    const newBoard = { ...board }
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


    setBoard(newBoard)

    

  }
  //vd:70 function này có nhiệm vụ gọi Api và xử lí khi kéo thả column xong xuôi
  //chỉ cần gọi API để cập nhật mảng OrderColumnIds của board chứa nó

  const moveColumns =  (dndOrderedColumns ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c=>c._id)
    const newBoard = { ...board }
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)
    // Gọi API update board
    updateBoardDetailsAPI(newBoard._id , { columnOrderIds: dndOrderedColumnsIds })
  }

  //khi di chuyển card trong cùng Column:
  //chỉ cần gọi API để cập nhật cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
  const moveCardInTheSameColumn = (dndOrderedCards , dndOrderedCardIds , columnId) => {
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if(columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

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
          setBoard(newBoard)

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
            createNewColumn = {createNewColumn}
            createNewCard = {createNewCard}
            moveColumns = {moveColumns}
            moveCardInTheSameColumn={moveCardInTheSameColumn}
            moveCardToDifferentColumn = {moveCardToDifferentColumn}
          />
        </>
      
    </Container>
  )
}

export default Board
