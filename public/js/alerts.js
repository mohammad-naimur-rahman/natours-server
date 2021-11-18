export const showAlert = (alertType, message) => {
  const alert = document.createElement('div')
  alert.className = `alert alert--${alertType}`
  alert.textContent = message
  const container = document.querySelector('.container')
  const form = document.querySelector('#book-form')
  container.insertBefore(alert, form)
  setTimeout(() => {
    document.querySelector('.alert').remove()
  }, 3000)
}
