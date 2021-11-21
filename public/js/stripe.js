import axios from 'axios'
import { showAlert } from './alerts'
const stripe = Stripe(process.env.STRIPE_PUBLISHABLE_KEY)

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://localhost:8000/api/v1/bookings/checkout-sessions/${tourId}`
    )
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })
    //2) Create checkout form + charge customer
  } catch (err) {
    showAlert('error', 'Something went wrong, try again later!')
  }
}
