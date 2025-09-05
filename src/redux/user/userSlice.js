import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
//khởi tạo giá trị State của 1 cái slide trong redux
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
const initialState = {
  currentUser : null
}
// đối với các hành gọi API (bất đồng bộ ) và cập nhật dữu liệu vào Redux ,dùng Middleware createAsyncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
    'user/loginUserAPI',
    async (data) => {
        const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/login`,data)
        //lưu ý : axios sẽ trả về kết quả qua property của nó là data
        return response.data
    }
)
export const logoutUserAPI = createAsyncThunk(
    'user/logoutUserAPI',
    async (showSuccessMessage = true) => {
        const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
        //lưu ý : axios sẽ trả về kết quả qua property của nó là data
        if(showSuccessMessage) {
            toast.success('Đăng xuất thành công!!!')

        }
        return response.data
    }
)
export const updateUserAPI = createAsyncThunk(
    'user/updateUserAPI',
    async (data) => {
        const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/update`,data)
        //lưu ý : axios sẽ trả về kết quả qua property của nó là data
        return response.data
    }
)

//khởi tọa một cái Slide trong kho lưu trữ -Redux Store
export const userSilce = createSlice({
    name: 'activeBoard',
    initialState,
    //reducers: nơi xử lí dữ liệu đồng bộ
    reducers: { },
    //Nơi xử lí dữ liệu bất đồng bộ 
    extraReducers: (builder) => {
        builder.addCase(loginUserAPI.fulfilled, (state, action) => {
            //action.payload ở đây là response.data trả về ở trên
            const user = action.payload
            // xử lí dữ liệu nếu cần thiết...
            
            
            //Update lại dữ liệu của currentActiveBoard
            state.currentUser = user
            
        })
        builder.addCase(logoutUserAPI.fulfilled, (state, action) => {
            // API logout sau khi gọi thành công thì sẽ clear thông tin curentUser về null ở đây
            // Kết hợp ProtectedRoute đã làm ở App.js => code sẽ điều hướng chuẩn về login
            
            state.currentUser = null
            
        })
        builder.addCase(updateUserAPI.fulfilled,(state , action)=> {
            const user = action.payload
            state.currentUser = user
        })

    }
})
//Actions: là nơi dành cho components bên dưới gọi bằng ispatch() tới nó để cập nhật lại dữ liệu thông qua reducer(chạy đồng bộ)
/// để ý ở trên không thây properties đâu cả ,bởi vì những cái actions này đơn giản là thnawgf redux tạo tự động thheo tên của reducer

// export const { } = userSilce.actions
//selectors: là nơi dành cho các components bên dưới gọi bằn hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => {
    return state.user.currentUser
}
export const userReducer = userSilce.reducer


// export default activeBoardSlide.reducer