import { useState, useEffect } from "react";
import "./quize.css";
import quize from "../quize.json";

const Quiz = () => {
    const [activeQuestion, setActiveQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
    const [result, setResult] = useState({
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
    });
    const [userName, setUserName] = useState('');
    const [quizStarted, setQuizStarted] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);

    const { questions } = quize;
    const { question, choices, correctAnswer } = questions[activeQuestion];

    useEffect(() => {
        const persistedLeaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
        setLeaderboard(persistedLeaderboard);
    }, []);

    useEffect(() => {
        if (showResult && userName) {
            const newLeaderboardEntry = {
                userName,
                score: result.score,
            };
            const updatedLeaderboard = [...leaderboard, newLeaderboardEntry];
            updatedLeaderboard.sort((a, b) => b.score - a.score);
            setLeaderboard(updatedLeaderboard);
            localStorage.setItem('quizLeaderboard', JSON.stringify(updatedLeaderboard));
        }
    }, [showResult, userName, result.score]);

    const onClickNext = () => {
        setSelectedAnswerIndex(null)
        setResult((prev) =>
            selectedAnswer
                ? {
                    ...prev,
                    score: prev.score + 5,
                    correctAnswers: prev.correctAnswers + 1,
                }
                : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
        )
        if (activeQuestion !== questions.length - 1) {
            setActiveQuestion((prev) => prev + 1)
        } else {
            setActiveQuestion(0)
            setShowResult(true)
        }
    };

    const onClickPrevious = () => {
        if (activeQuestion > 0) {
            setActiveQuestion((prev) => prev - 1);
            setSelectedAnswerIndex(null); // Clear the selected answer when going back
        }
    };

    const onAnswerSelected = (answer, index) => {
        setSelectedAnswerIndex(index)
        if (answer === correctAnswer) {
            setSelectedAnswer(true)
        } else {
            setSelectedAnswer(false)
        }
    }

    const addLeadingZero = (number) => (number > 9 ? number : `0${number}`)
    const Leaderboard = ({ leaderboard }) => {
        return (
            <div className="leaderboard">
                <h3>Leaderboard</h3>
                <ol>
                    {leaderboard.map((entry, index) => (
                        <li key={index}>
                            {entry.userName} - {entry.score}
                        </li>
                    ))}
                </ol>
            </div>
        );
    };

    return (
        <div className="quiz-container">
            {!quizStarted ? (
                <div>
                    <h2>Enter your name:</h2>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <button onClick={() => setQuizStarted(true)}>Start Quiz</button>
                </div>
            ) : !showResult ? (
                <div>
                    <div>
                        <span className="active-question-no">{addLeadingZero(activeQuestion + 1)}</span>
                        <span className="total-question">/{addLeadingZero(questions.length)}</span>
                    </div>
                    <h2>{question}</h2>
                    <ul>
                        {choices.map((answer, index) => (
                            <li
                                onClick={() => onAnswerSelected(answer, index)}
                                key={answer}
                                className={selectedAnswerIndex === index ? 'selected-answer' : null}>
                                {answer}
                            </li>
                        ))}
                    </ul>
                    <div className="flex-right">
                        <button onClick={onClickPrevious} disabled={activeQuestion === 0}>
                            Previous
                        </button>
                        <button onClick={onClickNext} disabled={selectedAnswerIndex === null}>
                            {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="result">
                    <h3>Result</h3>
                    <p>
                        Total Question: <span>{questions.length}</span>
                    </p>
                    <p>
                        Total Score:<span> {result.score}</span>
                    </p>
                    <p>
                        Correct Answers:<span> {result.correctAnswers}</span>
                    </p>
                    <p>
                        Wrong Answers:<span> {result.wrongAnswers}</span>
                    </p>
                </div>
            )}
            {showResult && userName && <Leaderboard leaderboard={leaderboard} />}
        </div>
    )
}

export default Quiz;