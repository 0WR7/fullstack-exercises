import { useEffect, useState } from "react";
import { Filter, PersonForm, Persons } from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newPerson, setNewPerson] = useState({ name: "", number: "" });
    const [filter, setFilter] = useState("");
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        personService.getAll().then((initialPersons) => {
            setPersons(initialPersons);
        });
    }, []);

    const handleValueChange = (event) => {
        const { name, value } = event.target;
        setNewPerson({ ...newPerson, [name]: value });
    };

    const addPerson = (event) => {
        event.preventDefault();

        const newPersonObject = {
            name: newPerson.name,
            number: newPerson.number,
        };

        if (
            persons.some(
                (person) => person.name === newPerson.name && person.number !== newPerson.number,
            )
        ) {
            updatePerson(persons.find((person) => person.name === newPerson.name));
        } else if (persons.some((person) => person.name === newPerson.name)) {
            window.alert(`${newPerson.name} is already added to the phonebook`);
        } else {
            personService
                .create(newPersonObject)
                .then((returnedPerson) => {
                    setPersons(persons.concat(returnedPerson));
                    setNewPerson({ name: "", number: "" });
                    setNotification({
                        message: `Added ${returnedPerson.name}`,
                        type: "success",
                    });
                    setTimeout(() => {
                        setNotification(null);
                    }, 3500);
                })
                .catch((error) =>
                    setNotification({
                        message: `${String(error.response.data.error)}`,
                        type: "error",
                    }),
                );
        }
    };

    const updatePerson = (personToUpdate) => {
        if (
            window.confirm(
                `${personToUpdate.name} is already added to the phonebook, replace the old number with a new one?`,
            )
        ) {
            const updatePersonObject = {
                ...personToUpdate,
                number: newPerson.number,
            };
            personService
                .update(personToUpdate.id, updatePersonObject)
                .then((returnedPerson) => {
                    setPersons(
                        persons.map((person) =>
                            person.id === returnedPerson.id ? returnedPerson : person,
                        ),
                    );
                    setNewPerson({ name: "", number: "" });
                    setNotification({
                        message: `Updated ${returnedPerson.name}`,
                        type: "success",
                    });
                    setTimeout(() => {
                        setNotification(null);
                    }, 3500);
                })
                .catch((error) => {
                    setNotification({
                        message: `${error.response.data.error}`,
                        type: "error",
                    });
                    setPersons(persons.filter((person) => person.id !== personToUpdate.id));
                });
        }
    };

    const deletePerson = (personToDelete) => {
        window.confirm(`Delete ${personToDelete.name}?`) &&
            personService.deletePerson(personToDelete.id).then(() => {
                setPersons(persons.filter((person) => person.id !== personToDelete.id));
            });
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filtered = filter
        ? persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
        : persons;

    return (
        <div>
            <h2>Phonebook</h2>
            {notification && (
                <Notification message={notification.message} type={notification.type} />
            )}
            <Filter handler={handleFilterChange} text="filter shown with" />
            <PersonForm
                submitHandler={addPerson}
                name={newPerson.name}
                number={newPerson.number}
                handler={handleValueChange}
            />
            <h3>Numbers</h3>
            <Persons persons={filtered} handler={deletePerson} />
        </div>
    );
};

export default App;
