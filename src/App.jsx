import "./App.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import RecommendationForm from "./Components/RecommendationForm";
import Itinerary from "./Components/Itinerary";
import LoginForm from "./Components/LogInForm";
import { auth } from "./Components/FirebaseConfig";
import BottomNavBar from "./Components/BottomNavBar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UidContext from "./Components/Context";

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

  //controls path
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <LoginForm isLoggedIn={isLoggedIn} email={email} />
          <BottomNavBar isLoggedIn={isLoggedIn} />
        </div>
      ),
    },
    {
      path: "/explore-recommendations",
      element: (
        <div>
          <RecommendationForm uid={uid} />
          <BottomNavBar isLoggedIn={isLoggedIn} />
        </div>
      ),
    },
    {
      path: "/itinerary",
      element: (
        <div>
          <Itinerary />
          <BottomNavBar isLoggedIn={isLoggedIn} />
        </div>
      ),
    },
  ]);

  return (
    <>
      <img
        width="200"
        height="200"
        src="https://img.icons8.com/clouds/400/passport.png"
        alt="passport"
      />
      <div id="title">SG Buddy</div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <UidContext.Provider value={uid}>
          <RouterProvider router={router} />
        </UidContext.Provider>
      </LocalizationProvider>
    </>
  );
}

export { UidContext };
