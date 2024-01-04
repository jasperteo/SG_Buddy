import { useForm, Controller } from "react-hook-form";
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
import axios from "axios";
import useSWR from "swr";
import { useState } from "react";
import GoogleMap from "./GoogleMap";
import MapCards from "./MapCards";

export default function RecommendationForm() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [location, setLocation] = useState("");
  const [dataset, setDataset] = useState("");
  const [radius, setRadius] = useState(1000);
  const API_KEY = import.meta.env.VITE_TIH_API_KEY;

  const fetcher = async (apiURL) => {
    const response = await axios.get(apiURL, {
      headers: {
        "Content-Type": "application/json",
        "X-Content-Language": "en",
        "X-API-Key": API_KEY,
      },
    });
    return response.data;
  };

  const {
    data: suggestionsRaw,
    error: suggestionError,
    isLoading,
  } = useSWR(
    formSubmitted
      ? `https://api.stb.gov.sg/services/navigation/v2/search?location=${location}&dataset=${dataset}&radius=${radius}`
      : null,
    fetcher
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLocation(`${data.firstItem}%2C${data.secondItem}`);
    setDataset(data.category);
    setRadius(data.radius);
    setFormSubmitted(true);
  };

  const suggestionParsed = suggestionsRaw?.data.map((suggestion, index) => {
    return {
      name: suggestion.name,
      uuid: suggestion.uuid,
      lat: suggestion.location.latitude,
      lng: suggestion.location.longitude,
      index: index,
      address: `${
        suggestion.address.block ? suggestion.address.block + " " : ""
      }${suggestion.address.streetName}${
        suggestion.address.buildingName
          ? ", " + suggestion.address.buildingName
          : ""
      }${
        suggestion.address.floorNumber
          ? ", #" + suggestion.address.floorNumber + "-"
          : ""
      }${suggestion.address.unitNumber}${
        suggestion.address.postalCode
          ? ", Singapore " + suggestion.address.postalCode
          : ""
      }`,
    };
  });

  return (
    <>
      {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
        <div>
          <Controller
            name="firstItem"
            control={control}
            defaultValue="1.255694"
            render={({ field }) => (
              <TextField
                {...field}
                id="filled-basic"
                label="First Item"
                variant="filled"
                helperText="Required"
              />
            )}
          />
        </div>
        {errors?.firstItem?.message}
        <br />
        <div>
          <Controller
            name="secondItem"
            control={control}
            defaultValue="103.81985"
            render={({ field }) => (
              <TextField
                {...field}
                id="filled-basic"
                label="Second Item"
                variant="filled"
                helperText="Required"
              />
            )}
          />
        </div>
        {errors?.secondItem?.message}
        <br />
        <div>
          <Controller
            name="radius"
            control={control}
            defaultValue="1000"
            render={({ field }) => (
              <TextField
                {...field}
                id="filled-basic"
                label="Radius (in metres)"
                variant="filled"
                helperText="Required"
              />
            )}
          />
        </div>
        <br />
        <div>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              {...register("category", { required: true })}
              id="category"
              defaultValue=""
            >
              <MenuItem value="accommodation">Accommodation</MenuItem>
              <MenuItem value="attractions">Attractions</MenuItem>
              <MenuItem value="bars_clubs">Bars & Clubs</MenuItem>
              <MenuItem value="cruises">Cruises</MenuItem>
              <MenuItem value="events">Events</MenuItem>
              <MenuItem value="food_beverages">Food & Beverages</MenuItem>
              <MenuItem value="precincts">Precincts</MenuItem>
              <MenuItem value="shops">Shops</MenuItem>
              <MenuItem value="tours">Tours</MenuItem>
              <MenuItem value="venues">Venues</MenuItem>
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>
        </div>
        <p>
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>
        </p>
      </form>
      {!!isLoading && (
        <p>
          Loading...
          <CircularProgress />
        </p>
      )}
      {suggestionError?.message}

      {suggestionsRaw && <GoogleMap places={suggestionsRaw} />}
      {suggestionsRaw && <MapCards places={suggestionsRaw} />}
    </>
  );
}
