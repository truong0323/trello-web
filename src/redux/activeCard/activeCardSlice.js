import { createSlice } from '@reduxjs/toolkit'

//Khởi tạo giá trị Slice trong rdux

const initialState = {
    currentActiveCard: null,
    isShowModalActiveCard: false
}
export const activeCardSlide = createSlice ({
    name: 'activeCard',
    initialState,
    //reducers: nơi xử lí dữ liệu đồng bộ
    reducers: {
        //lưu ý ở đây luôn luôn cần cặp ngoặc nhọn cho function trong reducer hco dù code bên trong chỉ có 1 dòng  , đây là rule của Redux

        //function: clear data và đóng modal activeCard
        clearAndHideCurrentActiveCard: (state) => {
            state.currentActiveCard = null,
            state.isShowModalActiveCard = false
        },
        updateCurrentActiveCard: (state,action) => {
            const fullCard = action.payload //action.payload là đặt chuẩn tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó vòa 1 biến có ý nghĩa hơn

            // xử lý dữ liệu nếu cần thiết


            //update lại dữ liệu currentActiveCard trog redux
            state.currentActiveCard = fullCard
        },
        
        showModalActiveCard : (state) => {
            state.isShowModalActiveCard = true
        },
        
    },
    // extraReducers: Xử lý dữ liệu bất đồng bộ
    extraReducers: (builder) => {

    }
})
//Actions: là mởi dành cho các components bên dưới gọi bằng dispatch( ) tới nó để cập nhật lại dữ liệu qua reducer(chạy đồg bộ)
// để ý ở trên thì không thấy properties actions đâu cả vì nhưunxg cáci cactions này đơn giản là được thằng redux tạo tự động theo tên của reducer 
export const { 
    clearAndHideCurrentActiveCard,
    updateCurrentActiveCard,
    showModalActiveCard

} = activeCardSlide.actions

export const selectCurrentActiveCard = (state) => {
    return state.activeCard.currentActiveCard
}
export const selectIsShowModalACtiveCard = (state) => {
    return state.activeCard.isShowModalActiveCard
}
export const activeCardReducer = activeCardSlide.reducer