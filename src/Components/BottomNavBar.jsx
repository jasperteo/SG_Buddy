import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import LogoutIcon from "@mui/icons-material/Logout";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

export default function BottomNavBar({ isLoggedIn }) {
  const [value, setValue] = useState(0);
  return (
    <div>
      {isLoggedIn && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <BottomNavigation
            sx={{ bgcolor: "#4D6D9A" }}
            showLabels
            value={value}
            onChange={(e, newValue) => {
              setValue(newValue);
            }}
          >
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
              label="Log out"
              icon={<LogoutIcon />}
            />
          </BottomNavigation>
        </Box>
      )}
    </div>
  );
}
