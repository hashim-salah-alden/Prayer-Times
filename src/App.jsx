/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Divider } from "@mui/material";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import PrayerCard from "./components/PrayerCard";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import moment from "moment";
import "moment/dist/locale/ar";
import axios from "axios";
import { useState, useEffect } from "react";

moment.locale("ar");
const Time = moment().format("DD, MMM ,  YYYY");

const cities = [
  { apiName: "cairo", displayname: "القاهرة" },
  { apiName: "alexandria", displayname: "الاسكندرية" },
  { apiName: "Luxor", displayname: "الأقصر" },
];
const prayers = [
  {
    key: "Fajr",
    prayerName: "الفجر",
    prayerImage: "../public/images/fajr-prayer.png",
  },
  {
    key: "Dhuhr",
    prayerName: "الظهر",
    prayerImage: "../public/images/dhhr-prayer-mosque.png",
  },
  {
    key: "Asr",
    prayerName: "العصر",
    prayerImage: "../public/images/asr-prayer-mosque.png",
  },
  {
    key: "Sunset",
    prayerName: "المغرب",
    prayerImage: "../public/images/sunset-prayer-mosque.png",
  },
  {
    key: "Isha",
    prayerName: "العشاء",
    prayerImage: "../public/images/night-prayer-mosque.png",
  },
];
function App() {
  const [timings, setTimings] = useState({
    Fajr: "04:41",
    Dhuhr: "12:52",
    Asr: "16:28",
    Sunset: "19:30",
    Isha: "21:00",
  });

  const [selectedCity, setSelectedCity] = useState({
    apiName: "cairo",
    displayname: "القاهرة",
  });

  const [nextPrayer, setNextPrayer] = useState({
    key: "Fajr",
    prayerName: "الفجر",
    prayerImage: "../public/images/fajr-prayer.png",
  });

  const [remainingTime, setRemainingTime] = useState("");

  const handleCityChange = (event) => {
    const cityObject = cities.find((city) => {
      return city.apiName == event.target.value;
    });
    setSelectedCity(cityObject);
  };

  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity/27-04-2024?city=${selectedCity.apiName}&country=Egypt&method=8`
    );
    setTimings(response.data.data.timings);
  };

  useEffect(() => {
    getTimings();
  }, [selectedCity]);

  useEffect(() => {
    setupCountdownTimer();
  }, [timings]);

  useEffect(() => {
    const updateReminingTime = setInterval(() => setupCountdownTimer(), 1000);

    return () => {
      clearInterval(updateReminingTime);
    };
  }, [timings]);

  // timings[prayer.key]
  const setupCountdownTimer = () => {
    console.log("fire");
    let timeNow = moment();
    let prayerIndex = 2;

    prayers.map((prayer, index) => {
      if (
        timeNow.isAfter(moment(timings[prayer?.key], "hh:mm")) &&
        timeNow.isBefore(moment(timings[prayers[index + 1]?.key], "hh:mm"))
      ) {
        prayerIndex = index + 1;
      } else if (timeNow.isAfter(moment(timings["Isha"], "hh:mm"))) {
        prayerIndex = 0;
      }
    });

    setNextPrayer(prayers[prayerIndex]);

    const nextPrayerTime = timings[nextPrayer.key];
    let remainingTimeToNextPrayer = null;

    if (nextPrayer.key == "Fajr") {
      const timeUntilMidNight = moment("23:59", "hh:mm").diff(timeNow);
      const timeUntilFajrPrayer = moment(nextPrayerTime, "hh:mm").diff(
        moment("00:00:00", "hh:mm")
      );
      remainingTimeToNextPrayer = timeUntilMidNight + timeUntilFajrPrayer;

      // do the logic of fajr prayer !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    } else {
      remainingTimeToNextPrayer = moment(nextPrayerTime, "hh:mm").diff(timeNow);
    }

    const durationRemainingTime = moment.duration(remainingTimeToNextPrayer);
    setRemainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: "150px", padding: "5px" }}>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Box>
          <Stack spacing={2}>
            <Box>{Time}</Box>
            <Box>{selectedCity.displayname}</Box>
          </Stack>
        </Box>
        <Box>
          <Stack spacing={2}>
            <Box>متبقي حتي صلاة {nextPrayer.prayerName}</Box>
            <Box>{remainingTime}</Box>
          </Stack>
        </Box>
      </Stack>
      <Divider sx={{ mt: "50px" }} color="gray" />

      <Stack sx={{ mt: "80px", gap: "20px" }} direction="row" spacing={2}>
        {prayers.map((prayer) => {
          return (
            <PrayerCard
              prayerName={prayer.prayerName}
              prayerTime={timings[prayer?.key]}
              prayerImage={prayer.prayerImage}
              key={prayer.prayerName}
            />
          );
        })}
      </Stack>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "20px",
        }}
      >
        <FormControl sx={{ width: "250px" }}>
          <InputLabel sx={{ color: "#888" }} id="demo-simple-select-label">
            {selectedCity.displayname}
          </InputLabel>
          <Select
            sx={{ color: "#888" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="city"
            onChange={(e) => {
              handleCityChange(e);
            }}
          >
            {cities.map((city) => {
              return (
                <MenuItem key={city.apiName} value={city.apiName}>
                  {city.displayname}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    </Container>
  );
}

export default App;
