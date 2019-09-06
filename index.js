const dotenv = require("dotenv");
const express = require("express");
const persephonySDK = require("@persephony/sdk");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const accountId = process.env.accountId;
const authToken = process.env.authToken;
const persephony = persephonySDK(accountId, authToken);
const to_phone_number = process.env.TO;
const from_phone_number = process.env.FROM;
const appId = process.env.appId;

// Make an outgoing call when incoming requests on the /sendCall endpoint
app.post("/sendCall", (req, res) => {
  var options = {};

  // create call using Persephony's api
  persephony.api.calls.create(
    to_phone_number,
    from_phone_number,
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
