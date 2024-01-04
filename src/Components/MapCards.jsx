import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
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
} from "firebase/database";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { database, storage } from "../Components/FirebaseConfig";

//save favourites key
const DB_FAVOURITES_KEY = "favourites";

//define and create the firebase RealTimeDatabase  reference
const favouriteListRef = ref(database, DB_FAVOURITES_KEY);

export default function MapCards({ places }) {
  const [recommendation, setRecommendation] = useState(places);
  console.log(recommendation);

  //retrieves the specific recommendation --> add to firebase
  const saveToFavs = (index) => {
    console.log(recommendation[index]);
    const place = recommendation[index];
    const favouriteListRef = ref(database, DB_FAVOURITES_KEY);
    const newFavouriteRef = push(favouriteListRef);
    set(newFavouriteRef, {
      name: place.name,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      uuid: place.uuid,
    });
  };

  //deletes specific recommendation
  // const deleteSavedFav = (data) => {
  //    remove(databaseRef(database, DB_FAVOURITES_KEY + "/" + data.key))
  // }

  return (
    <div>
      {places.map((place, index) => (
        <Card key={place.uuid}>
          <CardHeader title={place.name} />
          <CardMedia
            component="img"
            height="194"
            image="/static/images/cards/paella.jpg"
            alt=""
          />
          <CardContent>
            <p>{place.address}</p>
          </CardContent>
          <CardActions>
            <IconButton
              aria-label="add to favorites"
              onClick={() => saveToFavs(index)}
            >
              <FavoriteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}
