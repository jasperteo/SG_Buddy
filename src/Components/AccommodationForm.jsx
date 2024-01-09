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

const DB_ACCOMMODATION_KEY = "itinerary/accommodation";

export default function AccommodationForm() {
  const [accommodation, setAccommodation] = useState({});
  const uid = useContext(UidContext);
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
          sx={{ bgcolor: "#4D6D9A", fontFamily: "IBM Plex Sans Var" }}
          variant="contained"
          onClick={() => setOpen(true)}
          endIcon={<iconify-icon icon="carbon:hotel" />}>
          Enter Accommodation Details
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle sx={{ bgcolor: "#FFDDE6" }}>
            Accommodation Details
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "#FFDDE6" }}>
            <form onSubmit={handleSubmit(writeAccommodationData)}>
              <div>
                <Controller
                  name="accommodation"
                  control={control}
                  defaultValue=""
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
                  defaultValue=""
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
          <DialogActions sx={{ bgcolor: "#FFDDE6" }}>
            <Button onClick={() => setOpen(false)} sx={{ color: "#5F6366" }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(writeAccommodationData)}
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
        {" "}
        <div className="accommodation">
          {accommodation?.accommodation}
          <div style={{ fontSize: "0.66em", fontWeight: "400" }}>
            {accommodation?.address}
          </div>
        </div>
        <div>
          <a
            target="_blank"
            href={accommodation.accommodationFileURL}
            rel="noreferrer">
            <IconButton>
              <iconify-icon inline icon="carbon:attachment" />
            </IconButton>
          </a>
          <IconButton onClick={deleteAccommodationData}>
            <iconify-icon icon="carbon:trash-can" />
          </IconButton>
        </div>
        <AccommodationFormDialog />
      </Box>
    </>
  );
}
