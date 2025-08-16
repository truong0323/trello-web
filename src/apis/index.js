import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

//Boards
//đã chuyển vào redux
// export const fetchBoardDetailsAPI = async(boardId) => {
//     const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
//     //lưu ý : axios sẽ trả về kết quả qua property của nó là data
//     return response.data
    
// }

//Columns
export const createNewColumnAPI = async (newColumnData) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/columns`,newColumnData)
    return response.data
}

// cards
export const createNewCardAPI = async (newCardData) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/cards`,newCardData)
    return response.data
}
export const updateBoardDetailsAPI = async(boardId,updateData) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`,updateData)
    //lưu ý : authorizeAxiosInstance sẽ trả về kết quả qua property của nó là data
    return response.data
    
}
export const moveCardToDifferentColumnAPI = async(updateData) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`,updateData)
    //lưu ý : authorizeAxiosInstance sẽ trả về kết quả qua property của nó là data
    return response.data
    
}
export const updateColumnDetailsAPI = async(columnId,updateData) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`,updateData)
    //lưu ý : authorizeAxiosInstance sẽ trả về kết quả qua property của nó là data
    return response.data
    
}
export const deleteColumnDetailsAPI = async(columnId) => {
    const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
    //lưu ý : axios sẽ trả về kết quả qua property của nó là data
    return response.data
    
}
