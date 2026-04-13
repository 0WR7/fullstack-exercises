import mongoose from "mongoose";

const args = process.argv;

function connect_db() {
    const password = args[2];
    const url = `mongodb+srv://jakimdev_db_user:${password}@cluster0.avjgpuu.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;
    mongoose.set("strictQuery", false);
    return mongoose.connect(url, { family: 4 });
}

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

function defPerson() {
    return Person;
}

function createPerson() {
    return new Person({
        name: args[3],
        number: args[4],
    });
}

function addPerson(person) {
    person.save().then(() => {
        console.log("entry saved!");
        mongoose.connection.close();
    });
}

if (args.length === 5) {
    connect_db().then(() => {
        addPerson(createPerson());
    });
} else if (args.length === 3) {
    connect_db().then(() => {
        const Person = defPerson();
        Person.find({}).then((result) => {
            result.forEach((person) => {
                console.log(person.name, person.number);
            });
            mongoose.connection.close();
        });
    });
} else console.log("Insufficient amount of arguments");
