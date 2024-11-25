'use strict';

//Global Variables

let currentQuestionIndex, score, username, isCheckingAnswer, resultFeedbackE1;

// Select Elements
const welcomeScreenE1 = document.querySelector('.welcome-screen');
const quizScreenE1 = document.querySelector('.quiz-screen');
const resultScreenE1 = document.querySelector('.result-screen');
const nameInputE1 = document.getElementById('name-input');
const startQuizBtn = document.getElementById('start-quiz');
const restartQuizBtn = document.getElementById('restart-quiz');
const finalScoreE1 = document.getElementById('final-score');
const questionTextE1 = document.getElementById('question-text');
const optionsE1 = document.getElementById('options');
const nextQuestionBtn = document.getElementById('next-question');

//questions
const quizQuestions = [
  {
    question: 'Apakah ibu negara Malaysia?',
    answers: ['Johor Bahru', 'Kuala Lumpur', 'Putrajaya', 'Ipoh'],
    correct: 1,
  },
  {
    question: 'Siapakah Perdana Menteri Malaysia pertama?',
    answers: [
      'Tun Abdul Razak',
      'Tun Hussein Onn',
      'Tunku Abdul Rahman',
      'Tun Mahathir Mohamad',
    ],
    correct: 2,
  },
  {
    question: 'Berapakah jumlah negeri di Malaysia?',
    answers: ['11', '12', '13', '14'],
    correct: 2,
  },
  {
    question: 'Apakah makanan tradisional Malaysia?',
    answers: ['Kimchi', 'Pho', 'Nasi Lemak', 'Sushi'],
    correct: 2,
  },
  {
    question: 'Apakah bunga kebangsaan Malaysia?',
    answers: ['Orkid', 'Rafflesia', 'Bunga Raya', 'Tulip'],
    correct: 2,
  },
  {
    question: 'Apakah nama rasmi Malaysia?',
    answers: [
      'Federasi Malaya',
      'Malaysia',
      'Persekutuan Malaysia',
      'Tanah Melayu',
    ],
    correct: 1,
  },
  {
    question: 'Apakah nama tasik buatan terbesar di Malaysia',
    answers: ['Pedu', 'Chini', 'Bera', 'Kenyir'],
    correct: 3,
  },
  {
    question: 'Di manakah terletaknya Pulau Langkawi?',
    answers: ['Sabah', 'Selangor', 'Kedah', 'Sarawak'],
    correct: 2,
  },
  {
    question: 'Negeri manakah terkenal dengan budu?',
    answers: ['Perlis', 'Johor', 'Perak', 'Kelantan'],
    correct: 3,
  },
  {
    question: 'Apakah gunung tertinggi di Malaysia?',
    answers: [
      'Gunung Tahan',
      'Gunung Kinabalu',
      'Gunung Ledang',
      'Gunung Jerai',
    ],
    correct: 1,
  },
];

//toggle function
const toggleScreen = (showElement, hideElements) => {
  showElement.classList.remove('hidden');
  hideElements.forEach(el => el.classList.add('hidden'));
};

//create or update feedback
const createOrUpdateFeedbackMessage = (
  message,
  className,
  parentElement = null
) => {
  let feedbackMessageE1 = document.getElementById('feedback-message');
  if (!feedbackMessageE1) {
    feedbackMessageE1 = document.createElement('p');
    feedbackMessageE1.id = 'feedback-message';

    (parentElement || optionsE1).insertAdjacentElement(
      'afterend',
      feedbackMessageE1
    );
  }
  feedbackMessageE1.textContent = message;
  feedbackMessageE1.className = className;

  return feedbackMessageE1;
};

// Function to remove feedback message
const removeFeedbackMessage = () => {
  const existingFeedback = document.getElementById('feedback-message');

  if (existingFeedback) {
    existingFeedback.remove();
  }
};

