const startButton = document.querySelector('.start-button');
const popupInfo = document.querySelector('.popup-info');
const exitButton = document.querySelector('.exit');
const continueButton = document.querySelector('.cont');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const categorySelect = document.getElementById('categories');
const questionText = document.querySelector('.question-text');
const optionList = document.querySelector('.option-list');
const questionTotal = document.querySelector('.question-total');
const nextButton = document.querySelector('.next-button');
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let selectedCategory = 9; 
let userAnswer = ''; 
startButton.onclick = () => {
    popupInfo.classList.add("active");
};
exitButton.onclick = () => {
    popupInfo.classList.remove("active");
};
continueButton.onclick = () => {
    selectedCategory = categorySelect.value; 
    fetchQuestions(selectedCategory);
    popupInfo.classList.remove("active");
    quizSection.classList.add("active");
};
// questions from api......
async function fetchQuestions(categoryId) {
    const apiUrl = `https://opentdb.com/api.php?amount=5&category=${categoryId}&type=multiple`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        questions = data.results;
        currentQuestionIndex = 0;
        score = 0; 
        userAnswer = ''; 
        displayQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error);
        questionText.innerHTML = 'Error fetching questions. Please try again.';
    }
}

// Displayyy current question and its options
function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionText.innerHTML = currentQuestion.question;
        optionList.innerHTML = ''; 
        const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        shuffleArray(options);
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.innerHTML = `<span>${option}</span>`;
            optionElement.onclick = () => handleOptionClick(option, currentQuestion.correct_answer, optionElement);
            optionList.appendChild(optionElement);
        });

        questionTotal.innerHTML = `${currentQuestionIndex + 1} of ${questions.length} Questions`;
        nextButton.disabled = true; 
        nextButton.style.display = 'inline-block'; 
    } else {
        showScore();
    }
}
// selection of an option....
function handleOptionClick(selectedOption, correctAnswer, optionElement) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('selected');
    });
    optionElement.classList.add('selected');
    userAnswer = selectedOption;
    if (userAnswer === correctAnswer) {
        score++;
        optionElement.style.backgroundColor = 'green'; // Highlight correct anss
    } else {
        optionElement.style.backgroundColor = 'red'; // Highlight wrong ans
        // Show the correct answer
        options.forEach(option => {
            if (option.innerText === correctAnswer) {
                option.style.backgroundColor = 'green'; // Highlight correct ansss
            }
        });
    }

    nextButton.disabled = false; // Enable next button after selecting ans
}
nextButton.onclick = () => {
    currentQuestionIndex++;
    userAnswer = ''; // Reset 
    displayQuestion();
};
// final score
function showScore() {
    questionText.innerHTML = `Quiz Complete! Your score is ${score} out of ${questions.length}.`;
    optionList.innerHTML = ''; // options areee cleared
    nextButton.style.display = 'none'; // to hide the next button in the finaaaal pageee!!!
//   restart button 
    const restartButton = document.createElement('button');
    restartButton.innerText = "Restart Quiz";
    restartButton.classList.add('restart-button'); 
    restartButton.onclick = () => {
        currentQuestionIndex = 0;
        score = 0;
        fetchQuestions(selectedCategory); // Restart the quiz
        restartButton.remove(); // Remove the restart button after the quiz restarts 
    };
    optionList.appendChild(restartButton); 
}

// Utility function to shuffle the options array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
