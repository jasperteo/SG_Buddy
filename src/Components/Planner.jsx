import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function Planner({ places }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [itinerary, setItinerary] = useState({});

  console.log("planner");

  //date picker function to set dates
  const onChangeDates = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleChange = (date, e) => {
    const updatedItinerary = { ...itinerary };

    // Update the activity for the specific date
    updatedItinerary[date] = {
      ...updatedItinerary[date],
      activity: e.target.value,
    };

    setItinerary(updatedItinerary);
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
                  value={
                    itinerary[date].activity ? itinerary[date].activity : ""
                  } // Assuming you have an 'activity' property in each date's object
                  onChange={(e) => handleChange(date, e)} // Pass the date to the handleChange function
                >
                  {places.map((place) => (
                    <MenuItem key={place.key} value={place.val.name}>
                      {place.val.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
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
