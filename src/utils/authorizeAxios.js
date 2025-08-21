import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
import { refreshTokenAPI } from '~/apis' 
import { logoutUserAPI } from '~/redux/user/userSlice'

// Không thể import {store} from ' ~/redux/store' theo cách thông thường vì đây là file js thuần
// Giải pháp : Inject Store: là kĩ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios hiện tại
// Hiểu đơn giản : khi ứng dụng bắt đầu chạy lên, códe sẽ chạy vào main.js đầu tiên ,từ bên đó chúng ta gọi
// hàm injectStore ngay lập tức để gnas biến mainStore vào biến axiosReduxStore cục bộ trong file này  
let axiosReduxStore
export const injectStore = mainStore => {
  axiosReduxStore= mainStore
}
// Khởi tọa một đối tượng Axios(authorizeAxiosInstance ) mục đích để custom và cấu hình chug cho dự án
let authorizeAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 réquest : để 10 phút
authorizeAxiosInstance.defaults.timeout =1000*60*10

//  withCredentials:  sẽ cho phép axios tự động gửi cookie tronng mỗi request lên BE (phục vụ việc chúng ta sẽ lưu
//     JWT tokens(refresh và access) vào trong httpOnly Cookie của trình duyệt
//  )

authorizeAxiosInstance.defaults.withCredentials = true

//cấu hình Interceptors(Bộ đánh chặn vào giữa mọi Request và Response)
// interceptors.request: Can thiệp vào giữa những cái request API
authorizeAxiosInstance.interceptors.request.use( (config) => {
    //kỹ thuật chặn spam click 
    interceptorLoadingElements(true)

    return config;
  },  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Khởi tạo một cái promise của việc gọi apo refresh_token
// mục đích tọa Promisse này để khi nòa gọi api refresh_token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó
let refreshTokenPromise = null
// interceptors.response: Can thiệp vào giữa những cái response trả về
authorizeAxiosInstance.interceptors.response.use( (response)=> {
    //kỹ thuật chặn spam click 
    interceptorLoadingElements(false)

    return response;
  },  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    // Mọi mã http status code nằm ngoài khoảnhg 200-299 sẽ là error rơi vào đây
    
    //kỹ thuật chặn spam click 
    interceptorLoadingElements(false)

    // Quan trọng : xử lý Refesh Token tự động
    //th1: nếu như nhận mã 401 từ BE ,thì gọi api đăng xuất
    if(error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }
    //th2: nếu nhiw nhận mã 410 từ BE, thì sẽ gọi api refesh để lấy lịa accessToken
    //đầu tiên lấy được các request API đang bị lỗi thông qua error.config
    const originalRequests = error.config
    console.log('originalRequests:',originalRequests)
    if(error.response?.status ===410 && !originalRequests._retry) {
      //Gán thêm một giá trị _retry luôn true trong khoảng thời gian chờ ,đảm bảo việc refresh token này chỉ luôn gọi 1 lần tại 1 thời điểm (nhìn lại điều kiện if ngay phía trên )
      originalRequests._retry = true
      //Kieemr tra nếu chưa có refreshTokenPromise thì thưucj hiện gán việc gọi api refesh_token đồng thời gán vào cho cái refreshTokenPromise
      if(!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          //đồng thời cái accessToken đã nằm trong httpOnly cookie( xử lí từ phia BE)
          return data?.accessToken
        })
        .catch((_error) => {
          //nếu nhận bất kỳ lỗi naoof từ api refresh token thì cứ logout
          axiosReduxStore.dispatch(logoutUserAPI(false))

          return Promise.reject(_error)
        })
        .finally(() =>{
          //dù api có thành công hayy lỗi thì vẫn luôn gán refreshTokenPromise về null như ban đầu 
          refreshTokenPromise=null
        })

      }
    //cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây
      return refreshTokenPromise.then(accessToken => {
      //đối với trường hợp nếu dự án cần lưu accessToken vào localStorage haowcj đây đó thì viết thêm code xử lý ở đây
      //Hiện tại ở đây không cần bước 1 vì chúng ta đã đưa accessToken vào trong cookie (xử lí phía BE)


      //Bước 2: Bước quan trọng : return lại axios instance của chúng ta kết hợp các originalRequest để gọi lại những api  bị lỗi
        return authorizeAxiosInstance(originalRequests)
      })
    }


    // xử lí tập trung phần hiển thị thông báo lỗi trả  về mọi API ở đây (viết code một lần : Clean code)
    //cónle.log error là sẽ thấy câu strucs data dẫn tới message lỗi như dưới đây
    // console.log(error);
    let errorMessage = error?.message
    if(error.response?.data?.message) {
        errorMessage = error.response?.data?.message
        
    }
    //dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình -ngoại trừ mã 410-GONE phục vụ việc tự động refesh lại token
    if(error.response?.status !==410) {
        toast.error(errorMessage)
    }

    return Promise.reject(error)
  });




export default authorizeAxiosInstance