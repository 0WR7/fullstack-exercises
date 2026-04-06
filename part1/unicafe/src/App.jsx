import { useState } from "react";

//main button
const Button = ({ onClick, text }) => {
    return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    );
};

// Statistics component
const Statistics = ({ good, neutral, bad }) => {
    const all = good + neutral + bad;

    // Conditional rendering for no feedback
    if (all === 0) {
        return (
            <div>
                <p>No feedback given</p>
            </div>
        );
    }

    // Calculate derived statistics if there is feedback
    const average = (good - bad) / all;
    const positive = (good / all) * 100;

    return (
        <table>
            <thead>
                <tr>
                    <th>Statistics</th>
                </tr>
            </thead>
            <tbody>
                {" "}
                <StatisticLine text="good" value={good} />
                <StatisticLine text="neutral" value={neutral} />
                <StatisticLine text="bad" value={bad} />
                <StatisticLine text="all" value={all} />
                <StatisticLine text="average" value={average.toFixed(1)} />
                <StatisticLine
                    text="positive"
                    value={`${positive.toFixed(1)} %`}
                />
            </tbody>
        </table>
    );
};

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    // Using the functional update form for best practice
    const handleGoodClick = () => setGood((prevGood) => prevGood + 1);
    const handleNeutralClick = () =>
        setNeutral((prevNeutral) => prevNeutral + 1);
    const handleBadClick = () => setBad((prevBad) => prevBad + 1);

    return (
        <div>
            <h3>Give feedback</h3>
            <Button onClick={handleGoodClick} text="good" />
            <Button onClick={handleNeutralClick} text="neutral" />
            <Button onClick={handleBadClick} text="bad" />

            <h3>Statistics</h3>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    );
};

export default App;
