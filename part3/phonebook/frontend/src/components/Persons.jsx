export const Filter = ({ handler, text }) => (
    <div>
        {text}
        <input onChange={handler} />
    </div>
);

export const PersonForm = ({ submitHandler, name, number, handler }) => {
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

export const Persons = ({ persons, handler }) => (
    <ul>
        {persons.map((person) => (
            <li key={person.id}>
                {person.name} {person.number}
                <button onClick={() => handler(person)}>delete</button>
            </li>
        ))}
    </ul>
);
