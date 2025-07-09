
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext , MouseSensor,TouchSensor,PointerSensor,useSensor,useSensors,DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'


const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({board}) {
  
  const pointerSensor = useSensor(PointerSensor, {activationConstraint: {distance: 10}})
 
  //yêu cầu chuột di chuyển 10px thì mới kích hoạt event,fix trường hợp click bị event
  const mourseSensor = useSensor(MouseSensor, {activationConstraint: {distance: 10}})
  //giữ cảm ứng khoảng 250ms và dung size cảm ứng khoảng 5px mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {activationConstraint: {delay: 250 ,tolerance: 500}})
  
  // const mySensors = useSensors(pointerSensor)
  //ưu tiên sử dụng kết hợp  2 loại mouse và touch để có trải nghiệp tốt nhất ,không bị bug
  const mySensors = useSensors(mourseSensor,touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])
  //cùng một thời điểm chỉ có 1 phần tử đang được kéo là column hoặc card
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  useEffect(() => {
    if (board?.columns?.length > 0 && board?.columnOrderIds?.length > 0) {
      setOrderedColumns(mapOrder(board.columns, board.columnOrderIds, '_id'))
    } else {
      setOrderedColumns([])
    }
  }, [board])
  //Trigger khi bắt đầu kéo(drag) 1 phần tử
  const handleDragStart = (event)=>{
    // console.log('Handle DragStart:',event);
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

  }
  //trigger khi kết thúc hành động kéo(drag) 1 phần tử =>hành động thả(drop)
  const handleDragEnd = (event)=>{
    // console.log('handle DragEnd: ',event);
    const {active , over} = event
    //nếu vị trí sau khi kéo thả khác vị trí ban đầu.
    if (!over) return 
    if (active.id !== over.id )
    {
      //lấy  vị trí cũ từ avtive
      const oldIndex = orderedColumns.findIndex(c=> c._id === active.id)
      //lấy vị trí mới từ over
      const newIndex = orderedColumns.findIndex(c=> c._id === over.id)
      //mảng columns sau khi đã kéo thả:
      //dùng ArrayMove để sắp xếp lại mảng Columns ban đầu 
      const dndOrderedColumns = arrayMove(orderedColumns,oldIndex,newIndex)
      // lấy ra được id để sau lưu vòa ColumnsIds giúp k bị mất dữ liệu
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c=>c._id)

      //cập nhật lại state columns ban đầu sau khi đã kéo thả
      setOrderedColumns(dndOrderedColumns)
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }
  //Animation khi thả(drop) phần tử -Test bằng cách kéo thả trực tiếp và nhìn phần giữ chỗ Overlay
  const customDropAnimation = {
    sideEffects:defaultDropAnimationSideEffects({
      styles:{ active:{ opacity: '0.5' } }
    })
  }
  return (
    <DndContext 
      onDragEnd={handleDragEnd} 
      sensors={mySensors}
      onDragStart={handleDragStart}
    >
      <Box
        sx={ {
          bgcolor:(theme) => {
            return theme.palette.mode==='dark' ? '#34495e': '#1976d2'
          },
          width: '100%',
          height:(theme) => ( theme.trello.boardContentHeight ),
          p:'10px 0'
        }}
      >
        <ListColumns columns={orderedColumns}/>
        <DragOverlay dropAnimation = {customDropAnimation}>
          {(!activeDragItemType)&& null}
          {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN)&& <Column column={activeDragItemData}/>}
          {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD)&& <Card card={activeDragItemData}/>}
        
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
