import { auth, database, storage } from "./FirebaseConfig";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref as databaseRef,
  push,
  set,
  remove,
  update,
  off,
} from "firebase/database";
import {
  Button,
  CircularProgress,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from "@mui/material/";
import SendIcon from "@mui/icons-material/Send";
import { useForm, Controller } from "react-hook-form";

const DB_ITINERARY_KEY = "itinerary";
const DB_FLIGHT_KEY = "flight";
const DB_ACCOMMODATION_KEY = "accommodation";
const flightRef = databaseRef(database, DB_ITINERARY_KEY + "/" + DB_FLIGHT_KEY);
const accommodationRef = databaseRef(
  database,
  DB_ITINERARY_KEY + "/" + DB_ACCOMMODATION_KEY
);

export default function Itinerary() {
  const { register, handleSubmit, control } = useForm();

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
    </>
  );
}
