import express from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./modules/person.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(morgan(":method :url :status :response-time ms body=:body"));

app.get("/api/persons", (request, response) => {
    Person.find({}).then((people) => response.json(people));
});

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then((person) =>
        person ? response.json(person) : response.status(404).end(),
    );
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
});

const idGen = () => Math.floor(Math.random() * 999);

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).send("Missing name");
    }

    if (!body.number) {
        return response.status(400).send("Missing number");
    }

    Person.findOne({ name: body.name }).then((person) => {
        if (person) {
            return response.status(400).send("Name must be unique");
        }
    });

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person
        .save()
        .then((savedPerson) => response.json(savedPerson))
        .catch((error) => console.log(error.message));
});

app.get("/info", (request, response) => {
    const now = new Date();

    response.send(`<div>
            <p>Phonebook has info for ${Person.length} people</p>
            <p>${now.toString()}</p>
        </div>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
