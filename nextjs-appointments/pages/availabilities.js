import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

// grab url params on pre render & pass to client for api call
// should make api call from this client side (to do)
export async function getServerSideProps(context) {
  const serviceId = context.query.serviceId;
  const serviceVersion = context.query.serviceVersion;
  const teamMemberId = context.query.teamMemberId;
  const serviceVariationId = context.query.serviceVariationId;
  const locationId = context.query.locationId;
  return {
    props: {
      data: {
        serviceId: serviceId,
        serviceVersion: serviceVersion,
        teamMemberId: teamMemberId,
        serviceVariationId: serviceVariationId,
        locationId: locationId,
      }
    }
  }
}

// on date select call availabilites route 
// display times slots available for an appointment.
// takes us to client form page
export default function availabilities({ data }) {
  const [datesAvail, setDatesAvail] = useState([])

  useEffect(() => {
    console.log(datesAvail);
  }, [datesAvail])

  const onSelect = async (date) => {
    const start_date = getStartAtDate(date);
    const end_date = getEndAtDate(date);
    const searchRequest = {
      query: {
        filter: {
          startAtRange: {
            startAt: start_date,
            endAt: end_date
          },
          locationId: data.locationId,
          segmentFilters: [
            {
              serviceVariationId: data.serviceVariationId,
            }
          ]
        }
      }
    }; // end searchRequest

    let res = await axios.get("http://localhost:3030/availabilities", {
      params: searchRequest
    })
    console.log(res.data);
    setDatesAvail(res.data.availabilities);
  }; //end onChange

  const renderedTimeSlots = datesAvail.map((timeSlot, index) => {
    let newDate = new Date(timeSlot.startAt);
    return (
      <Box key={index}>
        <Link href={{
          pathname: '/contact',
          query: {
            serviceId: data.serviceId,
            serviceVersion: data.serviceVariationId,
            teamMemberId: data.teamMemberId,
            startAt: newDate.toString(),
          }
        }}>
          {newDate.toString()}
        </Link>
      </Box>
    )
  })

  return (
    <Box>
      <Text>Availabilites</Text>
      <DatePicker 
        inline 
        onSelect={onSelect}
      />
      {renderedTimeSlots}
    </Box>
  )
}

function getStartAtDate(date) {
  return date;
};

function getEndAtDate(date) {
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);
  return endDate
}