import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/";
const weather_key = import.meta.env.VITE_SOME_KEY;

const getAll = () => {
    const request = axios.get(`${baseUrl}/api/all`);
    return request.then((response) => response.data);
};

const getCountry = (country) => {
    const request = axios.get(`${baseUrl}/name/${country}`);
    return request.then((response) => response.data);
};

const getWeather = (country) => {
    const capital = country.capital?.[0];
    const request = axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(capital)},${country.cca2}&appid=${weather_key}&units=metric`,
    );
    return request.then((response) => response.data);
};

export default { getAll, getCountry, getWeather };
