const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const persephonySDK = require("@persephony/sdk");

dotenv.config();
const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
const accountId = process.env.ACCOUNT_ID;
const authToken = process.env.AUTH_TOKEN;
const persephony = persephonySDK(accountId, authToken);
const persephony_phone_number = process.env.PERSEPHONY_PHONE_NUMBER;
const appId = process.env.PERSEPHONY_APP_ID;

console.log(`Running outgoing call app on port ${port}`);

// Make an outgoing call when incoming requests on the /sendCall endpoint
app.post("/sendCall", (req, res) => {
  let destination_phone_number = req.body.destination_phone_number;
  var options = {};

  // create call using Persephony's api
  persephony.api.calls.create(
    destination_phone_number,
    persephony_phone_number,
    appId,
    options
  );

  res.status(200).json();
});

// Message to be played when an outgoing call is made
// Endpoint /callConnect associated with Persephony app's "Call Connect URL"
app.post("/callConnect", (req, res) => {
  // Create Say script to greet caller
  var hello = persephony.percl.say("Hello, welcome to Persephony!");

  // Add Say script greeting to PerCL script and append to response
  res.status(200).json(persephony.percl.build(hello));
});

app.listen(port);
