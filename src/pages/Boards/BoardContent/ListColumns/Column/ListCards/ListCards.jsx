import Box from '@mui/material/Box'
import Card from './Card/Card'
import {SortableContext , verticalListSortingStrategy } from '@dnd-kit/sortable'

function ListCards({cards}) {
  const isEmpty = !cards || cards.length === 0
  return (
    <SortableContext items={cards?.map(c=> c._id)} strategy={verticalListSortingStrategy}>
      <Box
        sx={{
          p: '0 5px 5px 5px',
          m: '0 5px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: (theme) =>
            `calc(
              ${theme.trello.boardContentHeight} - 
              ${theme.spacing(5)} - 
              ${theme.trello.columnHeaderHeight} - 
              ${theme.trello.columnFooterHeight}
            )`,
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' },
          border: isEmpty ? '2px dashed rgba(255,255,255,0.3)' : 'none',
          minHeight: '40px', // luôn có một vùng drop
          borderRadius: '4px'
        
        }}
      >
        {/* phần nội dung Cart hay list cart*/}
        {isEmpty ? (
          <Box sx={{ textAlign: 'center', color: 'gray', fontSize: '0.8rem' }}>
            Drop here
          </Box>
        ) : (
          cards.map(card => <Card key={card._id} card={card} />)
        )}
      </Box>
    </SortableContext>
  )
}

export default ListCards
