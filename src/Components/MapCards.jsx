import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { red } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref,
  push,
  set,
  remove,
  update,
  off,
  getDatabase,
} from "firebase/database";
import { database, storage } from "../Components/FirebaseConfig";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

//save favourites key
const DB_FAVOURITES_KEY = "favourites";

//mui color red reference
const theme = createTheme({
  palette: {
    primary: red,
  },
});

export default function MapCards({ places, uid }) {
  //holds information on all places returned from recommendation form

  console.log(places);
  //holds information on saved places
  const [favPlaces, setFavPlaces] = useState([]);
  const [loginID, setLoginID] = useState(uid);

  //define and create the firebase RealTimeDatabase  reference
  const favouriteListRef = ref(database, `${uid}/${DB_FAVOURITES_KEY}`);

  //retrieves the specific place recommended --> add to firebase
  const saveToFavs = (index) => {
    console.log(places[index]);
    const place = places[index];
    const newFavouriteRef = push(favouriteListRef);
    set(newFavouriteRef, {
      name: place.name,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      uuid: place.uuid,
    });
  };

  //save date const
  const addDate = (date, place) => {
    console.log(date.$d);
    console.log(place.key);

    if (date.$d) {
      const db = getDatabase();
      update(ref(db, `/${uid}/favourites/${place.key}`), {
        name: place.val.name,
        address: place.val.address,
        lat: place.val.lat,
        lng: place.val.lng,
        uuid: place.val.uuid,
        date: date.$d,
      });
    }
  };

  //deletes specific place using data, which is key
  const deleteSavedFav = (data) => {
    console.log(`delete ${data}`);
    remove(ref(database, `${uid}/${DB_FAVOURITES_KEY}/${data}`));
  };

  //sorts array of objects based on date property
  // const sortedArray = [...favPlaces].sort((a, b) => {
  //   //convert strings back to date
  //   const dateA = a.val.date ? new Date(a.val.date) : new Date("9999-12-31"); // Use a max date value for objects without dates
  //   const dateB = b.val.date ? new Date(b.val.date) : new Date("9999-12-31");

  //   return dateA - dateB;
  // });

  useEffect(() => {
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(favouriteListRef, (data) =>
      setFavPlaces((prev) => [...prev, { key: data.key, val: data.val() }])
    );
    onChildRemoved(favouriteListRef, (data) =>
      setFavPlaces((prev) => prev.filter((item) => item.key !== data.key))
    );
    onChildChanged(favouriteListRef, (data) =>
      setFavPlaces((prev) =>
        prev.map((item) =>
          item.key === data.key ? { key: data.key, val: data.val() } : item
        )
      )
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
            <IconButton
              aria-label="add to favorites"
              color="primary"
              onClick={() => deleteSavedFav(favPlaces[index].key)}
            >
              <FavoriteIcon />
            </IconButton>

            <DatePicker
              inputFormat={"dd/MM/yyyy"}
              label={place.val.date ? "Date" : "Choose a date"}
              defaultValue={place.val.date && dayjs(place.val.date)}
              disablePast
              views={["year", "month", "day"]}
              onChange={(e) => addDate(e, place)}
            />
          </CardContent>
        </Card>
      ));
    }
  };

  //vary button function and color based on if place is included as favourite
  const varyButton = (place, index) => {
    const favoritePlace = favPlaces.find(
      (favPlace) => place.uuid === favPlace.val.uuid
    );
    return (
      <IconButton
        aria-label="add to favorites"
        color={favoritePlace ? "primary" : "default"}
        onClick={() =>
          favoritePlace ? deleteSavedFav(favoritePlace.key) : saveToFavs(index)
        }
      >
        <FavoriteIcon />
      </IconButton>
    );
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        {places &&
          places.map((place, index) => (
            <Card key={place.uuid}>
              <CardHeader title={place.name} />
              <CardContent>
                <p>{place.address}</p>
              </CardContent>
              <CardActions>{varyButton(place, index)}</CardActions>
            </Card>
          ))}
        {favPlaces && <h2>Favourites</h2>}
        {favPlaces && favPlacesListItems(favPlaces)}
      </ThemeProvider>
    </div>
  );
}
