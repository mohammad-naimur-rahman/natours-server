import axios from 'axios'
import { showAlert } from './alerts'

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/users/login',
      data: { email, password }
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Login Successful!')
      window.setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    }
  } catch (error) {
    alert('error', error.response.data.message)
  }
}
