import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";

export default function MapCards({ places, i }) {
  console.log(places);

  return (
    <div>
      {places.data.map((place, index) => (
        <Card key={index}>
          <CardHeader title={place.name} />
          <CardMedia
            component="img"
            height="194"
            image="/static/images/cards/paella.jpg"
            alt="test"
          />
          <CardContent>
            <p>
              {place.address.block} {place.address.buildingName}
              <br />
              {place.address.streetName} {place.address.postalCode}
            </p>
          </CardContent>
          <CardActions>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}
