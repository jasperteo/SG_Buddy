import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import LogoutIcon from "@mui/icons-material/Logout";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";

export default function BottomNavBar({ isLoggedIn, handleSignout }) {
  return (
    <div>
      {isLoggedIn && (
        <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
          <BottomNavigation showLabels>
            <BottomNavigationAction
              component={RouterLink}
              to="/explore-recommendations"
              label="Explore"
              icon={<TravelExploreIcon />}
            />

            <BottomNavigationAction
              component={RouterLink}
              to="/itinerary"
              label="Itinerary"
              icon={<EventNoteIcon />}
            />

            <BottomNavigationAction
              component={RouterLink}
              to="/"
              onChange={handleSignout}
              label="Log out"
              icon={<LogoutIcon />}
            />
          </BottomNavigation>
        </Box>
      )}
    </div>
  );
}
