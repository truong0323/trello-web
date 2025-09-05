import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
    currentNotifications: null
}
export const fetchInvitationsAPI = createAsyncThunk(
    'notifications/fetchInvitationsAPI',
    async () => {
        const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/invitations`)
        return response.data
    }
)
export const updateBoardInvitationAPI = createAsyncThunk (
    'notifications/updateBoardInvitationsAPI',
    async ({ status, invitationId }) => {
        const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${invitationId}`, {status})
        return response.data
    }
    

)
// khơi tạo một slice trong kho lưu trữ - reduxstore
export const notificationsSlice  = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearCurrentNotifications: (state) => {
            state.currentNotifications = null
        },
        updateCurrentNotifications: (state,action ) => {
            state.currentNotifications = action.payload
        },
        addNotification: (state,action ) => {
            const incommingInvitation = action.payload
            //unshift là thêm phần tử vào đầu mảng ,ngược lại vs push
            state.currentNotifications.unshift(incommingInvitation)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchInvitationsAPI.fulfilled, (state , action) => {
            let incommingInvitations = action.payload
            //Đoạn này ngược lại mảng invitations nhận được , đơn giản là để hiển thị cái mới nhất lên đầu
            state.currentNotifications = Array.isArray(incommingInvitations) ? incommingInvitations.reverse() : []
        }),
        builder.addCase(updateBoardInvitationAPI.fulfilled, (state , action) => {
            let incommingInvitation = action.payload
            
            // Cập nhật lại dữu liệu boardInvitation ( bên trong nó sẽ có Status mới sau khi update)
            const getInvitation = state.currentNotifications.find(i =>  i._id === incommingInvitation._id)
            getInvitation.boardInvitation = incommingInvitation.boardInvitation

        })
    }
})
export const {
    clearCurrentNotifications,
    updateCurrentNotifications,
    addNotification
} = notificationsSlice.actions
export const selectCurrentNotifications = state => {
    return state.notifications.currentNotifications
}
export const notificationsReducer = notificationsSlice.reducer