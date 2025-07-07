import Box from '@mui/material/Box'

function BoardContent(props) {
  return (
    <Box
      sx={(theme) => ({
        bgcolor:(theme) => {
          return theme.palette.mode==='dark' ? '#34495e': '#1976d2'
        },
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
