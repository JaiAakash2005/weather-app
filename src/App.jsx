import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [state, setState] = useState({
    condition: false,
    weatherData: null,
  });
  const inputRef = useRef();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      (error) => {
        alert("Geolocation error:", error);
      }
    );
  }, []);

  async function getWeatherByCoords(lat, lon) {
    const apiKey = "5cdd1e6645a882b165a1165fe76c97cb";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    try {
      const API = await fetch(url);
      if (!API.ok) {
        throw new Error(`Error: ${API.status}`);
      }
      const response = await API.json();
      setState({
        weatherData: response,
        condition: true,
      });
    } catch (err) {
      console.error("Failed to fetch weather data:", err);
      setState({
        weatherData: null,
        condition: false,
      });
    }
  }

  async function getWeather(city) {
    const apiKey = "5cdd1e6645a882b165a1165fe76c97cb";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    try {
      const API = await fetch(url);
      if (!API.ok) {
        throw new Error(`Error: ${API.status}`);
      }
      const response = await API.json();
      setState({
        weatherData: response,
        condition: true,
      });
    } catch (err) {
      alert("Failed to fetch weather data:", err);
      setState({
        weatherData: null,
        condition: false,
      });
    }
  }

  function handleClick() {
    const city = inputRef.current.value.trim();
    if (city) {
      getWeather(city);
      inputRef.current.value = "";
    } else {
      alert("Please enter a valid city name.");
    }
  }

  return (
    <>
      <div className="search">
        <input ref={inputRef} type="text" placeholder="Enter your location" />
        <button onClick={handleClick}>Search</button>
      </div>
      {state.condition && state.weatherData && (
        <>
          <div className="contain">
            <aside className="weather-display">
              <h4>{state.weatherData.name}</h4>
              <h1>
                {state.weatherData.main.temp}
                <sup>o</sup>F
              </h1>
            </aside>
          </div>
          <div className="temp-details">
            <div>
              {state.weatherData.main.feels_like} <sup>o</sup>F
              <div>Feels like</div>
            </div>
            <div>
              {state.weatherData.main.humidity}%<div>Humidity</div>
            </div>
            <div>
              {state.weatherData.wind.speed} MPH
              <div>Wind speed</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