//Initialize function
const init = function () {
  currentQuestionIndex = 0;
  score = 0;
  username = '';
  isCheckingAnswer = true;

  //show welcome screen, hide others
  toggleScreen(welcomeScreenE1, [quizScreenE1, resultScreenE1]);

  nameInputE1.value = '';
  nextQuestionBtn.textContent = 'Semak Jawapan';

  removeFeedbackMessage();

  if (!resultFeedbackE1) {
    resultFeedbackE1 = document.createElement('p');
    resultScreenE1.appendChild(resultFeedbackE1);
  }
  resultFeedbackE1.textContent = ''; // Clear previous feedback
  resultFeedbackE1.className = '';
};

// Validate name and start quiz
const startQuiz = function () {
  username = nameInputE1.value.trim();
  // If name is empty
  if (!username) {
    createOrUpdateFeedbackMessage(
      'Sila masukkan nama anda!',
      'text-danger fs-3',
      nameInputE1
    );
    return;
  }

  username = username.toUpperCase();
  console.log(`Username: ${username}`);

  removeFeedbackMessage();
  toggleScreen(quizScreenE1, [welcomeScreenE1]);
  loadQuestion();
};

//load question
const loadQuestion = function () {
  removeFeedbackMessage();
  const currentQuestion = quizQuestions[currentQuestionIndex];
  questionTextE1.textContent = currentQuestion.question;
  optionsE1.innerHTML = '';

  currentQuestion.answers.forEach((answer, index) => {
    const optionHTML = `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="quiz-option" id="option-${index}" value="${index}">
        <label class="form-check-label" for="option-${index}">${answer}</label>
      </div>
    `;
    optionsE1.insertAdjacentHTML('beforeend', optionHTML);
  });
};

//validate answer
const selectAnswer = function () {
  const selectedOption = document.querySelector(
    "input[name='quiz-option']:checked"
  );

  //no option selected
  if (!selectedOption) {
    createOrUpdateFeedbackMessage('Pilih satu jawapan!', 'text-danger fs-3');
    return false;
  }
  const selectedIndex = parseInt(selectedOption.value);
  const currentQuestion = quizQuestions[currentQuestionIndex];

  //check if correct answer
  if (selectedIndex === currentQuestion.correct) {
    score++;
    createOrUpdateFeedbackMessage('Jawapan anda betul!', 'text-success fs-3');
  } else {
    createOrUpdateFeedbackMessage(
      `Jawapan anda salah. Jawapan yang betul ialah: ${
        currentQuestion.answers[currentQuestion.correct]
      }`,
      'text-danger fs-3'
    );
  }
  return true;
};

//next question
const nextQuestion = function () {
  if (isCheckingAnswer) {
    //semak jawapan mode
    if (!selectAnswer()) return;
    nextQuestionBtn.textContent = 'Soalan Seterusnya';
    isCheckingAnswer = false; //switch button
  } else {
    //soalan seterusnya mode
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      loadQuestion();
    } else {
      showResult();
    }
    nextQuestionBtn.textContent = 'Semak Jawapan';
    isCheckingAnswer = true;
  }
};

// Set Result Feedback Helper Function
const setResultFeedback = function (message, className) {
  resultFeedbackE1.textContent = message;
  resultFeedbackE1.className = className;
};

// Show Result
const showResult = function () {
  toggleScreen(resultScreenE1, [quizScreenE1]);
  finalScoreE1.textContent = `Skor akhir anda ialah ${score}/${quizQuestions.length}`;

  if (score >= 8) {
    setResultFeedback('Anda memang rakyat Sejati!', 'text-success fs-4 mt-3');
  } else if (score >= 5) {
    setResultFeedback('Anda bukan rakyat Malaysia', 'text-primary fs-4 mt-3');
  } else {
    setResultFeedback(
      'Anda wajib masuk sekolah semula',
      'text-danger fs-4 mt-3'
    );
  }
};

// Event Listener
startQuizBtn.addEventListener('click', startQuiz);
nextQuestionBtn.addEventListener('click', nextQuestion);
restartQuizBtn.addEventListener('click', init);

//call init function upon restart
init();
