import { useState, useEffect } from "react";
import Search from "./components/Search";
import countryService from "./services/countries";
import { Countries, Country } from "./components/Countries";

const App = () => {
    const [query, setQuery] = useState("");
    const [countries, setCountries] = useState([]); //could be empty array
    const [selected, setSelected] = useState(null);
    //getall countries
    useEffect(() => {
        countryService
            .getAll()
            .then((initialCountries) => setCountries(initialCountries))
            .catch(() => alert("something went wrong"));
    }, []);

    const searchHandler = (event) => {
        setQuery(event.target.value);
        setSelected(null);
    };

    const filteredCountries = query
        ? countries.filter((country) =>
              country.name.common.toLowerCase().includes(query.toLowerCase()),
          )
        : countries;
    //state
    return (
        <div>
            <Search handler={searchHandler} />
            {query && filteredCountries.length > 10 && (
                <p>Too many matches, specify another filter</p>
            )}
            {query && filteredCountries.length === 1 && (
                <Country country={filteredCountries[0]} />
            )}
            {query &&
                filteredCountries.length > 1 &&
                filteredCountries.length <= 10 && (
                    <Countries
                        countries={filteredCountries}
                        handler={setSelected}
                    />
                )}
            {selected && <Country country={selected} />}
        </div>
    );
};

export default App;

//initial request gia ola ta countries meta ta country names se ena array ola mazi me search function sa to prohgoumeno exercise  meta to search otan mhnei mono mia xwra tote api call gia ta info
