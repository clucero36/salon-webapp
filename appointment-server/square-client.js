
const { Client, Environment } = require('square');
require('dotenv').config();

// instantiate client object with square credentials to use Square Node.js SDK
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
});

// extract instances of Api that are being used
const { locationsApi, customersApi, bookingsApi, catalogApi, teamApi} = client;

module.exports = {
  bookingsApi,
  locationsApi,
  customersApi,
  catalogApi,
  teamApi,
};