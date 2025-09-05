
import NotFound from '~/pages/404/NotFound'
import Board from '~/pages/Boards/_id'
import {Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Auth from './pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
import Boards from '~/pages/Boards'
const ProtectedRoute = ({ user}) => {
  if(!user) return <Navigate to='/login' replace={ true}/>
  return <Outlet/>
  }
function App() {
  
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/* {sau này sẽ thực hiện React Router Dom / boards/{board_id}} */}
      {/* Redirect Route */}
      <Route path= '/' element={
        //ở đây cần  replace={true} để nó thay thể route / , có thể hiểu là route / dé không còn nằm trong history của Browser
        //thực hành dễ hiểu hơn bằng cách nhấn Go Home từ trnag 404 xong thửu quay lại bằng nút báck của trình duyệt giữa 2 th có replace haowcjkhoong có

        <Navigate to="/boards" replace={true}/>
      } />

      {/* Protected Routes (hiểu đơn giản trong dự án của chúng ta là những route chỉ cho truy cập sau khi đã login) */}
      <Route element= {<ProtectedRoute user={currentUser} />}>
        {/* { Gọi đến Board details} */}
        <Route path='/boards/:boardId' element ={<Board/> }/>
        <Route path='/boards' element ={<Boards/> }/>

        {/* user setting */}
        <Route path='/settings/account' element ={<Settings/>}/>
        <Route path='/settings/security' element ={<Settings/>}/>


      </Route>
      {/* Authentication */}
      <Route path='/login' element={<Auth/> } />
      <Route path='/register' element={<Auth/> } />
      <Route path = '/accounnt/verification' element={ <AccountVerification/>} />
      {/* Route 404: not found */}
      <Route path ='*' element = {<NotFound/>}/>
    </Routes>
  )
}

export default App

