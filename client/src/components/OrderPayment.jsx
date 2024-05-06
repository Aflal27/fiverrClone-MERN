import React, { useState } from "react";
import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import { IoCardOutline } from "react-icons/io5";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useSelector } from "react-redux";
import StripeCheckout from "react-stripe-checkout";

export default function OrderPayment({ amount, gigData, days }) {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.userState);
  const [orderSuccess, setOrderSuccess] = useState("");

  const paymentData = {
    amount: Math.round(amount * 100),
    currency: "usd",
    description: "TEST PAYMENT",
    gigData: gigData,
    days: days,
  };
  console.log(paymentData);
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const { data } = await axios.post(
  //     `api/payment/process/${currentUser._id}`,
  //     paymentData
  //   );
  //   console.log(data);
  // };
  const makePayment = async (token) => {
    const body = {
      token,
      paymentData,
    };
    setLoading(true);
    return await axios
      .post(`api/payment/process/${currentUser._id}`, body)
      .then((res) => {
        console.log(res);
        setLoading(false);
        setOrderSuccess("Order Successfully!");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <div>
      <h4 className=" text-lg font-semibold mb-4 ">Payment Options</h4>
      {/* <form
        onSubmit={handleSubmit}
        className=" flex flex-col gap-8 border p-2 border-gray-300 dark:border-gray-500 ">
        <label>
          <h2 className=" text-sm mb-2 ">Card Number</h2>
          <div className=" flex items-center gap-1">
            <IoCardOutline />
            <CardNumberElement
              className=" w-full "
              type="number"
              placeholder="1234 5678 9012 3456"
            />
          </div>
        </label>

        <label>
          <h2 className=" text-sm mb-2 ">Expiration date</h2>
          <div className="">
            <CardExpiryElement type="text" />
          </div>
        </label>
        <label>
          <h2 className=" text-sm mb-2 ">Security code</h2>
          <div className="">
            <CardCvcElement type="text" />
          </div>
        </label>
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Confirm & Pay
        </Button>
      </form> */}

      <StripeCheckout
        stripeKey="pk_test_51NEnBEJW3qbjqrkqMe97DPU97Dtcy7jjT7PdFeddsbZSsIaw33typSXC4eGU7XmYnWeYdEBcvdbPWvgI19HbvCDR001JrR4GwC"
        token={makePayment}
        name="Order GIG"
        amount={paymentData.amount}
        currency="usd">
        <Button className="btn-large blue">
          Pay ${paymentData.amount / 100} usd
        </Button>
      </StripeCheckout>
      <div className=" mt-4">{loading && <Spinner />}</div>
      {orderSuccess && (
        <Alert className=" mt-3" color="success">
          {orderSuccess}
        </Alert>
      )}
    </div>
  );
}
