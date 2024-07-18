import userEvent from '@testing-library/user-event';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [text, setText] = useState();
  const [result, setResult] = useState(0);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    getQuestionFromApi();
  }, []);

  function getQuestionFromApi() {
    fetch('https://the-trivia-api.com/v2/questions')
      .then(res => res.json())
      .then(res => {
        res.map(item => {
          item.options = shuffle([...item.incorrectAnswers, item.correctAnswer]);
        });
        setQuestions(res);
      });
  }

  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  function nextQuestion() {
    if (!selected) {
      alert('Please select an option before proceeding.');
    } else {
      if (text === questions[currentQuestion].correctAnswer) {
        setResult(result + 10);
        console.log('Correct Answer');
      }
      setCurrentQuestion(currentQuestion + 1);
      setSelected(false);
    }
  }

  function selectedOption(e) {
    const value = e.target.value;
    setText(value);
    setSelected(true);
  }

  function restartQuestion() {
    setCurrentQuestion(0);
    setResult(0);
    setSelected(false);
  }

  if (!questions.length) {
    return (
      <div className="loading-container">
        <img src="https://i.pinimg.com/originals/26/af/26/26af26707d7d0da6d5bc930788cfc868.gif" alt="Loading" />
      </div>
    );
  }

  let quizEnded = currentQuestion === questions.length;
  let currentIndex = questions[currentQuestion];

  return (
    <div className="App">
      <div className="main-content">
        <div className="main-div">
          <h2 className="quiz_app_heading">QUIZ APP</h2>
          {!quizEnded ? (
            <div className="ques-div">
              <h2 className="question">Q{currentQuestion + 1}/{questions.length}: {questions[currentQuestion].question.text}</h2>
              {currentIndex.options.map(item => (
                <div className="option-div" key={item}>
                  <input
                    className="option"
                    checked={selected && text === item}
                    onChange={selectedOption}
                    type="radio"
                    name="q"
                    value={item}
                  />
                  {item}
                </div>
              ))}
              <button className="next-btn" onClick={nextQuestion}>Next</button>
            </div>
          ) : (
            <div className="result_div">
              <h1 className="result_heading">Result</h1>
              {result < 50 ? (
                <>
                  <img className="fail" src="https://gifdb.com/images/high/sad-man-crying-out-loud-meme-74loufg1hlyn7h48.gif" alt="Fail" />
                  <p className="failMsg">Sorry! You are Fail</p>
                </>
              ) : (
                <>
                  <img className="pass" src="https://i.redd.it/0da59icbon4c1.gif" alt="Pass" />
                  <p className="passMsg">Congrats! You are Pass</p>
                </>
              )}
              <h2 className="total_marks">Obt. Marks: {result}</h2>
              <button className="result-btn" onClick={restartQuestion}>Restart</button>
            </div>
          )}
        </div>
        {console.log(questions)}
      </div>
    </div>
  );
}

export default App;
