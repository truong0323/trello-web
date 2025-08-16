import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
//khởi tạo giá trị State của 1 cái slide trong redux
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'
const initialState = {
  currentActiveBoard : null
}
// đối với các hành gọi API (bất đồng bộ ) và cập nhật dữu liệu vào Redux ,dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
    'activeBoard/fetchBoardDetailsAPI',
    async (boardId) => {
        const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
        //lưu ý : axios sẽ trả về kết quả qua property của nó là data
        return response.data
    }
)

//khởi tọa một cái Slide trong kho lưu trữ -Redux Store
export const activeBoardSlide = createSlice({
    name: 'activeBoard',
    initialState,
    //reducers: nơi xử lí dữ liệu đồng bộ
    reducers: {
        updateCurrentActiveBoard: (state, action) => {
      //action.payload: là chuẩn đặt tên dữ liệu nhận vào reducer ,ở đây chúng ta gán nó ra một biến có nghĩa hơn
        const board = action.payload
        // xử lí dữ liệu nếu cần thiết...

        //Update lại dữ liệu của currentActiveBoard
        state.currentActiveBoard = board
        }
    },
    //Nơi xử lí dữ liệu bất đồng bộ 
    extraReducers: (builder) => {
        builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
            //action.payload ở đây là response.data trả về ở trên
            const board = action.payload
            // xử lí dữ liệu nếu cần thiết...
            board.columns = mapOrder(board.columns,board.columnOrderIds,'_id') 
            
            
            board.columns.forEach(column => {
                //vd 69 : khi f5 trang web cần xử lý vấn đề kéo thả với column rỗng (nhứo lại vd 37.2)
                if (isEmpty(column.cards)) {
                    column.cards = [generatePlaceholderCard(column)]
                    column.cardOrderIds = [generatePlaceholderCard(column)._id]
                }
                else{
                    //sắp xếp thứ tự các cards luôn ở đây trước khi đưa xuống bên dưới : vd71
                    column.cards = mapOrder(column.cards,column.cardOrderIds, '_id')
                }
    
            })
            
            //Update lại dữ liệu của currentActiveBoard
            state.currentActiveBoard = board
        })
    }
})
//Actions: là nơi dành cho components bên dưới gọi bằng ispatch() tới nó để cập nhật lại dữ liệu thông qua reducer(chạy đồng bộ)
/// để ý ở trên không thây properties đâu cả ,bởi vì những cái actions này đơn giản là thnawgf redux tạo tự động thheo tên của reducer
export const { updateCurrentActiveBoard } = activeBoardSlide.actions
//selectors: là nơi dành cho các components bên dưới gọi bằn hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
    return state.activeBoard.currentActiveBoard
}
export const activeBoardReducer = activeBoardSlide.reducer


// export default activeBoardSlide.reducer