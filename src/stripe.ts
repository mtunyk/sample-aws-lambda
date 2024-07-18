import Stripe from 'stripe'

const STRIPE_KEY = process.env.STRIPE_KEY!

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export default stripe
