import { auth, database, storage } from "./FirebaseConfig";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref as databaseRef,
  set,
  remove,
  off,
} from "firebase/database";
import { Button, TextField } from "@mui/material/";
import SendIcon from "@mui/icons-material/Send";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";

const DB_FLIGHT_KEY = "itinerary/flight";
const DB_ACCOMMODATION_KEY = "itinerary/accommodation";
const flightRef = databaseRef(database, DB_FLIGHT_KEY);
const accommodationRef = databaseRef(database, DB_ACCOMMODATION_KEY);

export default function Itinerary() {
  const [flight, setFlight] = useState({});
  const [accommodation, setAccommodation] = useState({});

  const { handleSubmit, control } = useForm();

  const writeFlightData = (data) => {
    set(flightRef, {
      departingAirport: data.departingAirport,
      arrivingAirport: data.arrivingAirport,
      flight: data.flight,
    });
  };
  const writeAccommodationData = (data) => {
    set(accommodationRef, {
      accommodation: data.accommodation,
      address: data.address,
    });
  };

  useEffect(() => {
    onChildAdded(flightRef, (data) =>
      setFlight((prev) => ({ ...prev, [data.key]: data.val() }))
    );
    onChildAdded(accommodationRef, (data) =>
      setAccommodation((prev) => ({ ...prev, [data.key]: data.val() }))
    );

    onChildRemoved(flightRef, () => setFlight({}));
    onChildRemoved(accommodationRef, () => setAccommodation({}));

    onChildChanged(flightRef, (data) =>
      setFlight((prev) => ({ ...prev, [data.key]: data.val() }))
    );
    onChildChanged(accommodationRef, (data) =>
      setAccommodation((prev) => ({ ...prev, [data.key]: data.val() }))
    );
    return () => {
      off(flightRef);
      off(accommodationRef);
    };
  }, []);

  useEffect(() => {
    console.log(flight, accommodation);
  }, [flight, accommodation]);

  return (
    <>
      <form onSubmit={handleSubmit(writeFlightData)}>
        <div>
          <Controller
            name="departingAirport"
            control={control}
            defaultValue="JFK (John F. Kennedy International Airport)"
            render={({ field }) => (
              <TextField
                {...field}
                id="departingAirport"
                label="From"
                variant="filled"
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="arrivingAirport"
            control={control}
            defaultValue="SIN (Changi Airport)"
            render={({ field }) => (
              <TextField
                {...field}
                id="arrivingAirport"
                label="To"
                variant="filled"
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="flight"
            control={control}
            defaultValue="Singapore Airlines SQ 21"
            render={({ field }) => (
              <TextField
                {...field}
                id="flight"
                label="Flight"
                variant="filled"
              />
            )}
          />
        </div>
        <p>
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>
        </p>
      </form>
      <form onSubmit={handleSubmit(writeAccommodationData)}>
        <div>
          <Controller
            name="accommodation"
            control={control}
            defaultValue="Hilton Singapore Orchard"
            render={({ field }) => (
              <TextField
                {...field}
                id="accommodation"
                label="Staying at"
                variant="filled"
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="address"
            control={control}
            defaultValue="333 Orchard Rd, Singapore 238867"
            render={({ field }) => (
              <TextField
                {...field}
                id="address"
                label="Address"
                variant="filled"
              />
            )}
          />
        </div>
        <p>
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>
        </p>
      </form>
      <div>
        <p>Departing: {flight.departingAirport}</p>
        <p>Arriving: {flight.arrivingAirport}</p>
        <p>Flight: {flight.flight}</p>
      </div>
      <div>
        <p>Accommodation: {accommodation.accommodation}</p>
        <p>Address: {accommodation.address}</p>
      </div>
    </>
  );
}
