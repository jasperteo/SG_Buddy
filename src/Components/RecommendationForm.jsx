import {
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from "@mui/material/";
import SendIcon from "@mui/icons-material/Send";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import useSWR from "swr";
import { useState } from "react";
import GoogleMap from "./GoogleMap";
import MapCards from "./MapCards";

const API_KEY = import.meta.env.VITE_TIH_API_KEY;

export default function RecommendationForm({ uid }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [location, setLocation] = useState("");
  const [dataset, setDataset] = useState("");
  const [radius, setRadius] = useState(0);

  console.log(uid);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const suggestionsFetcher = async (apiURL) => {
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
    suggestionsFetcher
  );

  const locationFetch = () => {
    if (navigator.geolocation) {
      const success = (position) =>
        setLocation(
          `${position.coords.latitude}%2C${position.coords.longitude}`
        );
      const error = () => setLocation("1.288540%2C103.849297");
      navigator.geolocation.getCurrentPosition(success, error);
    } else setLocation("1.288540%2C103.849297");
  };

  const onSubmit = (data) => {
    locationFetch();
    setDataset(data.category);
    setRadius(data.radius);
    setFormSubmitted(true);
  };

  const places = suggestionsRaw?.data.map((suggestion, index) => {
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            name="radius"
            control={control}
            defaultValue="1000"
            rules={{
              required: "Enter a radius",
              max: { value: 42000, message: "Maximum radius of 42km" },
              pattern: {
                value: /^[0-9]*$/,
                message: "Please enter only numbers.",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                id="filled-basic"
                label="Radius (in metres)"
                variant="filled"
                error={!!errors.radius}
                helperText={errors?.radius?.message}
              />
            )}
          />
        </div>
        <div>
          <FormControl
            variant="filled"
            sx={{ m: 1, minWidth: 220 }}
            error={!!errors.category}
          >
            <InputLabel>Category</InputLabel>
            <Select
              {...register("category", { required: "Select a Category" })}
              id="category"
              defaultValue={[]}
              multiple
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
            <FormHelperText>{errors?.category?.message}</FormHelperText>
          </FormControl>
        </div>

        <p>
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>
        </p>
      </form>
      {isLoading && (
        <p>
          Loading...
          <iconify-icon
            inline
            icon="line-md:loading-twotone-loop"
            style={{ fontSize: "1.5em" }}
          />
        </p>
      )}
      {suggestionError?.message}
      <ul>
        {places &&
          places.map((place) => <li key={place.uuid}>{place.name}</li>)}
      </ul>
      {!!places && <GoogleMap places={places} />}
      {!!places && <MapCards places={places} uid={uid} />}
    </>
  );
}
