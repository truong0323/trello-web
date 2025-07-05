import Box from '@mui/material/Box'

function BoardContent(props) {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: 'primary.main',
        width: '100%',
        height: `calc(100vh - ${theme.trello.appbarHeight} - ${theme.trello.boardbarHeight})`,
        display: 'flex',
        alignItems: 'center'
      })}
    >
      Board Content
    </Box>
  )
}

export default BoardContent
