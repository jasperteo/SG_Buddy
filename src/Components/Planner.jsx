import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Planner({ places }) {
  console.log(places);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  //date picker function to set dates
  const onChangeDates = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleChange = (event) => {
    console.log("hello");
  };

  //difference between start and end
  const calculateDateDifference = () => {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const differenceInMilliseconds = Math.abs(endDateObj - startDateObj);

    // Convert milliseconds to days (you can also get hours, minutes, etc. as needed)
    const differenceInDays =
      1 + differenceInMilliseconds / (1000 * 60 * 60 * 24);

    return differenceInDays;
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
      {/* <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Saved places</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="places"
            onChange={handleChange}
          >
            {places &&
              places.map((place, index) => (
                <MenuItem value={place.val.name}>{place.val.name}</MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box> */}
    </div>
  );
}
