import { Button, TextField } from "@mui/material/";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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

  return (
    <>
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
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>{" "}
          <Button
            onClick={deleteAccommodationData}
            variant="contained"
            endIcon={<DeleteIcon />}>
            Delete
          </Button>{" "}
          <Controller
            name="accommodationFile"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <Button
                component="label"
                variant="contained"
                endIcon={<CloudUploadIcon />}>
                Upload file
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
      <div>
        <p>Accommodation: {accommodation?.accommodation}</p>
        <p>Address: {accommodation?.address}</p>
        <a
          target="_blank"
          href={accommodation.accommodationFileURL}
          rel="noreferrer">
          <iconify-icon style={{ fontSize: "1.5em" }} icon="mdi:attachment" />
        </a>
      </div>
    </>
  );
}
