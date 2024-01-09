import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BottomNavBar({ isLoggedIn }) {
  const [value, setValue] = useState(2);

  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/explore-recommendations":
        setValue(0);
        break;
      case "/itinerary":
        setValue(1);
        break;
      case "/":
        setValue(2);
        break;
      default:
        setValue(2);
    }
  }, [location.pathname]);

  return (
    <div>
      {!!isLoggedIn && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <BottomNavigation
            sx={{ bgcolor: "#4D6D9A" }}
            showLabels
            value={value}
            onChange={(e, newValue) => {
              setValue(newValue);
            }}>
            <BottomNavigationAction
              sx={{ "*": { color: value === 0 ? "#F78888" : "#90CCF4" } }}
              component={RouterLink}
              to="/explore-recommendations"
              label="Explore"
              icon={<TravelExploreIcon />}
            />

            <BottomNavigationAction
              sx={{ "*": { color: value === 1 ? "#F78888" : "#90CCF4" } }}
              component={RouterLink}
              to="/itinerary"
              label="Itinerary"
              icon={<EventNoteIcon />}
            />

            <BottomNavigationAction
              sx={{ "*": { color: value === 2 ? "#F78888" : "#90CCF4" } }}
              component={RouterLink}
              to="/"
              label="Account"
              icon={<AccountCircleIcon />}
            />
          </BottomNavigation>
        </Box>
      )}
    </div>
  );
}
