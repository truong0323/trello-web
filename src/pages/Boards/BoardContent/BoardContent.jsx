
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext , MouseSensor,TouchSensor,PointerSensor,useSensor,useSensors,DragOverlay, defaultDropAnimationSideEffects,closestCorners } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

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


  //tìm  column theo card_id : chính là id ở trên
    const findColumnByCardId =(cardId)=>{
    //đoạn này nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ 
    //làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
      return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
    }
  //Trigger khi bắt đầu kéo(drag) 1 phần tử
  const handleDragStart = (event)=>{
    // console.log('Handle DragStart:',event);
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

  }
  //Trigger trong quá trình kéo drag 1 phần tử
  const handleDragOver = (event) =>{
    //không làm gì thêm nếu đnag kéo column
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    // console.log('handle DragOver: ',event);

    //nếu kéo card thì xử lí thêm để có thể qua lại giữa các column
    const {active , over } = event
    if(!active || !over) return //nếu không tồn tịa over (điểm cần đến thì return tránh lỗi)
    //activeDragging là card đang được kéo ,còn OverCard là card sẽ được tương tác với thnawgf được kéo
    const {id: activeDraggingCardId , data: {current: activeDraggingCardData }} = active
    const {id: overCardId} = over
    
    //tìm 2 columns theo cartId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // console.log('activeColumn: ',activeColumn);
    // console.log('orderColumn:', orderColumn);

    //neeus k tôn tại 1 trong 2 column thì return để tránh crash web
    if(!activeColumn || !overColumn) return
    
    //Xữ lí Logic ở đây chỉ khi kéo card qua lại 2 columns khác nhau 
    // còn kéo card trong chính column ban đầu thì không làm gì cả
    // vì ở đây đnag là đoạn xử lý lúc kéo(handleDragOver),còn xử lý 
    // lúc kéo xong cuôi thì nó lại là vấn đề khác ở (handleDragEnd)
    if(activeColumn._id !== overColumn._id){
      // console.log('code chayj');
      setOrderedColumns(prevColumns =>{

        //Tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp đưucoj thả)
        const overCardIndex = overColumn?.cards?.findIndex(card=>card._id === overCardId)
        
        //logic tính tính " cardindex mới "(trên dưới của overcard) lấy chuẩn code từ thư viện 

        let newCardIndex
        const isBeloOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBeloOverItem?1:0
        newCardIndex = overCardIndex >=0 ? overCardIndex+ modifier: overColumn.cards.length+1 
        //clone mảng OrderedColumnsState cũ ra 1 cái mới để xử lí data rồi return -cập nhật lại
        //OrderedColumnsState mới
        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
        //nextActiveColumn: column cũ
        if(nextActiveColumn){
          //Xóa Card ở các column active(cũng có thể hiểu là column cũ ,cái lúc mà kéo card ra khỏi nó để sang column khác)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          //cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }
        //nextoverColumn: Column mới
        if(nextOverColumn){
          //Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa ,nếu có thì xóa nó trước
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          //tiếp theoo là thêm cái card đang kéo vòa overColumn theo vi trí index mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex , 0 ,activeDraggingCardData)
         
          //cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          
         nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        return nextColumns
      })

    }


  }
  //trigger khi kết thúc hành động kéo(drag) 1 phần tử =>hành động thả(drop)
  const handleDragEnd = (event)=>{
    // console.log('handle DragEnd: ',event);
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD){
     // console.log('đây là thanh kéo thả Cảd - tạm thời k làm gì');
      return ;
    }

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
      //cảm biến
      sensors={mySensors}

      //Thuật toán phát hiện va chạm (nếu không có nó thì cảd với cover lớn sẽ không kéo qua Cloumn khác được
      // vì lúc này nó đang bị conflict giưuax(card và column) ,chúng ta sẽ cùng closestCorners thay vì ClossetCenter )
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd} //đây là hành động bắt đầu khi nhấn 
      onDragOver = {handleDragOver} //đây là hành động ở giữa(quá trình kéo thả)
      
      onDragStart={handleDragStart}//đây là hành động khi thả
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
