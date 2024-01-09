import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useContext, useEffect, useState } from "react";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref,
  push,
  set,
  remove,
  off,
} from "firebase/database";
import { database } from "./FirebaseConfig";
import ItinerarySavedPlaces from "./ItinerarySavedPlaces";
import UidContext from "./Context";

//save favourites key
const DB_FAVOURITES_KEY = "favourites";

export default function MapCards({ places }) {
  //holds information on saved places
  const [favPlaces, setFavPlaces] = useState([]);

  const uid = useContext(UidContext);

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

  //deletes specific place using data, which is key
  const deleteSavedFav = (data) => {
    console.log(`delete ${data}`);
    remove(ref(database, `${uid}/${DB_FAVOURITES_KEY}/${data}`));
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
  }, [uid]);

  //vary button function and color based on if place is included as favourite
  const varyButton = (place, index) => {
    const favoritePlace = favPlaces.find(
      (favPlace) => place.uuid === favPlace.val.uuid
    );
    return (
      <IconButton
        id="fav-icon"
        aria-label="add to favorites"
        sx={{ color: favoritePlace ? "#FD1D1D" : "#A9A9A9" }}
        onClick={() =>
          favoritePlace ? deleteSavedFav(favoritePlace.key) : saveToFavs(index)
        }>
        <FavoriteIcon />
      </IconButton>
    );
  };

  return (
    <div>
      {places &&
        places.map((place, index) => (
          <Card key={place.uuid}>
            <CardHeader title={place.name} />
            <CardContent>{place.address}</CardContent>
            <CardActions>{varyButton(place, index)}</CardActions>
          </Card>
        ))}
      <ItinerarySavedPlaces uid={uid} />
    </div>
  );
}
