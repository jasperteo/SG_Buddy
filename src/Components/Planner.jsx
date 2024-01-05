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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [itinerary, setItinerary] = useState({});
  const [activity, setActivity] = useState("");

  //date picker function to set dates
  const onChangeDates = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleChange = (event) => {
    setActivity(event.target.value);
  };

  //difference between start and end to calculate number of days
  const startDateObj = new Date(startDate);
  const calculateDateDifference = () => {
    const endDateObj = new Date(endDate);

    const differenceInMilliseconds = Math.abs(endDateObj - startDateObj);

    // Convert milliseconds to days
    const differenceInDays =
      1 + differenceInMilliseconds / (1000 * 60 * 60 * 24);

    return differenceInDays;
  };

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
    setItinerary(generateDates());
  }, [startDate, endDate]);

  //for every 1 day in differenceInDays, render a new card to store itinerary for that day
  const renderCards = () => {
    const startDateObj = new Date(startDate);
    const differenceInDays = calculateDateDifference();
    const cards = [];

    for (let i = 0; i < differenceInDays; i++) {
      const currentDate = new Date(
        startDateObj.getTime() + i * 24 * 60 * 60 * 1000
      );
      cards.push(
        <Card key={i}>
          <CardContent>
            <h3>{currentDate.toDateString()}</h3>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Saved places
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="places"
                value={activity}
                onChange={handleChange}
              >
                {places &&
                  places.map((place, index) => (
                    <MenuItem key={place.key} value={place.val.name}>
                      {place.val.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      );
    }

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
      <p> Difference in days: {calculateDateDifference()}</p>
      {renderCards()}
    </div>
  );
}
