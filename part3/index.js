import express from "express";
import morgan from "morgan";
import { persons } from "./persons.js";

const app = express();

app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(morgan(":method :url :status :response-time ms body=:body"));

app.get("/api/persons", (request, response) => {
    response.json(persons);
    console.log("Served persons");
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = persons.find((person) => person.id === id);

    person ? response.json(person) : response.status(404).end();
});

app.put("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = request.body;
    const index = persons.findIndex((currPerson) => currPerson.id === id);

    if (index === -1) {
        return response.status(404).end();
    }

    if (!person.name) {
        return response.status(400).send("Missing name");
    }

    if (!person.number) {
        return response.status(400).send("Missing number");
    }

    if (
        persons.some(
            (currPerson) => currPerson.id !== id && currPerson.name === person.name,
        )
    ) {
        return response.status(400).send("Name must be unique");
    }

    const updatedPerson = {
        ...persons[index],
        ...person,
        id,
    };

    persons[index] = updatedPerson;
    response.json(updatedPerson);
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const index = persons.findIndex((person) => person.id === id);

    if (index === -1) {
        return response.status(404).end();
    }

    persons.splice(index, 1);

    response.status(204).end();
});

const idGen = () => String(Math.floor(Math.random() * 1000000));

app.post("/api/persons", (request, response) => {
    const person = request.body;

    if (!person.name) {
        return response.status(400).send("Missing name");
    }

    if (persons.find((curr) => curr.name === person.name)) {
        return response.status(400).send("Name must be unique");
    }

    if (!person.number) {
        return response.status(400).send("Missing number");
    }

    const newPerson = {
        ...person,
        id: idGen(),
    };

    persons.push(newPerson);
    response.status(201).json(newPerson);
});

app.get("/info", (request, response) => {
    const now = new Date();

    response.send(`<div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${now.toString()}</p>
        </div>`);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
