import '@babel/polyfill'
import { login, logout } from './login'
import { displayMap } from './mapbox'
import { updateSettings } from './updateSettings'
import { bookTour } from './stripe'

// DOM ELEMENTS
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('#form')
const logOutBtn = document.querySelector('#logout')
const userDataForm = document.querySelector('#update-account-form')
const userPasswordForm = document.querySelector('#update-password-form')
const bookButton = document.getElementById('book-tour')
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

    const form = new FormData()
    form.append('name', document.querySelector('#name').value)
    form.append('email', document.querySelector('#email').value)
    form.append('photo', document.querySelector('#photo').files[0])

    await updateSettings(form, 'data')

    location.reload()
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

if (bookButton) {
  bookButton.addEventListener('click', async e => {
    e.target.textContent = 'Processing...'
    // 1) Get the data
    const { tourId } = e.target.dataset
    //2) Make request to book tour
    await bookTour(tourId)
    //3) Redirect to the booking page
    document.querySelector('.btn--book-tour').textContent = 'Booked!'
    setTimeout(() => {
      document.querySelector('.btn--book-tour').textContent = 'Book Tour'
    }, 2000)
  })
}
