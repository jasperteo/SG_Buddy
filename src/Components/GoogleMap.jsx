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
  //key for googlr maps api
  const key = import.meta.env.VITE_GMAP_API_KEY;
  console.log(places);

  //component renders google maps and markers for each recommendation
  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <APIProvider apiKey={key}>
        <Map
          center={{ lat: 1.3649170000000002, lng: 103.82287200000002 }}
          zoom={12}
          mapId={key}>
          <AdvancedMarker
            position={{ lat: 1.250111, lng: 103.830933 }}
            title={"Sentosa"}></AdvancedMarker>
          {places.map((place, index) => (
            <AdvancedMarker
              key={place.uuid}
              position={{
                lat: place.lat,
                lng: place.lng,
              }}
              title={place.name}></AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
