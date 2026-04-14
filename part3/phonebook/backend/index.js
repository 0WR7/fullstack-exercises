import express from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./modules/person.js";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms body=:body"));

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformed id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({
            error: `Validation failed ${error.message}`,
        });
    }

    next(error);
};

app.get("/api/persons", (request, response) => {
    Person.find({}).then((people) => response.json(people));
});

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;
    Person.findByIdAndDelete(id)
        .then((result) => response.status(204).end())
        .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).send("Missing name");
    }

    if (!body.number) {
        return response.status(400).send("Missing number");
    }

    return Person.findOne({ name: body.name })
        .then((person) => {
            if (person) {
                return response.status(400).send("Name must be unique");
            }
            const newPerson = new Person({
                name: body.name,
                number: body.number,
            });

            return newPerson
                .save()
                .then((savedPerson) => response.json(savedPerson));
        })
        .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
    const number = request.body.number;
    //could add error checking for missing body//number

    Person.findById(request.params.id)
        .then((person) => {
            if (!person) {
                return response.status(404).end();
            }

            person.number = number;

            return person.save().then((updatedPerson) => {
                response.json(updatedPerson);
            });
        })
        .catch((error) => next(error));
});

app.get("/info", (request, response) => {
    const now = new Date();

    Person.countDocuments({}).then((count) => {
        response.send(`<div>
                <p>Phonebook has info for ${count} people</p>
                <p>${now.toString()}</p>
            </div>`);
    });
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
