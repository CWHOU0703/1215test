let currentIndex = 0;
let currentWord = null;
let timer = null;
let timeLeft = 15;
let score = 0;
let hasAnswered = false;

function loadWord() {
    if (vocabularyList.length === 0) return;
    
    // Reset state
    timeLeft = 15;
    hasAnswered = false;
    document.getElementById('next').disabled = true;
    document.getElementById('result').classList.add('hidden');
    
    // Load new word
    currentWord = vocabularyList[currentIndex];
    document.getElementById('word').textContent = currentWord.english;
    
    // Create options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // Shuffle options
    const shuffledOptions = [...currentWord.options].sort(() => Math.random() - 0.5);
    
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option));
        optionsContainer.appendChild(button);
    });

    // Start timer
    startTimer();
}

function startTimer() {
    // Clear existing timer if any
    if (timer) clearInterval(timer);
    
    timeLeft = 15;
    document.getElementById('timer').textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (!hasAnswered) {
                showResult(false);
                disableOptions();
            }
        }
    }, 1000);
}

function checkAnswer(selectedOption) {
    if (hasAnswered) return;
    
    hasAnswered = true;
    clearInterval(timer);
    
    const isCorrect = selectedOption === currentWord.chinese;
    showResult(isCorrect);
    
    if (isCorrect) {
        score++;
        document.getElementById('current-score').textContent = score;
    }
    
    // Highlight correct and wrong answers
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        if (option.textContent === currentWord.chinese) {
            option.classList.add('correct');
        } else if (option.textContent === selectedOption && !isCorrect) {
            option.classList.add('wrong');
        }
    });
    
    disableOptions();
    document.getElementById('next').disabled = false;
}

function showResult(isCorrect) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = isCorrect ? '答對了！' : '答錯了！';
    resultDiv.className = isCorrect ? 'correct' : 'wrong';
    resultDiv.classList.remove('hidden');
}

function disableOptions() {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
}

function nextWord() {
    currentIndex = (currentIndex + 1) % vocabularyList.length;
    loadWord();
}

function speakWord() {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentWord.english);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    }
}

// Event Listeners
document.getElementById('next').addEventListener('click', nextWord);
document.getElementById('speak').addEventListener('click', speakWord);

// Initialize
loadWord();
