import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
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