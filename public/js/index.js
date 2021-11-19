import '@babel/polyfill'
import { login, logout } from './login'
import { displayMap } from './mapbox'
import { updateSettings } from './updateSettings'

// DOM ELEMENTS
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('#form')
const logOutBtn = document.querySelector('#logout')
const userDataForm = document.querySelector('#update-account-form')
const userPasswordForm = document.querySelector('#update-password-form')

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations)
  displayMap(locations)
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value
    login(email, password)
  })
}

if (logOutBtn) logOutBtn.addEventListener('click', logout)

if (userDataForm) {
  userDataForm.addEventListener('submit', async e => {
    e.preventDefault()
    document.querySelector('.btn--save-data').textContent = 'Updating...'

    const name = document.querySelector('#name').value
    const email = document.querySelector('#email').value
    await updateSettings({ name, email }, 'data')

    document.querySelector('.btn--save-data').textContent = 'Save Settings'
  })
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault()
    document.querySelector('.btn--save-password').textContent = 'Updating...'

    const passwordCurrent = document.querySelector('#password-current').value
    const passwordConfirm = document.querySelector('#password-confirm').value
    const password = document.querySelector('#password').value
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    )

    document.querySelector('.btn--save-password').textContent = 'Save Password'
    document.querySelector('#password-current').value = ''
    document.querySelector('#password').value = ''
    document.querySelector('#password-confirm').value = ''
  })
}
