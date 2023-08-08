import React, { useState } from 'react';
import {
  Box,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

// grab url params on pre render & pass to client for api call
// should make api call from this client side (in progress)
export async function getServerSideProps(context) {
  return {
    props: {
      serviceData: {
        serviceId: context.query.serviceId,
        serviceVersion: context.query.serviceVersion,
        teamMemberId: context.query.teamMemberId,
        serviceVariationId: context.query.serviceVariationId,
        locationId: context.query.locationId,
      }
    }
  }
}

// on date select call availabilites route 
// display times slots available for an appointment.
// takes us to client form page
export default function availabilities({ serviceData }) {
  const reviver = (key, value) => key === 'version' || key === 'serviceDuration' || key === 'amount' || key === 'serviceVariationVersion' ? BigInt(value) : value;
  const [datesAvail, setDatesAvail] = useState([])
  const [day, setDay] = useState()

  const onSelect = async (date) => {
    const start_date = date;
    const end_date = getEndAtDate(date);
    const searchRequest = {
      query: {
        filter: {
          startAtRange: {
            startAt: start_date,
            endAt: end_date
          },
          locationId: serviceData.locationId,
          segmentFilters: [{ serviceVariationId: serviceData.serviceVariationId }]
        }
      }
    }; // end searchRequest

    let res = await axios.get("http://localhost:3030/availabilities", {
      params: searchRequest
    })
    
    let dates = JSON.parse(res.data, reviver);
    setDatesAvail(dates.availabilities);
    let selectedDay = new Date(dates.availabilities[0].startAt);
    setDay(selectedDay.toString().slice(0,15))
  }; //end onChange

  const renderedTimeSlots = datesAvail.map((timeSlot, index) => {
    let appointmentStartTime = new Date(timeSlot.startAt);
    let timeString = getTimeString(appointmentStartTime);
    return (
      <Box key={index} border='1px' p='3px' borderColor='#9B5D73' color='#9B5D73'>
        <Link href={{
          pathname: '/contact',
          query: {
            serviceId: serviceData.serviceId,
            serviceVersion: serviceData.serviceVariationId,
            teamMemberId: serviceData.teamMemberId,
            startAt: timeSlot.startAt,
          }
        }}>
          {timeString}
        </Link>
      </Box>
    )
  })

  return (
    <Box align='center' p='1rem'>
      <Text>Availabilites</Text>
      <DatePicker 
        inline 
        onSelect={onSelect}
      />
      <Text>Open Time Slots for {day}</Text>
      <Box display='flex' flexWrap='wrap' justifyContent='center' gap='2rem'>
        {renderedTimeSlots}
      </Box>
    </Box>
  )
}

function getTimeString(date) {
  let timeRegEx = /\d\d:\d\d/
  let dateString = date.toString();

  let timeString = timeRegEx.exec(dateString)[0];
  let timeArray = timeString.split(":")

  if (timeString[0] === '0')
    return timeString.slice(1);
  else if (parseInt(timeArray[0]) > 12) {
    let val = parseInt(timeArray[0]) -12;
    timeArray.splice(0, 1, val.toString());
    return timeArray.join(":");
  }
  else {
    return timeString;
  }
}

function getEndAtDate(date) {
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);
  return endDate
}