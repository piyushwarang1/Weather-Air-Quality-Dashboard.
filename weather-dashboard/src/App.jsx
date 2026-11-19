import "./App.css";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import WorldMap from"./WorldMap";

function App(){
  const[location,setLocation] = useState("");
  const[city,setCity] = useState(null);
  const[loading,setLoading] = useState(false);
  const[error,setError] =useState("");
  const[weather,setWeather] = useState(null);
  const[selectedLocation,setSelectedLocation] = useState(null);

  const handleLocationSelect =async ({ latitude,longitude}) => {
    setSelectedLocation({ latitude,longitude});
    setCity(null);
    setWeather(null);
    setError("");
    setLoading(true);
  
    try{
      const weatherUrl= `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`;
      const weatherRespond = async () => await fetch(weatherUrl);

      if(!response.ok) {
        throw new Error ("Weather reqest failed");
      }
    
    
    const weatherData =response.json();

    setWeather(weatherData.current);
  } catch (err) {
    setError("Sonething went wrong,Try again.");
  } finally {
    setLoading(false);
  }
  }
  function getWeatherCondition(code){
    if(code === 0 ) return "Clear sky";
    if(code === 1) return "Mainly Clear";
    if(code === 2) return "Partly Cloudly";
    if(code === 3) return "Overcast";


     if([45,48].includes(code)) return "Fog";

     if ([53,55,56,57].includes(code)) {
      return "Drizzely";
     }
     if([61,63,65,66,67].includes(code)) {
       return "Rainy";
     }

     if([71,73,75,77].includes(code)) {
       return "snowy";
     }

     if([80,81,82].includes(code)) {
       return "Rain Showers";
     }
     if([95,96,99].includes(code)){
      return "Thunderstorm";
     }

     return "Unknown";
  } 


  const handleSearch = async (e) => {
    e.preventDefault();

    

    if(!location.trim()) {
      setError("please enter city name");
      return;
    }
    setLoading(true);
    setError("");
    setCity(null);
    setWeather(null);
    setSelectedLocation(null);

    try{
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;

      const response = await fetch(url);
      const data = await response.json();

      

      if(!data.results || data.results.length === 0) {
        setError("City not found");
        return;
      }

          setCity(data.results[0]);
      

         const weatherUrl=`https://api.open-meteo.com/v1/forecast?latitude=${data.results[0].latitude}&longitude=${data.results[0].longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`;
          const weatherRespond = await fetch(weatherUrl)
         const weatherData = await weatherRespond.json();
          setWeather(weatherData.current);

    }catch (err) {
      setError(" Somethimg went wrong. Try again.");

    }finally{
      setLoading(false);
    }
  }

  
  
  
  return(
    
    <div className="dashboard">

      <div className="nav">
        <h3>SkyWeather</h3>
       
      </div>
      <div className="left">
      <header>
         <form className="search-box" onSubmit={handleSearch}>

           <input type="text"  placeholder="Enter Location" value= {location} onChange={(e)=> setLocation(e.target.value)}/>
           <button type="submit" disabled={loading}>{loading ? "Searching":"Search"}</button>

         </form>

      </header>

      {error && <p>{error}</p>}
      <p>Selected Location: {selectedLocation ? `${selectedLocation.name}, ${selectedLocation.country}` : "None"}</p>

      {city && (
        <div className="city-result">
          <h2>{city.name},{city.country}</h2>
          <p>Latitude: {city.latitude.toFixed(2)}</p>
          <p>Longitude: {city.longitude.toFixed(2)}</p>
        </div>
      )}

      {weather && (
      <div className="weather-result">
        <h2>{weather.temperature_2m}°C</h2>
        <p>{getWeatherCondition(weather.weather_code)}</p>
        <div className="weather-details">
        <p>
        Humidity: {weather.relative_humidity_2m} %
        </p>
        <p>
          Wind: {weather.wind_speed_10m}km/h
        </p>
        </div>
        <p>
          feels like: {weather.apparent_temperature}°C
        </p>
      </div>
      )}


    </div>
    <div className="right">
      <div className="world-map">
      <WorldMap onLocationSelect={handleLocationSelect} />
      </div>
    </div>
    </div>
    
)}


export default App