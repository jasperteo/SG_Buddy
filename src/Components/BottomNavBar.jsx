import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import LogoutIcon from "@mui/icons-material/Logout";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

export default function BottomNavBar({ isLoggedIn, handleSignout }) {
  return (
    <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        showLabels

        // onChange={(event, newValue) => {
        //   setValue(newValue);
        // }}
      >
        <Link to="/explore-recommendations">
          <BottomNavigationAction
            label="Explore"
            icon={<TravelExploreIcon />}
          />
        </Link>
        <Link to="/itinerary">
          <BottomNavigationAction label="Itinerary" icon={<EventNoteIcon />} />
        </Link>

        <BottomNavigationAction
          onChange={handleSignout}
          label="Log out"
          icon={<LogoutIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
