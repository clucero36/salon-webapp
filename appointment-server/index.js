const express = require("express");
const app = express();
const cors = require('cors');
const JSONBig = require('json-bigint');
require("dotenv").config();

const port = 3030
const locationId = process.env["SQUARE_LOCATION_ID"];

const {
  catalogApi,
  bookingsApi,
  teamApi,
} = require("./square-client");

app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// route handler 
// get requests for https://localhost:3030 endpoint
// calls Square Api & sends list of services provided in the response
app.get("/", async (req, res, next) => {
  try {
    let { result: { items }} = await catalogApi.searchCatalogItems({
      enabledLocationIds: [ locationId ],
      productTypes: [ "APPOINTMENTS_SERVICE" ]
    });

    if (!items) {
      items = [];
    }
    res.json({ items: JSONBig.parse(JSONBig.stringify(items)) })
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// route handler
// get requests for http://localhost:3030/staff/serviceId/serviceVersion
// calls Square Api to retrieve list of staff based off serviceId & serviceVersion
// sends list of teamMembers, a specific service, & specific service version in the response
app.get("/staff/:serviceId/:serviceVersion", async(req, res, next) => {
  const serviceId = req.params.serviceId;
  const serviceVersion = req.params.serviceVersion;
  try {
    // promise retrieves service associated with the given item variation ID, and related objects.
    const retrieveServicePromise = catalogApi.retrieveCatalogObject(serviceId);

    // promise retrieves a list all active team members for this merchant at this location.
    const listActiveTeamMembersPromise = teamApi.searchTeamMembers({
      query: {
        filter: {
          locationIds: [ locationId ],
          status: "ACTIVE"
        }
      }
    });

    const [ { result: service }, { result: { teamMembers } } ] =
      await Promise.all([ retrieveServicePromise, listActiveTeamMembersPromise ]);

    res.json({
      team: JSONBig.parse(JSONBig.stringify(teamMembers)), 
      service: JSONBig.parse(JSONBig.stringify(service)), 
      version: JSONBig.parse(JSONBig.stringify(serviceVersion)),
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
})

// route handler
// get requests for http://localhost:3030/availabilites?* 
// `query` is passed via query parameters & is needed to Sqaure Api request
// sends availability dates in response
app.get("/availabilities?*", async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  const query = req.query;
  const { result } = await bookingsApi.searchAvailability(query);
  res.json(JSONBig.parse(JSONBig.stringify(result)));
})

// route handler 
// get requests for http://localhost:3030/serviceId/serviceVersion/teamMemberId/startAt
// calls Square Api for team member profile & service data
// sends team member & service data in response
app.get("/contact/:serviceId/:serviceVersion/:teamMemberId/:startAt", async (req, res, next) => {
  const serviceId = req.params.serviceId;
  const serviceVersion = req.params.serviceVersion;
  const teamMemberId = req.params.teamMemberId;
  const startAt = req.params.startAt;
  
  try {
    const retrieveServicePromise = catalogApi.retrieveCatalogObject(serviceId, true);
    const retrieveTeamMemberPromise = bookingsApi.retrieveTeamMemberBookingProfile(teamMemberId);
    const [ { result: { object : serviceItem } }, { result: { teamMemberBookingProfile } } ] = await Promise.all([ retrieveServicePromise, retrieveTeamMemberPromise ]);

    res.json({
      serviceItem: JSONBig.parse(JSONBig.stringify(serviceItem)), 
      teamMemberBookingProfile: JSONBig.parse(JSONBig.stringify(teamMemberBookingProfile)), 
      serviceVersion: JSONBig.parse(JSONBig.stringify(serviceVersion)),
      startAt: startAt
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
})