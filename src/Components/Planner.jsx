import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button } from "@mui/material/";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref,
  set,
  push,
  remove,
  off,
} from "firebase/database";
import { database } from "./FirebaseConfig";

const DB_ACTIVITY_KEY = "itinerary/activity";

export default function Planner({ places, uid }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [itinerary, setItinerary] = useState({});

  console.log("planner");

  //define and create the firebase RealTimeDatabase  reference
  const activityListRef = ref(database, uid + "/" + DB_ACTIVITY_KEY);

  //date picker function to set dates
  const onChangeDates = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleChange = (date, e) => {
    const updatedItinerary = { ...itinerary };

    // Check if there's an existing entry for the date
    if (updatedItinerary[date]) {
      // If there's an 'activities' array, add the new activity
      if (updatedItinerary[date].activities) {
        updatedItinerary[date].activities.push({
          activity: e.target.value.val.name,
          address: e.target.value.val.address,
        });
      } else {
        // If there's no 'activities' array, create a new one with the current and new activity
        updatedItinerary[date].activities = [
          {
            activity: e.target.value.val.name,
            address: e.target.value.val.address,
          },
        ];
      }
    }

    setItinerary(updatedItinerary);
    const newActivityRef = push(activityListRef);
    set(newActivityRef, { itinerary });
  };

  //difference between start and end to calculate number of days
  const startDateObj = new Date(startDate);
  const calculateDateDifference = () => {
    const endDateObj = new Date(endDate);

    const differenceInMilliseconds = Math.abs(endDateObj - startDateObj);

    // Convert milliseconds to days
    const differenceInDays =
      1 + Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    return differenceInDays;
  };

  const totalDays = calculateDateDifference();

  //itinerary state stores all information on dates/ places added
  //function below adds new dates to state for each individual day
  const generateDates = () => {
    const startDateObj = new Date(startDate);
    const dates = {};

    for (let i = 0; i < calculateDateDifference(); i++) {
      const currentDate = new Date(
        startDateObj.getTime() + i * 24 * 60 * 60 * 1000
      );
      dates[currentDate.toDateString()] = {};
    }

    return dates;
  };

  //changes dates in itinerary state in event of dates change
  useEffect(() => {
    if (startDate && endDate) {
      setItinerary(generateDates());
    }
  }, [startDate, endDate]);

  //render activities under individual date
  const renderActivities = (activities) => {
    console.log(activities);
    const section = [];

    console.log(section);
    for (let i = 0; i < activities.length; i++) {
      section.push(
        <p key={i}>
          {" "}
          {activities[i].activity} <br></br> {activities[i].address}
        </p>
      );
    }

    return section;
  };

  //delete activities under specific date
  const deleteActivities = (date) => {
    //copy over existing itinerary
    const updatedItinerary = { ...itinerary };

    // empty activity array only for that specific date
    updatedItinerary[date].activities = [];

    setItinerary(updatedItinerary);
  };

  //for each day, render a new card to store itinerary for that day
  const renderCards = () => {
    const itineraryKeys = Object.keys(itinerary);
    console.log(itineraryKeys);
    const cards = [];

    itineraryKeys.forEach((date, index) => {
      cards.push(
        <Card key={index}>
          <CardContent>
            <h3>{date}</h3>

            {places && (
              <FormControl fullWidth>
                <InputLabel id={`demo-simple-select-label-${index}`}>
                  Saved places
                </InputLabel>
                <Select
                  labelId={`demo-simple-select-label-${index}`}
                  id={`demo-simple-select-${index}`}
                  label="places"
                  value={itinerary[date].activity}
                  onChange={(e) => handleChange(date, e)} // Pass the date to the handleChange function
                >
                  {places.map((place) => (
                    <MenuItem key={place.key} value={place}>
                      {place.val.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <div>
              <ul>
                {itinerary[date].activities &&
                  renderActivities(itinerary[date].activities)}
              </ul>
              {itinerary[date].activities && (
                <Button
                  // onClick={deleteActivities(date)}
                  variant="primary"
                  endIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              )}
            </div>
            {/* )} */}
          </CardContent>
        </Card>
      );
    });

    return cards;
  };

  return (
    <div>
      <p>Add trip dates</p>
      <DatePicker
        selected={startDate}
        onChange={onChangeDates}
        minDate={new Date()}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        showDisabledMonthNavigation
      />
      <p>Difference in days:{endDate && calculateDateDifference()} </p>
      {endDate && renderCards()}
    </div>
  );
}
