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

// called from services page to retrieve list of services provided.
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

// called from staffSelect page to retrieve list of staff based off serviceId & service version
// sends list of staff, a specific service, & specific service version to staffSelect page for rendering
app.get("/staff/:serviceId/:serviceVersion", async(req, res, next) => {
  const serviceId = req.params.serviceId;
  const serviceVersion = req.params.serviceVersion;
  try {
    // Send request to get the service associated with the given item variation ID, and related objects.
    const retrieveServicePromise = catalogApi.retrieveCatalogObject(serviceId);

    // Send request to list all active team members for this merchant at this location.
    const listActiveTeamMembersPromise = teamApi.searchTeamMembers({
      query: {
        filter: {
          locationIds: [ locationId ],
          status: "ACTIVE"
        }
      }
    });

    // Wait until all API calls have completed.
    const [ { result: service }, { result: { teamMembers } } ] =
      await Promise.all([ retrieveServicePromise, listActiveTeamMembersPromise ]);

    // console.log(teamMembers, service, serviceVersion);
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

app.get("/availabilities?*", async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  const query = req.query;
  const { result } = await bookingsApi.searchAvailability(query);
  res.json(JSONBig.parse(JSONBig.stringify(result)));
})

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