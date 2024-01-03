import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
// import { MarkerClusterer } from "@googlemaps/markerclusterer";
// import { Marker } from "@googlemaps/markerclusterer";
import { useEffect, useState, useRef } from "react";

export default function GoogleMap({ places }) {
  //key for google maps api
  const key = import.meta.env.VITE_GMAP_API_KEY;
  console.log(places);

  //component renders google maps and markers for each recommendation based on lat & long
  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <APIProvider apiKey={key}>
        <Map
          center={{ lat: 1.3649170000000002, lng: 103.82287200000002 }}
          zoom={12}
          mapId={key}
        >
          {places.data.map((place, index) => (
            <AdvancedMarker
              key={index}
              position={{
                lat: Number(place.location.latitude),
                lng: Number(place.location.longitude),
              }}
              title={place.name}
            ></AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
