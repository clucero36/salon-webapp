
const { Client, Environment } = require('square');
require('dotenv').config();

// create new client with square credentials
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox
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