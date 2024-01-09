import {
  APIProvider,
  Map,
  InfoWindow,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useState } from "react";

export default function GoogleMap({ places }) {
  //key for google maps api
  const key = import.meta.env.VITE_GMAP_API_KEY;

  //for markers'info window
  const [selectedPlace, setSelectedPlace] = useState(null);

  //component renders google maps and markers for each recommendation based on lat & long
  return (
    <div id="map" style={{ height: "80vh", width: "100%" }}>
      <APIProvider apiKey={key}>
        <Map
          center={{ lat: 1.3649170000000002, lng: 103.82287200000002 }}
          zoom={12}
          mapId={key}>
          {places.map((place) => (
            <AdvancedMarker
              key={place.uuid}
              position={{
                lat: place.lat,
                lng: place.lng,
              }}
              title={place.name}
              onClick={() => {
                place === selectedPlace
                  ? setSelectedPlace(null)
                  : setSelectedPlace(place);
              }}></AdvancedMarker>
          ))}
          {selectedPlace && (
            <InfoWindow
              position={{
                lat: selectedPlace.lat,
                lng: selectedPlace.lng,
              }}
              onCloseClick={() => setSelectedPlace(undefined)}>
              <div>
                <p>{selectedPlace.name}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
