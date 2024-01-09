import {
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material/";
import Box from "@mui/system/Box";
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
import { useState, useEffect, useContext } from "react";
import { database, storage } from "./FirebaseConfig";
import UidContext from "./Context";

const DB_FLIGHT_KEY = "itinerary/flight";

export default function FlightForm() {
  const [flight, setFlight] = useState({});
  const uid = useContext(UidContext);

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
          sx={{ bgcolor: "#4D6D9A", fontFamily: "IBM Plex Sans Var" }}
          variant="contained"
          onClick={() => setOpen(true)}
          endIcon={<iconify-icon icon="carbon:plane" />}>
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
                  defaultValue=""
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
              </div>
              <br />
              <div>
                <Controller
                  name="arrivingAirport"
                  control={control}
                  defaultValue=""
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
              </div>
              <br />
              <div>
                <Controller
                  name="flight"
                  control={control}
                  defaultValue=""
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
      <Box
        border="1px solid"
        borderColor="#5F6366"
        borderRadius="0.5em"
        bgcolor="#90CCF4"
        p="2em"
        width="100vw">
        <div className="flight-detail">
          <iconify-icon inline icon="carbon:departure" />{" "}
          {flight.departingAirport}
          <iconify-icon inline icon="carbon:arrow-right" />{" "}
          <iconify-icon inline icon="carbon:arrival" /> {flight.arrivingAirport}
          <div style={{ fontSize: "0.7em" }}>{flight.flight}</div>
        </div>
        <div className="flight-time">
          {flight.departureDateTime}{" "}
          <iconify-icon inline icon="carbon:arrow-right" />{" "}
          {flight.arrivalDateTime}
        </div>
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
      </Box>
    </>
  );
}
