import { Button, ButtonGroup, TextField } from "@mui/material/";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref as databaseRef,
  set,
  remove,
  off,
} from "firebase/database";
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
  deleteObject,
} from "firebase/storage";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { database, storage } from "./FirebaseConfig";

const DB_FLIGHT_KEY = "itinerary/flight";

export default function FlightForm({ uid }) {
  const [flight, setFlight] = useState({});

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  const flightRef = databaseRef(database, `${uid}/${DB_FLIGHT_KEY}`);

  const writeFlightData = async (data) => {
    let url = "";
    let name = "";
    if (data.flightFile) {
      const newStorageRef = storageRef(
        storage,
        `${uid}/${DB_FLIGHT_KEY}/${data.flightFile.name}`
      );
      await uploadBytes(newStorageRef, data.flightFile);
      url = await getDownloadURL(newStorageRef);
      name = data.flightFile.name;
    }
    set(flightRef, {
      departingAirport: data.departingAirport,
      departureDateTime: data.departureDateTime.$d.toLocaleString(),
      arrivingAirport: data.arrivingAirport,
      arrivalDateTime: data.arrivalDateTime.$d.toLocaleString(),
      flight: data.flight,
      flightFileURL: url,
      flightFileName: name,
    });
  };

  const deleteFlightData = async () => {
    if (flight.flightFileName) {
      await deleteObject(
        storageRef(storage, `${uid}/${DB_FLIGHT_KEY}/${flight.flightFileName}`)
      );
    }
    remove(flightRef);
  };

  useEffect(() => {
    onChildAdded(flightRef, (data) =>
      setFlight((prev) => ({ ...prev, [data.key]: data.val() }))
    );
    onChildChanged(flightRef, (data) =>
      setFlight((prev) => ({ ...prev, [data.key]: data.val() }))
    );
    onChildRemoved(flightRef, () => setFlight({}));
    return () => off(flightRef);
  }, [uid]);

  return (
    <>
      <form onSubmit={handleSubmit(writeFlightData)}>
        <div>
          <Controller
            name="departingAirport"
            control={control}
            defaultValue="JFK (John F. Kennedy International Airport)"
            rules={{ required: "Enter Departing Airport" }}
            render={({ field }) => (
              <TextField
                {...field}
                id="departingAirport"
                label="From"
                variant="filled"
                error={!!errors.departingAirport}
              />
            )}
          />
        </div>
        <br />
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="departureDateTime"
              control={control}
              defaultValue={null}
              rules={{ required: "Enter Departure Date and Time" }}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  disablePast
                  label="Departure Date & Time"
                  format={"DD/MM/YYYY hh:mm a"}
                  value={field.value}
                  onChange={(newValue) =>
                    setValue("departureDateTime", newValue)
                  }
                  slotProps={{
                    textField: {
                      helperText: errors?.departureDateTime?.message,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </div>
        <br />
        <div>
          <Controller
            name="arrivingAirport"
            control={control}
            defaultValue="SIN (Changi Airport)"
            rules={{ required: "Enter Arriving Airport" }}
            render={({ field }) => (
              <TextField
                {...field}
                id="arrivingAirport"
                label="To"
                variant="filled"
                error={!!errors.arrivingAirport}
                helperText={errors?.arrivingAirport?.message}
              />
            )}
          />
        </div>
        <br />
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="arrivalDateTime"
              control={control}
              defaultValue={null}
              rules={{ required: "Enter Arrival Date and Time" }}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  disablePast
                  label="Arrival Date & Time"
                  format={"DD/MM/YYYY hh:mm a"}
                  value={field.value}
                  onChange={(newValue) => setValue("arrivalDateTime", newValue)}
                  slotProps={{
                    textField: {
                      helperText: errors?.arrivalDateTime?.message,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </div>
        <br />
        <div>
          <Controller
            name="flight"
            control={control}
            defaultValue="Singapore Airlines SQ 23"
            rules={{ required: "Enter Flight" }}
            render={({ field }) => (
              <TextField
                {...field}
                id="flight"
                label="Flight"
                variant="filled"
                error={!!errors.flight}
                helperText={errors?.flight?.message}
              />
            )}
          />
        </div>

        <ButtonGroup variant="contained">
          <Button type="submit" endIcon={<SendIcon />}>
            Send
          </Button>
          <Button onClick={deleteFlightData} endIcon={<DeleteIcon />}>
            Delete
          </Button>
          <Controller
            name="flightFile"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <Button component="label" endIcon={<CloudUploadIcon />}>
                Upload file
                <input
                  style={{ display: "none" }}
                  type="file"
                  onChange={(e) => field.onChange(e.target.files[0])}
                />
              </Button>
            )}
          />
        </ButtonGroup>
      </form>
      <div>
        <p>
          Departing: {flight.departingAirport}, {flight.departureDateTime}
        </p>
        <p>
          Arriving: {flight.arrivingAirport}, {flight.arrivalDateTime}
        </p>
        <p>Flight: {flight.flight}</p>
        <a target="_blank" href={flight.flightFileURL} rel="noreferrer">
          <iconify-icon style={{ fontSize: "1.5em" }} icon="mdi:attachment" />
        </a>
      </div>
    </>
  );
}
