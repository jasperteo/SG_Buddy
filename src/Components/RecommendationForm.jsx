import { useForm } from "react-hook-form";
import { Button, CircularProgress } from "@mui/material/";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import useSWR from "swr";
import { useState, useEffect } from "react";
import GoogleMap from "./GoogleMap";

export default function RecommendationForm() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [location, setLocation] = useState("");
  const [dataset, setDataset] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const API_KEY = import.meta.env.VITE_TIH_API_KEY;

  const onSubmit = (data) => {
    setLocation(`${data.firstItem}%2C${data.secondItem}`);
    setDataset(data.thirdItem);
    setFormSubmitted(true);
    return console.log(data, location, dataset);
  };

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
      ? `https://api.stb.gov.sg/services/navigation/v2/search?location=${location}&dataset=${dataset}`
      : null,
    fetcher
  );

  const suggestionParsed = (data) =>
    data.data.map((suggestion, index) => {
      return {
        name: suggestion.name,
        uuid: suggestion.uuid,
        lat: suggestion.location.latitude,
        lon: suggestion.location.longitude,
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
        <p>
          <label>
            First Item:{" "}
            <input
              type="text"
              defaultValue="1.255694"
              {...register("firstItem", { required: "This field is required" })}
            />
          </label>
        </p>
        {errors?.firstItem?.message}
        <p>
          <label>
            Second Item:{" "}
            <input
              type="text"
              defaultValue="103.81985"
              {...register("secondItem", {
                required: "This field is required",
              })}
            />
          </label>
        </p>
        {errors?.secondItem?.message}
        <p>
          <label>
            Third Item:{" "}
            <select {...register("thirdItem", { required: true })}>
              <option value="accommodation">Accommodation</option>
              <option value="attractions">Attractions</option>
              <option value="bars_clubs">Bars & Clubs</option>
              <option value="cruises">Cruises</option>
              <option value="events">Events</option>
              <option value="food_beverages">Food & Beverages</option>
              <option value="precincts">Precincts</option>
              <option value="shops">Shops</option>
              <option value="tours">Tours</option>
              <option value="venues">Venues</option>
            </select>
          </label>
        </p>
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
      <pre>
        {suggestionsRaw &&
          JSON.stringify(suggestionParsed(suggestionsRaw), null, 2)}
      </pre>
      {/* <pre>{suggestions && JSON.stringify(suggestionsRaw.data, null, 2)}</pre> */}

      {suggestionsRaw && <GoogleMap places={suggestionsRaw} />}
    </>
  );
}
