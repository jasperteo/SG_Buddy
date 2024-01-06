import FlightForm from "./FlightForm";
import AccommodationForm from "./AccommodationForm";
import ItinerarySavedPlaces from "./ItinerarySavedPlaces";

export default function Itinerary({ uid }) {
  return (
    <>
      <ItinerarySavedPlaces uid={uid} />
      <br />
      <FlightForm uid={uid} />
      <br />
      <AccommodationForm uid={uid} />
      <br />
    </>
  );
}
