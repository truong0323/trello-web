import Box from '@mui/material/Box'

function BoardBar() {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: 'primary.dark',
        width: '100%',
        height: theme.trello.boardbarHeight,
        display: 'flex',
        alignItems: 'center'
      })}
    >
      Board Bar
    </Box>
  )
}

export default BoardBar

