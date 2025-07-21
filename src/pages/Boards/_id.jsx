// boardsDetails

import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

import { mockData } from '~/apis/mock-data'

import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'
function Board() {
  const [board , setBoard ] = useState(null)
  useEffect( () => {
    //Tam thời fick cứng boardId chuẩn chỉnh về sau khi học nâng cao trực tiếp là sử dụng react-router-dom để lấy boardId từ URL

    const boardId = '687a4e1419077f7ff489e057'
    //Call API
    fetchBoardDetailsAPI(boardId).then( board => {
      console.log('API DATA:', board)
      setBoard(board)
    })
    
  }, [])
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: '100vh', backgroundColor: 'primary.main' }}
    >
      <AppBar/>

      {/* Chỉ render khi board đã load xong */}
      
        <>
          <BoardBar board={mockData.board} />
          <BoardContent board={mockData.board} />
        </>
      
    </Container>
  )
}

export default Board
