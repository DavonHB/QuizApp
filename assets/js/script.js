//Welcome Page Elements
const welcomeEl = document.querySelector("#welcome");
const StartQuizBtnEl = document.querySelector("#startQuiz");

//Quiz Pages Elements
const quizEl = document.querySelector("#quiz");
const questionEl = document.querySelector("#question");
const answersEl = document.querySelector("#answers");

//Input Score Page Elements 
const inputScoreEl = document.querySelector("#inputScore");
const initialsEl = document.querySelector("#initials");
const submitInitialsEl = document.querySelector("#submitInitials");
const userScoreEl = document.querySelector("#score");

//View High Scores Page Elements
const highScoresEl = document.querySelector("#highScores");
const scoresEl = document.querySelector("#scores");
const goBackBtnEl = document.querySelector("#goBack");
const clearScoresBtnEl = document.querySelector("#clearScores");

//Universal var and const
const viewHScoresBtnEl = document.querySelector("#viewHScores");
const timerEl = document.querySelector("#timer");
var score = 0;
var currentQ = 0;
var highScores = [];
var interval;
var timeGiven = 60;
var secondsElapsed = 0;

//start and updates timer
function startTimer() {
    timerEl.textContent = timeGiven;
    interval = setInterval(function() {
        secondsElapsed++;
        timerEl.textContent = timeGiven - secondsElapsed;
        if (secondsElapsed >= timeGiven) {
            currentQ = questions.length;
            nextQuestion();
        }
    }, 1000);
}

//stops timer 
function stopTimer() {
    clearInterval(interval);
}

//Clears current question and calls for display fo next question
//Calls for input score display of last question
function nextQuestion() {
    currentQ++;
    if (currentQ < questions.length) {
        renderQuestion();
    } else {
        stopTimer();
        if ((timeGiven - secondsElapsed) > 0) 
            score += (timeGiven - secondsElapsed);
        userScoreEl.textContent = score;
        hide(quizEl);
        show(inputScoreEl);
        timerEl.textContent = 0;
    }
}

//Checks answer and updates score
function checkAnswer(answer) {
    if (questions[currentQ].answer == questions[currentQ].choices[answer.id]) {
        score += 5;
        displayMessage("Correct!");
    } else {
        secondsElapsed += 10;
        displayMessage("Wrong!");
    }
}

//displays message for 2 seconds
function displayMessage(m) {
    let messageHr = document.createElement("hr");
    let messageEl = document.createElement("div");
    messageEl.textContent = m;
    document.querySelector(".jumbotron").appendChild(messageHr);
    document.querySelector(".jumbotron").appendChild(messageEl);
    setTimeout(function() {
        messageHr.remove();
        messageEl.remove();
    }, 2000);
}

//hides element
function hide(element) {
    element.style.display = "none";
}

//displays element
function show(element) {
    element.style.display = "block";
}

//reset variables 
function reset() {
    score = 0;
    currentQ = 0;
    secondsElapsed = 0;
    timerEl.textContent = 0;
}

//Renders current question 
function renderQuestion() {
    questionEl.textContent = questions[currentQ].title;
    for (i = 0; i < answersEl.children.length; i++) {
        answersEl.children[i].children[0].textContent = `${(i + 1)}: ${questions[currentQ].choices[i]}`;
    }
}

//Renders high scores in local storage 
function renderHighScores() {
    //clear content
    highScoresEl.innerHTML = "";
    show(highScoresEl);
    highScores = JSON.parse(localStorage.getItem("scores"));
    for (let i = 0; i < highScores.length; i++) {
        let scoreItem = document.createElement("div");
        scoreItem.className += "row";
        console.log(scoreItem)
        scoreItem.setAttribute("style", "background-color:Yellow;");
        scoreItem.textContent = `${(i + 1)}. ${highScores[i].username} - ${highScores[i].userScore}`;
        scoresEl.appendChild(scoreItem);
    }
}

//display high scores
viewHScoresBtnEl.addEventListener("click", function () {
    hide(welcomeEl);
    hide(quizEl);
    hide(inputScoreEl);
    renderHighScores();
    stopTimer();
    reset();
});

//starts quiz from welcome page 
StartQuizBtnEl.addEventListener("click", function() {
    hide(welcomeEl);
    startTimer();
    renderQuestion();
    show(quizEl);
});

//calls to check answer selected and calls to next question if button is clicked
answersEl.addEventListener("click", function(e) {
    if (e.target.matches("button")) {
        checkAnswer(e.target);
        nextQuestion();
    }
});

//creates user score obj to push to local storage scores array
//calls to render high scores
//calls to display high scores
submitInitialsEl.addEventListener("click", function() {
    let initValue = initialsEl.value.trim();
    if (initValue) {
        let userScore = { username: initValue, userScore: score };
        initialsEl.value = '';
        highScores = JSON.parse(localStorage.getItem("scores")) || [];
        highScores.push(userScore)
        localStorage.setItem("scores", JSON.stringify(highScores));
        hide(inputScoreEl);
        renderHighScores();
        reset();
    }
});

//goes back to welcome page from high scores
goBackBtnEl.addEventListener("click", function() {
    hide(highScoresEl);
    show(welcomeEl);
});

//clears saved scores from local storage 
clearScoresBtnEl.addEventListener("click", function(){
    highScores = [];
    localStorage.setItem("scores", JSON.stringify(highScores));
    renderHighScores();
});