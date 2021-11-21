import axios from 'axios'
import { showAlert } from './alerts'

export const updateSettings = async (data, type) => {
  const urlType = type === 'password' ? 'updateMyPassword' : 'updateMe'

  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${urlType}`,
      data
    })

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
