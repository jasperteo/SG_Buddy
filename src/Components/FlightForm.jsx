import {
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material/";
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

  const FlightFormDialog = () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button
          sx={{ bgcolor: "#4D6D9A" }}
          variant="contained"
          onClick={() => setOpen(true)}
          endIcon={<iconify-icon icon="ic:twotone-flight" />}>
          Enter Flight Details
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle sx={{ bgcolor: "#FFDDE6" }}>Flight Details</DialogTitle>
          <DialogContent sx={{ bgcolor: "#FFDDE6" }}>
            <form>
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
                        onChange={(newValue) =>
                          setValue("arrivalDateTime", newValue)
                        }
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
              <p>
                <Controller
                  name="flightFile"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <Button
                      component="label"
                      endIcon={
                        <iconify-icon icon="ic:twotone-airplane-ticket" />
                      }>
                      Upload Ticket
                      <input
                        style={{ display: "none" }}
                        type="file"
                        onChange={(e) => field.onChange(e.target.files[0])}
                      />
                    </Button>
                  )}
                />
              </p>
            </form>
          </DialogContent>
          <DialogActions sx={{ bgcolor: "#FFDDE6" }}>
            <Button onClick={() => setOpen(false)} sx={{ color: "#5F6366" }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(writeFlightData)}
              endIcon={<iconify-icon icon="carbon:send" />}
              sx={{ color: "#5F6366" }}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <>
      <span>
        Departing: {flight.departingAirport}, {flight.departureDateTime}
      </span>
      <p>
        Arriving: {flight.arrivingAirport}, {flight.arrivalDateTime}
      </p>
      <p>Flight: {flight.flight}</p>
      <div>
        <a target="_blank" href={flight.flightFileURL} rel="noreferrer">
          <IconButton>
            <iconify-icon inline icon="carbon:attachment" />
          </IconButton>
        </a>
        <IconButton onClick={deleteFlightData}>
          <iconify-icon icon="carbon:trash-can" />
        </IconButton>
      </div>
      <FlightFormDialog />
    </>
  );
}
