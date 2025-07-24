import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

//Boards
export const fetchBoardDetailsAPI = async(boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    //lưu ý : axios sẽ trả về kết quả qua property của nó là data
    return response.data
    
}
//Columns
export const createNewColumnAPI = async (newColumnData) => {
    const response = await axios.post(`${API_ROOT}/v1/columns`,newColumnData)
    return response.data
}

// cards
export const createNewCardAPI = async (newCardData) => {
    const response = await axios.post(`${API_ROOT}/v1/cards`,newCardData)
    return response.data
}