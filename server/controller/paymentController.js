import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
import notificationModel from "../models/notificationModel.js";
import Order from "../models/orderModel.js";

export const payment = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json("you are not allowed ");
  }
  const { paymentData, token } = req.body;
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create({
          amount: paymentData.amount,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `pay`,
        })
        .then(async (result) => {
          await Order.create({
            img: paymentData.gigData.images[0],
            title: paymentData.gigData.title,
            price: paymentData.amount / 100,
            days: paymentData.days,
            sellerId: paymentData.gigData.userId,
            buyerId: req.params.userId,
          });
          await notificationModel.create({
            creator: req.params.userId,
            reciver: paymentData.gigData.userId,
            gig: paymentData.gigData._id,
            content: `order gig`,
            type: "order",
            paymentMethod: "card",
            amount: paymentData.amount / 100,
          });

          res.status(200).json(result);
        })

        .catch((err) => {
          console.log("paymentError", err);
        });
    });

  // const paymentIntent = await stripe.charges.create({
  //   amount: req.body.amount,
  //   currency: req.body.currency,
  //   description: req.body.description,
  //   metadata: { integration_check: "accept_payment" },
  // });
};

export const sendStripeApiKey = async (req, res, next) => {
  try {
    res.status(200).json({
      stripeApiKey: process.env.STRIPE_API_KEY,
    });
  } catch (error) {
    console.log("sendStripeApiKey", error);
  }
};
