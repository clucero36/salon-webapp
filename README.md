Salon Web Application (work in progress)

Currently being developed with: 

-Next.js

-ChakraUI

-Node/Express

-Square Bookings API


Completed:

`nextjs-appointments` contains the front-end of the application. 

`appointment-server` is an express server used for my development environment. RESTful endpoints handle requests from `nextjs-appointments` front-end and makes API calls 
to Square Bookings using the Node SDK.

`main` branch contains the currently deployed version of the app, a home screen and some services being provided.

`booking` branch contains the code for the front end that handles making requests to `appointment-server`. 

Working on: 

-Firebase cloud functions for each `appointment-server` endpoint. 

-UI update for each page of the appointment making process. 


Drawbacks: 

-Unfortunately, with an unpaid version of the Square Subscription, write operations using the NodeSDK can only be completed in the Square Booking's Sandbox environment. So bookings can't be viewed in production.

The code for the date/time/service/stylist booking is complete, however, and can be viewed in the `booking` branch of the application.

-Currently trying to develop a workaround that would give the feel of a completed checkout without the date/time/service/stylist reservation. 






