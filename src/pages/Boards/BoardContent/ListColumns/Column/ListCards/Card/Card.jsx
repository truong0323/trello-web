import React from 'react'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import avatar from '~/assets/avatarmeo.jpg'
import GroupIcon from '@mui/icons-material/Group'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import { Opacity } from '@mui/icons-material'

function Card({ card }) {
  const { attributes, listeners, setNodeRef, transform, transition,isDragging} = useSortable( {
      id: card._id,
      data: {...card}
    } )
    
    const dndKitCardStyles = {
      // touchAction: 'none',// dành cho sessor default dạng pointer
      transform: CSS.Translate.toString(transform),
      transition,
      opacity: isDragging? 0.5:undefined,
      border: isDragging? '1px solid #2ecc71': undefined
    };

  const shouldShowCardAction = ()=>{
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.AttachmentIcon?.length
  }
  return (
    <MuiCard
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}

      sx={{
        cursor: 'pointer',
        overflow: 'unset',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        opacity: card?.FE_Placeholder ? '0' : '1',
        border: '1px solid transparent',
        '&:hover': { borderColor : (theme) =>  theme.palette.primary.main}

      }}
    >
      {card?.cover&&
        <CardMedia sx={{ height: 140 }} image={card?.cover} />
      }
      
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>
      {shouldShowCardAction()&&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length &&  
            <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button> 
          }
          {!!card?.comments?.length &&  
          <Button size="small" startIcon={<CommentIcon />}>
          {card?.comments?.length}
          </Button>
          }
          {!!card?.attachments?.length &&  
          <Button size="small" startIcon={<AttachmentIcon />}>
            {card?.attachments?.length}
          </Button>
          }
          
        </CardActions>
      }
    </MuiCard>
  )
}

export default Card
