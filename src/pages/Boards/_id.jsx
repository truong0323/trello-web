// boardsDetails

import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar'
import BoardBar from './BoardBar'
import BoardContent from './BoardContent'
function Board() {
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: '100vh', backgroundColor: 'primary.main' }}
    >
      {/* App Bar */}
      <AppBar/>

      {/* Board Bar */}
      <BoardBar/>

      {/* Board Content */}
      <BoardContent/>
    </Container>
  )
}

export default Board
