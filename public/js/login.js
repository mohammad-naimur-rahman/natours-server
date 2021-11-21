import axios from 'axios'
import { showAlert } from './alerts'

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: { email, password }
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Login Successful!')
      window.setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    }
  } catch (error) {
    showAlert('error', 'Invalid email or password')
  }
}

export const logout = async () => {
  try {
    const res = await axios({
      mathod: 'GET',
      url: '/api/v1/users/logout'
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Logout Successful!')
      location.reload()
    }
  } catch (error) {
    showAlert('error', 'Error loggin out, please try again!')
  }
}
