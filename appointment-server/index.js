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
  customersApi,
} = require("./square-client");

// passed as second arg to JSON.stringify. Serializes big ints
const replacer = (key, value) => key === 'version' || key === 'serviceDuration' || key === 'amount' || key === 'serviceVariationVersion' ? value.toString() : value;

app.use(express.json());
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
    res.json({items: JSON.stringify(items, replacer)})
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// route handler
// get requests for http://localhost:3030/staff/serviceId/serviceVersion
// calls Square Api to retrieve list of staff based off serviceId & serviceVersion
// sends list of teamMembers, a specific service, & specific service version in the response
app.get("/staff/:serviceId/", async(req, res, next) => {
  const serviceId = req.params.serviceId;
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
    console.log(teamMembers)
    res.json({
      team: JSON.stringify(teamMembers, replacer), 
      service: JSON.stringify(service, replacer),
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
  const query = req.query;
  try {
    const { result } = await bookingsApi.searchAvailability(query);
    res.json(JSON.stringify(result, replacer));
  } catch (error) {
    console.error(error);
    next(error);
  }
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

    const serviceData = {
      serviceItem: serviceItem,
      teamMemberBookingProfile: teamMemberBookingProfile,
      serviceVersion: serviceVersion,
      startAt: startAt
    }
    res.json(JSON.stringify(serviceData, replacer));
  } catch (error) {
    console.error(error);
    next(error);
  }
})

app.post("/create", async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  const JSONdata = JSON.parse(req.body.data);
  console.log(JSONdata);
  const JSONserviceData = JSONdata.serviceData;
  const JSONuserData = JSONdata.userData;

  const customerId = await getCustomerId(JSONuserData.firstName, JSONuserData.lastName, JSONuserData.email)
  console.log(customerId)
  try {
    const { result: { booking } } = await bookingsApi.createBooking({
      booking: {
        appointmentSegments: [
          {
            serviceVariationId: JSONserviceData.serviceVersion,
            serviceVariationVersion: JSONserviceData.serviceItem.version,
            teamMemberId: JSONserviceData.teamMemberBookingProfile.teamMemberId,
          }
        ],
        customerId: customerId,
        customerNote: JSONuserData.note,
        locationId: locationId,
        locationType: 'BUSINESS_LOCATION',
        startAt: JSONserviceData.startAt,
      }
    })

    console.log(booking);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

async function getCustomerId(firstName, lastName, email) {
  const { result: { customer } } = await customersApi.createCustomer({
    emailAddress: email, 
    familyName: lastName,
    givenName: firstName,
    referenceId: "BOOKINGS-SAMPLE-APP",
  })

  return customer.id;
}