// server.js
require("dotenv").config();
const axios = require("axios");
const express = require("express");
const paypal = require("paypal-rest-sdk");
const paypal2 = require("@paypal/checkout-server-sdk");

const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Configure PayPal SDK

app.use(bodyParser.json());

const db_data = new Map([
  [1, { price: 200, name: "item 1" }],
  [2, { price: 100, name: "item 2" }],
]);

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:"my key here",
  client_secret:"my key here"
});

app.post("/payment", (req, res) => {
  try {
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5000/success",
        cancel_url: "http://cancel.url",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "item",
                sku: "item",
                price: "1.00",
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: "1.00",
          },
          description: "This is the payment description.",
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        console.log("Create Payment Response");
        console.log(payment);
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.send(payment.links[i].href);
          }
        }
      }
    });
  } catch (e) {}
});

app.post("/refund", (req, res) => {
  console.log("refund procesing...");
  const refundRequest = {
    amount: {
      total: "1.00",
      currency: "USD",
    },
  };

  paypal.sale.refund(
    "PAYID-MYMKV5Q8GG992571D4753028",
    refundRequest,
    (error, refund) => {
      if (error) {
        res.status(500);
      } else {
        console.log(refund);
        res.status(200).json({ message: "done!" });
      }
    }
  );
});

app.get("/details",(req,res)=>{
  var fetch = require('node-fetch');

fetch('https://api-m.sandbox.paypal.com/v1/payments/payment/PAY-0US81985GW1191216KOY7OXA', {
    headers: {
        'X-PAYPAL-SECURITY-CONTEXT': '{"actor":{"account_number":"1659371090107732880","party_id":"1659371090107732880","auth_claims":["CLIENT_ID_SECRET"],"auth_state":"ANONYMOUS","client_id":"zf3..4BQ0T9aw-ngFr9dmOUZMwuKocrqe72Zx9D-Lf4"},"auth_token":"A015QQVR4S3u79k.UvhQ-AP4EhQikqOogdx-wIbvcvZ7Qaw","auth_token_type":"ACCESS_TOKEN","last_validated":1393560555,"scopes":["https://api-m.sandbox.paypal.com/v1/payments/.*","https://api-m.sandbox.paypal.com/v1/vault/credit-card/.*","openid","https://uri.paypal.com/services/payments/futurepayments","https://api-m.sandbox.paypal.com/v1/vault/credit-card","https://api-m.sandbox.paypal.com/v1/payments/.*"]}'
    }
});

})

app.get("/success", (req, res) => {
  try {
    const payer_id = req.query.PayerID;
    const payment_id = req.query.paymentId;

    const pay_json = {
      payer_id: payer_id,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: "1.00",
          },
        },
      ],
    };
    paypal.payment.execute(payment_id, pay_json, (err, payment) => {
      if (err) {
        console.log(err);
        throw error;
      } else {
        const response = JSON.stringify(payment);
        const parsedResponse = JSON.parse(response);
        const transactionDetails = parsedResponse.transactions[0];
        console.log(parsedResponse);
        return res.redirect("http://localhost:3000/success");
      }
    });
  } catch (e) {}
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
