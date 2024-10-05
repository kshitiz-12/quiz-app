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
let selectedCategory = 9; // default category ID for General Knowledge
let userAnswer = ''; // store the selected answer

// Show the popup when the Start Quiz button is clicked
startButton.onclick = () => {
    popupInfo.classList.add("active");
};

// Hide the popup when Exit button is clicked
exitButton.onclick = () => {
    popupInfo.classList.remove("active");
};

// Start the quiz when Continue button is clicked
continueButton.onclick = () => {
    selectedCategory = categorySelect.value; // Get the selected category ID
    fetchQuestions(selectedCategory);
    popupInfo.classList.remove("active");
    quizSection.classList.add("active");
};

// Fetch questions from the API based on the selected category
async function fetchQuestions(categoryId) {
    const apiUrl = `https://opentdb.com/api.php?amount=5&category=${categoryId}&type=multiple`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        questions = data.results;
        currentQuestionIndex = 0;
        score = 0; // Reset score
        userAnswer = ''; // Reset user answer
        displayQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error);
        questionText.innerHTML = 'Error fetching questions. Please try again.';
    }
}

// Display the current question and its options
function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionText.innerHTML = currentQuestion.question;

        optionList.innerHTML = ''; // Clear previous options
        const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        shuffleArray(options); // Shuffle options to randomize order

        // Create option buttons dynamically
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.innerHTML = `<span>${option}</span>`;
            optionElement.onclick = () => handleOptionClick(option, currentQuestion.correct_answer, optionElement);
            optionList.appendChild(optionElement);
        });

        questionTotal.innerHTML = `${currentQuestionIndex + 1} of ${questions.length} Questions`;
        nextButton.disabled = true; // Disable Next button until an answer is selected
        nextButton.style.display = 'inline-block'; // Ensure Next button is visible during the quiz
    } else {
        showScore();
    }
}

// Handle the selection of an option
function handleOptionClick(selectedOption, correctAnswer, optionElement) {
    const options = document.querySelectorAll('.option');

    // Remove "selected" class from all options
    options.forEach(option => {
        option.classList.remove('selected');
    });

    // Add "selected" class to the clicked option
    optionElement.classList.add('selected');

    // Store the selected answer
    userAnswer = selectedOption;

    // Check if the selected answer is correct
    if (userAnswer === correctAnswer) {
        score++;
        optionElement.style.backgroundColor = 'green'; // Highlight correct answer
    } else {
        optionElement.style.backgroundColor = 'red'; // Highlight wrong answer
        // Show the correct answer
        options.forEach(option => {
            if (option.innerText === correctAnswer) {
                option.style.backgroundColor = 'green'; // Highlight correct answer
            }
        });
    }

    nextButton.disabled = false; // Enable the Next button after an answer is selected
}

// Proceed to the next question
nextButton.onclick = () => {
    currentQuestionIndex++;
    userAnswer = ''; // Reset selected answer for the next question
    displayQuestion();
};

// Show the final score after all questions are answered
function showScore() {
    questionText.innerHTML = `Quiz Complete! Your score is ${score} out of ${questions.length}.`;
    optionList.innerHTML = ''; // Clear options
    nextButton.style.display = 'none'; // Hide the Next button on the final score page

    // Create and append the restart button
    const restartButton = document.createElement('button');
    restartButton.innerText = "Restart Quiz";
    restartButton.classList.add('restart-button'); // Add the class for styling (ensure CSS for restart-button is added)
    restartButton.onclick = () => {
        currentQuestionIndex = 0;
        score = 0;
        fetchQuestions(selectedCategory); // Restart the quiz
        restartButton.remove(); // Remove the restart button after the quiz restarts
    };
    optionList.appendChild(restartButton); // Append restart button to the options area
}

// Utility function to shuffle the options array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
