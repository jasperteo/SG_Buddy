import FlightForm from "./FlightForm";
import AccommodationForm from "./AccommodationForm";
import ItinerarySavedPlaces from "./ItinerarySavedPlaces";

export default function Itinerary({ uid }) {
  return (
    <>
      <FlightForm uid={uid} />
      <br />
      <AccommodationForm uid={uid} />
      <br />
      <ItinerarySavedPlaces uid={uid} />
    </>
  );
}
