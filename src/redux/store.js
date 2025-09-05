//redux : stage
import { configureStore } from '@reduxjs/toolkit'
import {activeBoardReducer} from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
// Cấu hình redux-persist
import { combineReducers } from 'redux'//lưu ý là có sẵn redux trong node_modules bởi vì khi cài @reduxjs/toolkit là đã có
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' //default là localStorage
import { activeCardReducer } from './activeCard/activeCardSlice'
import { notificationsReducer } from './notifications/notificationsSlice'

//cấu hình persist
const rootPersistConfig = {
    key: 'root',//key của cái persist do chúng ta chỉ định ,cứ mặc định là root
    storage: storage, //biến storage ở trên -lưu vào localstorage

    whitelist: ['user'] //định nghĩa cái slide dữ liệu được phép duy trì qua mỗi lần f5 trình duyệt 
    //blacklist: ['user' ]// dịnh nghĩa các slide không được phép duy trì qua mỗi lần f5 trình dyệt
}
//combine cac reducers trong dự án của chúng ta ở đây
const reducers = combineReducers({
    activeBoard: activeBoardReducer,
    user: userReducer,
    activeCard: activeCardReducer,
    notifications: notificationsReducer
})

//thực hiện persist Reducer
const persistReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
    // reducer: {
    //     activeBoard: activeBoardReducer,
    //     user:userReducer,
    //     devTools: true
    // },
    reducer: persistReducers,
    //fix warning error khi mà implemnt redux-persist
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})