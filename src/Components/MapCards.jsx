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
} from "firebase/database";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { database, storage } from "../Components/FirebaseConfig";

//save favourites key
const DB_FAVOURITES_KEY = "favourites";

//define and create the firebase RealTimeDatabase  reference
const favouriteListRef = ref(database, DB_FAVOURITES_KEY);

//mui color red reference
const theme = createTheme({
  palette: {
    primary: red,
  },
});

export default function MapCards({ places }) {
  //holds information on all places returned from recommendation form
  const [recommendation, setRecommendation] = useState(places);
  //holds information on saved places
  const [favPlaces, setFavPlaces] = useState([]);

  //retrieves the specific recommendation --> add to firebase
  const saveToFavs = (index) => {
    console.log(recommendation[index]);
    const place = recommendation[index];
    const newFavouriteRef = push(favouriteListRef);
    set(newFavouriteRef, {
      name: place.name,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      uuid: place.uuid,
    });
  };

  //deletes specific recommendation using data, which is key
  const deleteSavedFav = (data) => {
    console.log(`delete ${data}`);
    remove(ref(database, DB_FAVOURITES_KEY + "/" + data));
  };

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
  }, []);

  const favPlacesListItems = (places) => {
    console.log("reached favplaces func");
    if (places.length > 0) {
      return places.map((place) => (
        <li key={place.key}>
          <p>{place.val.name}</p>
          <p>{place.val.address}</p>
        </li>
      ));
    }
  };

  //vary button function and color based on if place is included as favourite
  const varyButton = (place, index) => {
    for (let i = 0; i < favPlaces.length; i++) {
      if (place.uuid === favPlaces[i].val.uuid) {
        return (
          <IconButton
            aria-label="add to favorites"
            color="primary"
            onClick={() => deleteSavedFav(favPlaces[i].key)}
          >
            <FavoriteIcon />
          </IconButton>
        );
      }
    }
    //if places not saved as favourite
    return (
      <IconButton
        aria-label="add to favorites"
        onClick={() => saveToFavs(index)}
      >
        <FavoriteIcon />
      </IconButton>
    );
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        {places.map((place, index) => (
          <Card key={place.uuid}>
            <CardHeader title={place.name} />
            <CardContent>
              <p>{place.address}</p>
            </CardContent>
            <CardActions>{varyButton(place, index)}</CardActions>
          </Card>
        ))}
        <ul>{favPlaces ? favPlacesListItems(favPlaces) : null}</ul>
      </ThemeProvider>
    </div>
  );
}
