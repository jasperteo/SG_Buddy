import FlightForm from "./FlightForm";
import AccommodationForm from "./AccommodationForm";

export default function Itinerary({ uid }) {
  return (
    <>
      <FlightForm uid={uid} />
      <br />
      <AccommodationForm uid={uid} />
    </>
  );
}
