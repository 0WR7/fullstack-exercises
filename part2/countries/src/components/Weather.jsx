import { useEffect } from "react";
import { useState } from "react";
import CountryService from "../services/countries";

//testing fetching in seperate component

const Weather = ({ country }) => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        CountryService.getWeather(country)
            .then(setWeather)
            .catch(() => alert("something went wrong with the weather"));
    }, [country]);

    if (!weather) {
        return (
            <div>
                <h4>Weather not ready</h4>
            </div>
        );
    }

    return (
        <div>
            <h4>Weather in {country.capital[0]}</h4>
            <p>Temperature {weather.main.temp} Celsius</p>
            <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
            />
        </div>
    );
};

export default Weather;
