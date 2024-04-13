import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
export default function Home() {
  const payment = () => {
    axios.post("http://localhost:5000/payment").then((res) => {
      console.log(res);
      window.open(res.data, "_blank");
    });
  };

  const refund = () => {
    axios.post("http://localhost:5000/refund").then((res) => {
      console.log(res);
    });
  };
  return (
    <div>
      <button onClick={payment}>buy now</button>
      <button onClick={refund}>refund</button>
    </div>
  );
}
