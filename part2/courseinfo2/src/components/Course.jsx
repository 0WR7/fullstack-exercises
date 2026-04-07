const Header = (props) => <h2>{props.course}</h2>;

const Content = ({ parts }) => (
    <div>
        {parts.map((part) => {
            return (
                <Part
                    key={part.id}
                    name={part.name}
                    exercises={part.exercises}
                />
            );
        })}
    </div>
);

const Part = ({ id, name, exercises }) => (
    <li key={id}>
        {name} {exercises}
    </li>
);

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />

            <Total
                total={course.parts.reduce(
                    (sum, part) => sum + part.exercises,
                    0,
                )}
            />
        </div>
    );
};
const Total = (props) => <b>Number of exercises {props.total}</b>;

export default Course;
