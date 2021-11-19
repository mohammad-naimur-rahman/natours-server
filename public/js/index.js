import '@babel/polyfill'
import { login, logout } from './login'
import { displayMap } from './mapbox'
import { updateData } from './updateSettings'

// DOM ELEMENTS
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('#form')
const logOutBtn = document.querySelector('#logout')
const userDataForm = document.querySelector('#update-account-form')

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
  userDataForm.addEventListener('submit', e => {
    e.preventDefault()
    const name = document.querySelector('#name').value
    const email = document.querySelector('#email').value
    updateData(name, email)
  })
}
