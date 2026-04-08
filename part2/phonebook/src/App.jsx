import { useState, useEffect } from "react";
import axios from "axios";

const Filter = ({ handler, text }) => (
    <div>
        {text}
        <input onChange={handler} />
    </div>
);

const PersonForm = ({ submitHandler, name, number, handler }) => {
    return (
        <div>
            <h3>Add a new</h3>
            <form onSubmit={submitHandler}>
                name: <input name="name" value={name} onChange={handler} />
                number:{" "}
                <input name="number" value={number} onChange={handler} />
                <button type="submit">add</button>
            </form>
        </div>
    );
};

const Persons = ({ persons }) => (
    <ul>
        {persons.map((person) => (
            <li key={person.name}>
                {person.name} {person.number}
            </li>
        ))}
    </ul>
);
const App = () => {
    const [persons, setPersons] = useState([]);
    const [newPerson, setNewPerson] = useState({ name: "", number: "" });
    const [filter, setFilter] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3001/persons").then((response) => {
            setPersons(response.data);
        });
    }, []);

    const handleValueChange = (event) => {
        const { name, value } = event.target;
        setNewPerson({ ...newPerson, [name]: value });
    };

    const addPerson = (event) => {
        event.preventDefault();

        const personObject = {
            name: newPerson.name,
            number: newPerson.number,
        };

        persons.some((person) => person.name === newPerson.name)
            ? alert(`${newPerson.name} is already added to phonebook`)
            : setPersons(persons.concat(personObject));
        setNewPerson({ name: "", number: "" });
    };

    //filter logic
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filtered = filter
        ? persons.filter((person) =>
              person.name.toLowerCase().includes(filter.toLowerCase()),
          )
        : persons;

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter handler={handleFilterChange} text="filter shown with" />
            <PersonForm
                submitHandler={addPerson}
                name={newPerson.name}
                number={newPerson.number}
                handler={handleValueChange}
            />
            <h3>Numbers</h3>
            <Persons persons={filtered} />
        </div>
    );
};

export default App;
