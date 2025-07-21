import React, { useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // MouseSensor,
  // TouchSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  closestCenter
  

} from '@dnd-kit/core'
import { MouseSensor , TouchSensor } from '~/customLibraries/DndKitSensors'

import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep, isEmpty} from 'lodash'
import {generatePlaceholderCard} from '~/utils/formatters'
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  //yêu cầu chuột di chuyển 10px thì mới kích hoạt event,fix trường hợp click bị event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  //giữ cảm ứng khoảng 250ms và dung size cảm ứng khoảng 5px mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  //ưu tiên sử dụng kết hợp  2 loại mouse và touch để có trải nghiệp tốt nhất ,không bị bug
  const mySensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])
  //cùng một thời điểm chỉ có 1 phần tử đang được kéo là column hoặc card
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  //điểm va chạm cuối cùng xử lí thuật toán phát hiện va chạm
  const lastOverId = useRef(null)
  // useEffect(() => {
  //   if (board?.columns?.length > 0 && board?.columnOrderIds?.length > 0) {
  //     setOrderedColumns(mapOrder(board.columns, board.columnOrderIds, '_id'))
  //   } else {
  //     setOrderedColumns([])
  //   }
  // }, [board])

  useEffect(() => {
    if (board?.columns?.length > 0) {
      // Nếu columnOrderIds rỗng thì render theo dữ liệu mặc định từ API
      if (board?.columnOrderIds?.length > 0) {
        setOrderedColumns(mapOrder(board.columns, board.columnOrderIds, '_id'))
      } else {
        setOrderedColumns(board.columns)
      }
    } else {
      setOrderedColumns([])
    }
  }, [board])

  //tìm  column theo card_id : chính là id ở trên
  const findColumnByCardId = (cardId) => {
    //đoạn này nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ 
    //làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }
  //Function chung xử lí việc cập nhật lại state trong trường hợp di chuyển card giữa các column khác nhau
  const moveCartBetweenDifferentColumns = (
    overColumn, 
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
    //Tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp đưucoj thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      //logic tính tính " cardindex mới "(trên dưới của overcard) lấy chuẩn code từ thư viện
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn.cards.length + 1

      //clone mảng OrderedColumnsState cũ ra 1 cái mới để xử lí data rồi return -cập nhật lại
      //OrderedColumnsState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
      //nextActiveColumn: column cũ
      if (nextActiveColumn) {
        //Xóa Card ở các column active(cũng có thể hiểu là column cũ ,cái lúc mà kéo card ra khỏi nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        
        //Thêm placeholder Card nếu Column rỗng :bị kéo hết card đi ,không còn cái nào nữa (video 37.2)
        if(isEmpty(nextActiveColumn.cards)){
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        //xóa placeholder đi nếu card đang tồn tại(video 37.2)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => !card.FE_PlaceholderCard)
        
        //cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      //nextoverColumn: Column mới
      if (nextOverColumn) {
        //Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa ,nếu có thì xóa nó trước
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        
        //đối với trường hợp dragEnd thì phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kêos card giữa 2 column khác nhau
        const rebuild_activeDraggingCardData = {

          ...activeDraggingCardData ,
          columnId: nextOverColumn._id
        }

        //tiếp theoo là thêm cái card đang kéo vòa overColumn theo vi trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        //cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  //Trigger khi bắt đầu kéo(drag) 1 phần tử
  const handleDragStart = (event) => {
    // console.log('Handle DragStart:',event);
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    //nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  //Trigger trong quá trình kéo drag 1 phần tử
  const handleDragOver = (event) => {
    //không làm gì thêm nếu đnag kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    // console.log('handle DragOver: ',event);

    //nếu kéo card thì xử lí thêm để có thể qua lại giữa các column
    const { active, over } = event
    if (!active || !over) return //nếu không tồn tại over (điểm cần đến thì return tránh lỗi)

    //activeDragging là card đang được kéo ,còn OverCard là card sẽ được tương tác với thnawgf được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    //tìm 2 columns theo cartId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // console.log('activeColumn: ',activeColumn);
    // console.log('orderColumn:', orderColumn);

    //neeus k tồn tại 1 trong 2 column thì return để tránh crash web
    if (!activeColumn || !overColumn) return

    //Xử lí Logic ở đây chỉ khi kéo card qua lại 2 columns khác nhau
    // còn kéo card trong chính column ban đầu thì không làm gì cả
    // vì ở đây đnag là đoạn xử lý lúc kéo(handleDragOver),còn xử lý
    // lúc kéo xong cuôi thì nó lại là vấn đề khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      // console.log('code chayj');
      
      moveCartBetweenDifferentColumns(
        overColumn, 
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        
      )
    }
  }

  //trigger khi kết thúc hành động kéo(drag) 1 phần tử =>hành động thả(drop)
  const handleDragEnd = (event) => {
    const { active, over } = event
    //nếu vị trí sau khi kéo thả khác vị trí ban đầu.
    if (!over || !active) return

    // console.log('handle DragEnd: ',event);

    //Xử lí kéo thả cart
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      //tìm 2 columns theo cartId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // console.log('activeColumn: ',activeColumn);
      // console.log('orderColumn:', orderColumn);

      //neeus k tôn tại 1 trong 2 column thì return để tránh crash web
      if (!activeColumn || !overColumn) return

      //Hnahf đông kéo thả giữa 2 columns khác nhau
      // phải dùng đến activeDragitemData.columnId hoặc olColumnWhenDraggingCard._id(set vào state từ  bước
      // handleDragStart) chứ không phải activeData trong scope handleDragEnd này vì sau khi đi
      //qua onDragOver tới đay là state của card đã bị cập nhật một lần rồi
      // console.log( 'oldColumnWhenDraggingCard:',oldColumnWhenDraggingCard);
      // console.log( 'overColumn:',overColumn);
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCartBetweenDifferentColumns(
          overColumn, 
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )

      } 
      else {
        //đây là hành động kéo thả card trong cùng 1 column
        //lấy  vị trí cũ từ oldColumnWhenDraggingCard
        const oldCartIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        //lấy vị trí mới từ overColumn
        const newCartIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        //dùng ArrayMove để sắp xếp lại mảng Cards
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCartIndex, newCartIndex)
       
        setOrderedColumns(prevColumns => {
          //clone mảng OrderedColumnsState cũ ra 1 cái mới để xử lí data rồi return -cập nhật lại
          //OrderedColumnsState mới
          const nextColumns = cloneDeep(prevColumns)
          //tìm tới column chúng ta đang thả
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)
          
          //cập nhật lại 2 gia trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
          return nextColumns
        })
      
      }
    }

    //Xử lí kéo thả Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //nếu vị trí kéo khác 
      if (active.id !== over.id) {
        //lấy  vị trí cũ từ avtive
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        //lấy vị trí mới từ over
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        //mảng columns sau khi đã kéo thả:
        //dùng ArrayMove để sắp xếp lại mảng Columns ban đầu 
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // lấy ra được id để sau lưu vòa ColumnsIds giúp k bị mất dữ liệu
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c=>c._id)

        //cập nhật lại state columns ban đầu sau khi đã kéo thả
        setOrderedColumns(dndOrderedColumns)
      }
    }
    // những dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  //Animation khi thả(drop) phần tử -Test bằng cách kéo thả trực tiếp và nhìn phần giữ chỗ Overlay
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } }
    })
  }
  //args: arguments : các đối số ,tham số
  const collisionDetectionStrategy = useCallback((args)=> {
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN){
      return closestCorners({...args})
    }

    //tìm các điểm giao nhau va chạm -intersections với con trỏ
    const pointerInterSections = pointerWithin(args)

    if(!pointerInterSections?.length){
      return
    }
    // thuật toán phát hiện va chạm sẽ trả về 1 mảng va chạm ở đây
    // const interSections = !!pointerInterSections?.length  ?pointerInterSection: rectIntersection(args)
    // //tìm over đầu tiên trong đám pointerInterSections ở trên
    let overId = getFirstCollision(pointerInterSections,'id')
    if(overId){
      //video 37: đoạn này để fix cái vụ flickering 
      //nếu cái over nó là column thì sẽ tới cái cardId gần nhất trong khu vực va chạm đó dựa vào
      //thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được 

      const checkColumn = orderedColumns.find(column => column.id === overId)
      if(checkColumn){
        const filteredContainers = args.droppableContainers.filter(container => {
          return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
        })

        overId = closestCorners({
          ...args,
          droppableContainers: filteredContainers
        })?.[0]?.id
      }
      lastOverId.current = overId
      return [{ id : overId}]
    }
    return lastOverId.current ? [{ id: lastOverId.current}]: []
  }, [activeDragItemType])
  return (
    <DndContext
      //cảm biến
      sensors={mySensors}
      //Thuật toán phát hiện va chạm (nếu không có nó thì cảd với cover lớn sẽ không kéo qua Cloumn khác được
      // vì lúc này nó đang bị conflict giưuax(card và column) ,chúng ta sẽ cùng closestCorners thay vì ClossetCenter )
      // collisionDetection={closestCorners}
      //nếu chỉ dùng closestCorners sẽ có bug flickering + sai lẹch dữ liệu
      //nên fixbug = collisionDetectionStrategy: đây là hàm tự custom (tự tạo để xử lí)
      collisionDetection={collisionDetectionStrategy}
      onDragEnd={handleDragEnd} //đây là hành động bắt đầu khi nhấn
      onDragOver={handleDragOver} //đây là hành động ở giữa(quá trình kéo thả)
      onDragStart={handleDragStart}//đây là hành động khi thả
    >
      <Box
        sx={{
          bgcolor: (theme) => {
            return theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
          },
          width: '100%',
          height: (theme) => (theme.trello.boardContentHeight),
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
