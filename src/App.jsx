
import NotFound from '~/pages/404/NotFound'
import Board from '~/pages/Boards/_id'
import {Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth/Auth'
function App() {
  return (
    <Routes>
      {/* {sau này sẽ thực hiện React Router Dom / boards/{board_id}} */}
      {/* Redirect Route */}
      <Route path= '/' element={
        //ở đây cần  replace={true} để nó thay thể route / , có thể hiểu là route / dé không còn nằm trong history của Browser
        //thực hành dễ hiểu hơn bằng cách nhấn Go Home từ trnag 404 xong thửu quay lại bằng nút báck của trình duyệt giữa 2 th có replace haowcjkhoong có

        <Navigate to="/boards/687a4e1419077f7ff489e057" replace={true}/>
      } />

      {/* { Gọi đến Board details} */}
      <Route path='/boards/:boardId' element ={<Board/> }/>
      {/* Authentication */}
      <Route path='/login' element={<Auth/> } />
      <Route path='/register' element={<Auth/> } />
      
      {/* Route 404: not found */}
      <Route path ='*' element = {<NotFound/>}/>
    </Routes>
  )
}

export default App

