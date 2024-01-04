import { useState } from "react";
import "./App.css";
import GoogleMap from "./Components/GoogleMap";
import RecommendationForm from "./Components/RecommendationForm";
import MapCards from "./Components/MapCards";
import Itinerary from "./Components/Itinerary";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <img
        width="200"
        height="200"
        src="https://img.icons8.com/clouds/400/passport.png"
        alt="passport"
      />
      <h1>RA Project 2</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <div>
        <RecommendationForm />
        <Itinerary />
      </div>
    </>
  );
}

export default App;
