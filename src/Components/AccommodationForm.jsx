import {
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material/";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
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

const DB_ACCOMMODATION_KEY = "itinerary/accommodation";

export default function AccommodationForm({ uid }) {
  const [accommodation, setAccommodation] = useState({});

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const accommodationRef = databaseRef(
    database,
    `${uid}/${DB_ACCOMMODATION_KEY}`
  );

  const writeAccommodationData = async (data) => {
    let name = "";
    let url = "";
    if (data.accommodationFile) {
      const newStorageRef = storageRef(
        storage,
        `${uid}/${DB_ACCOMMODATION_KEY}/${data.accommodationFile.name}`
      );
      await uploadBytes(newStorageRef, data.accommodationFile);
      url = await getDownloadURL(newStorageRef);
      name = data.accommodationFile.name;
    }
    set(accommodationRef, {
      accommodation: data.accommodation,
      address: data.address,
      accommodationFileURL: url,
      accommodationFileName: name,
    });
  };

  const deleteAccommodationData = async () => {
    if (accommodation.accommodationFileName) {
      await deleteObject(
        storageRef(
          storage,
          `${uid}/${DB_ACCOMMODATION_KEY}/${accommodation.accommodationFileName}`
        )
      );
    }
    remove(accommodationRef);
  };

  useEffect(() => {
    onChildAdded(accommodationRef, (data) =>
      setAccommodation((prev) => ({ ...prev, [data.key]: data.val() }))
    );
    onChildChanged(accommodationRef, (data) =>
      setAccommodation((prev) => ({ ...prev, [data.key]: data.val() }))
    );
    onChildRemoved(accommodationRef, () => setAccommodation({}));
    return () => off(accommodationRef);
  }, [uid]);

  const AccommodationFormDialog = () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          endIcon={<iconify-icon icon="ic:twotone-hotel" />}>
          Enter Accommodation Details
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Accommodation Details</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(writeAccommodationData)}>
              <div>
                <Controller
                  name="accommodation"
                  control={control}
                  defaultValue="Hilton Singapore Orchard"
                  rules={{ required: "Enter Accommodation" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="accommodation"
                      label="Staying at"
                      variant="filled"
                      error={!!errors.accommodation}
                      helperText={errors?.accommodation?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name="address"
                  control={control}
                  defaultValue="333 Orchard Rd, Singapore 238867"
                  rules={{ required: "Enter Address" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="address"
                      label="Address"
                      variant="filled"
                      error={!!errors.address}
                      helperText={errors?.address?.message}
                    />
                  )}
                />
              </div>
              <p>
                <Controller
                  name="accommodationFile"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <Button
                      component="label"
                      endIcon={<iconify-icon icon="ic:twotone-upload-file" />}>
                      Upload Booking
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
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit(writeAccommodationData)}
              endIcon={<SendIcon />}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <>
      <div>
        <AccommodationFormDialog />
        <p>Accommodation: {accommodation?.accommodation}</p>
        <p>Address: {accommodation?.address}</p>
        <a
          target="_blank"
          href={accommodation.accommodationFileURL}
          rel="noreferrer">
          <IconButton>
            <iconify-icon inline icon="carbon:attachment" />
          </IconButton>
        </a>
        <IconButton onClick={deleteAccommodationData}>
          <DeleteIcon />
        </IconButton>
      </div>
    </>
  );
}
