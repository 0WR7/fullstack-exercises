import Weather from "./Weather";

export const Country = ({ country }) => {
    //temporary country.capital[0]
    return (
        <div>
            <h3>{country.name.common}</h3>
            <p>Capital {country.capital[0] || "Not found"}</p>
            <p>Area {country.area}</p>
            <h4>Languages</h4>
            <ul>
                {country.languages &&
                    Object.values(country.languages).map((language) => (
                        <li key={language}>{language}</li>
                    ))}
            </ul>
            <img src={country.flags.png} alt={country.flags.alt} />
            <Weather country={country} />
        </div>
    );
};

export const Countries = ({ countries, handler }) => {
    return (
        <ul>
            {countries.map((country) => (
                <li key={country.name.official}>
                    {country.name.common}
                    <button onClick={() => handler(country)}>Show</button>
                </li>
            ))}
        </ul>
    );
};
