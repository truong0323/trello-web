// boardsDetails

import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

import { mockData } from '~/apis/mock-data'

import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'
import { Sledding } from '@mui/icons-material'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
function Board() {
  const [board , setBoard ] = useState(null)
  useEffect( () => {
    //Tam thời fick cứng boardId chuẩn chỉnh về sau khi học nâng cao trực tiếp là sử dụng react-router-dom để lấy boardId từ URL

    const boardId = '687a4e1419077f7ff489e057'
    //Call API
    fetchBoardDetailsAPI(boardId).then( board => {
      console.log('API DATA:', board)
      //vd 70 : khi f5 trang web cần xử lý vấn đề kéo thả với column rỗng (nhứo lại vd 37.2)
      board.columns.forEach(column => {
        if(isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
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
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }


    setBoard(newBoard)

    

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
          />
        </>
      
    </Container>
  )
}

export default Board
