import React, { useState, useEffect, useRef } from 'react';
import '../css/weather.css';
import { Spinner } from 'react-bootstrap';

import search_icon from '../assets/search.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import pressure_icon from '../assets/pressure.png'
import visibility_icon from '../assets/visibility.png'

import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';

const Weather = () => {
  const [weatherInfo, setWeatherInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to handle errors
  const inputRef = useRef();

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": cloud_icon,
    "04n": cloud_icon,
    "09d": drizzle_icon,
    "09n": drizzle_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "11d": rain_icon,
    "11n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
    "default": clear_icon,
  };

  const fetchData = async (userInput) => {
    setLoading(true); // Set loading to true before the API call
    setError(null); // Reset error state
    try {
      const apiKey = '4c3b7665ea28f4d6bd6beebb08ece20a';
      const api = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=metric&appid=${apiKey}`;

      const response = await fetch(api);
      const data = await response.json();

      if (data.cod === 200) {
        const theIcon = allIcons[data.weather[0].icon] || allIcons["default"];
        const real_visibility = data.visibility / 1000;
        const date = new Date((data.dt + data.timezone) * 1000);
        const formattedDate = date.toLocaleString();

        setWeatherInfo({
          temp: Math.floor(data.main.temp),
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          visibility: real_visibility,
          cityName: data.name,
          country: data.sys.country,
          wind: data.wind.speed,
          icon: theIcon,
          date: formattedDate,
        });
      } else {
        setError('City not found!'); // Set error message in state
      }
    } catch (error) {
      console.log('There was an error fetching Weather Information', error);
      setError('Error fetching weather data.');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleSearch = () => {
    const userInput = inputRef.current.value;
    if (userInput) {
      fetchData(userInput);
    }
  };

  useEffect(() => {
    fetchData('lagos');
  }, []);

  return (
    <div className='container'>
      <form className='input-container' onSubmit={handleSearch}>
        <input ref={inputRef} className='input-input' type="text" placeholder='Enter City Name...' />
        <button onClick={handleSearch} className='input-btn'>
          <img src={search_icon} alt="Search" />
        </button>
      </form>

      {loading ? (
        <div className='loading-container'>
          <Spinner animation="border" />
          <p className='blinking-text'>Please wait...</p>
        </div>
      ) : error ? ( // Check if there is an error
        <div className='error-message'>
          <p><i style={{fontSize: "40px", fontWeight: "thin"}} class='bx bx-sad'></i></p>
          <p>{error}</p>
        </div>
      ) : (
        <div className='main-container'>
          <div className='section-two'>
            <img src={weatherInfo.icon} alt="Weather Icon" />
          </div>

          <div className='section-three'>
            <p className='temp'>{weatherInfo.temp}<sup>o</sup>C</p>
            <p className='location'>{weatherInfo.cityName}, {weatherInfo.country}</p>
            <p className="date">{weatherInfo.date}</p>
          </div>

            <div className='section-four'>
             <div className='col'>
               <img src={humidity_icon} alt="Humidity Icon" />
               <div>
                 <p>{weatherInfo.humidity}%</p>
              <span>Humidity</span>
               </div>
             </div>

             <div className='col'>
               <img src={wind_icon} alt="Wind Icon" />
               <div>
                 <p>{weatherInfo.wind}km/h</p>
                 <span>Wind</span>
               </div>
             </div>

             <div className='col'>
               <img style={{width: '35px'}} src={pressure_icon} alt="" />
               
               <div>
                 <p>{ weatherInfo.pressure }Pa</p>
                 <span>Pressure</span>
               </div>
             </div>


             <div className='col'>
              <img style={{width: '30px'}} src={visibility_icon} alt="" />
               <div>
                 <p>{ weatherInfo.visibility }m</p>
                 <span>Visibility</span>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default Weather;






