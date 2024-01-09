import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useContext, useEffect, useState } from "react";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref,
  remove,
  update,
  off,
} from "firebase/database";
import { database } from "../Components/FirebaseConfig";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import GoogleMap from "./GoogleMap";
import UidContext from "./Context";

//save favourites key
const DB_FAVOURITES_KEY = "favourites";

export default function ItinerarySavedPlaces() {
  //holds information on saved places
  const [favPlaces, setFavPlaces] = useState([]);
  const uid = useContext(UidContext);

  console.log(uid);

  //define and create the firebase RealTimeDatabase  reference
  const favouriteListRef = ref(database, `${uid}/${DB_FAVOURITES_KEY}`);

  //save date added by user for when they want to visit
  const addDate = (date, place) => {
    console.log(date.$d);
    console.log(place.key);
    if (date.$d) {
      update(ref(database, `${uid}/${DB_FAVOURITES_KEY}/${place.key}`), {
        name: place.val.name,
        address: place.val.address,
        lat: place.val.lat,
        lng: place.val.lng,
        uuid: place.val.uuid,
        date: date.$d,
      });
    }
  };

  //deletes specific recommendation using data, which is key
  const deleteSavedFav = (data) => {
    console.log(`delete ${data}`);
    remove(ref(database, `${uid}/${DB_FAVOURITES_KEY}/${data}`));
  };

  //sorts array of objects based on date property
  const sortedArray = favPlaces.sort((a, b) => {
    //convert strings back to date
    const dateA = a.val.date
      ? Date.parse(new Date(a.val.date))
      : Date.parse(new Date("9999-12-31"));
    const dateB = b.val.date
      ? Date.parse(new Date(b.val.date))
      : Date.parse(new Date("9999-12-31"));

    return dateA - dateB;
  });

  useEffect(() => {
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(
      favouriteListRef,
      (data) =>
        setFavPlaces((prev) => [...prev, { key: data.key, val: data.val() }]),
      setFavPlaces(sortedArray)
    );
    onChildRemoved(
      favouriteListRef,
      (data) =>
        setFavPlaces((prev) => prev.filter((item) => item.key !== data.key)),
      setFavPlaces(sortedArray)
    );
    onChildChanged(
      favouriteListRef,
      (data) =>
        setFavPlaces((prev) =>
          prev.map((item) =>
            item.key === data.key ? { key: data.key, val: data.val() } : item
          )
        ),
      setFavPlaces(sortedArray)
    );
    return () => off(favouriteListRef);
  }, [uid]);

  //renders list of all saved places regardless of category
  const favPlacesListItems = (places) => {
    console.log("reached favplaces func");
    if (places.length > 0) {
      return places.map((place, index) => (
        <Card key={place.key}>
          <CardHeader title={place.val.name} />
          <CardContent>
            <p>{place.val.address}</p>
            <br />
            <IconButton
              aria-label="add to favorites"
              sx={{ color: "#FD1D1D" }}
              onClick={() => deleteSavedFav(favPlaces[index].key)}
            >
              <FavoriteIcon />
            </IconButton>
            <DatePicker
              format={"DD/MM/YYYY"}
              label={place.val.date ? "Date" : "Choose a date"}
              defaultValue={place.val.date && dayjs(place.val.date)}
              disablePast
              views={["day", "month", "year"]}
              onChange={(e) => addDate(e, place)}
            />
          </CardContent>
        </Card>
      ));
    }
  };

  //retrieve val, excluding key from places so map component can read data
  const retrieveVal = () => {
    return favPlaces.map((obj) => obj.val);
  };

  return (
    <div>
      {favPlaces && <h2>Favourites</h2>}
      {favPlaces && favPlacesListItems(favPlaces)}
      {favPlaces && <GoogleMap places={retrieveVal()} />}
    </div>
  );
}
