import { useState, useEffect } from "react";
import "./App.css";
import GoogleMap from "./Components/GoogleMap";
import RecommendationForm from "./Components/RecommendationForm";
import MapCards from "./Components/MapCards";
import Itinerary from "./Components/Itinerary";
import LoginForm from "./Components/LogInForm";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Components/FirebaseConfig";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function App() {
  //check login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //user info
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setEmail(auth.currentUser.email);
        setUid(auth.currentUser.uid);
      } else {
        setIsLoggedIn(false);
        setEmail("");
        setUid("");
      }
    });
  }, []);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <img
          width="200"
          height="200"
          src="https://img.icons8.com/clouds/400/passport.png"
          alt="passport"
        />
        <h1>RA Project 2</h1>
        <div>
          <LoginForm isLoggedIn={isLoggedIn} email={email} uid={uid} />
        </div>
        <div>
          <RecommendationForm />
          <Itinerary uid={uid} />
        </div>
      </LocalizationProvider>
    </>
  );
}
