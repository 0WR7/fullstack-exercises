import express from "express";
import morgan from "morgan";
import personsArray from "./persons.js";
import cors from "cors";

let persons = personsArray;

const app = express();
app.use(express.json());
app.use(cors());

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

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
});

const idGen = () => Math.floor(Math.random() * 999);

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

    persons = persons.concat(newPerson);
    response.status(201).json(newPerson);
});

app.get("/info", (request, response) => {
    const now = new Date();

    response.send(`<div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${now.toString()}</p>
        </div>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
