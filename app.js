let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = { correct: 0, wrong: 0 };
let optionSelected = false;

// DOM Elementleri
const categoryScreen = document.getElementById('category-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const categoriesGrid = document.getElementById('categories-grid');
const quizTitle = document.getElementById('quiz-title');
const progressText = document.getElementById('progress');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const categoryResultTitle = document.getElementById('category-result-title');
const totalQuestionsText = document.getElementById('total-questions');
const correctCountText = document.getElementById('correct-count');
const wrongCountText = document.getElementById('wrong-count');
const restartBtn = document.getElementById('restart-btn');

// Uygulama Başlangıcı: Kategorileri Listele
function init() {
    categoriesGrid.innerHTML = "";
    Object.keys(quizData).forEach(key => {
        const btn = document.createElement('button');
        btn.className = "p-5 bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow-md hover:border-blue-400 text-left transition-all duration-200 cursor-pointer flex justify-between items-center group";
        btn.innerHTML = `
            <span class="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">${quizData[key].title}</span>
            <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-500 transition-colors"></i>
        `;
        btn.addEventListener('click', () => startQuiz(key));
        categoriesGrid.appendChild(btn);
    });
}

// Diziyi Rastgele Karıştırma (Aynı soru tekrarını önleme mekanizması)
function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Testi Başlat
function startQuiz(categoryKey) {
    currentCategory = categoryKey;
    // Soruları karıştırarak klonluyoruz, böylece sıra her seferinde değişiyor
    currentQuestions = shuffleArray(quizData[categoryKey].questions);
    currentQuestionIndex = 0;
    score = { correct: 0, wrong: 0 };
    
    categoryScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    
    quizTitle.textContent = quizData[categoryKey].title;
    loadQuestion();
}

// Soru Yükle
function loadQuestion() {
    optionSelected = false;
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = "";
    
    const currentQuestion = currentQuestions[currentQuestionIndex];
    progressText.textContent = `Soru: ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    questionText.textContent = currentQuestion.q;
    
    currentQuestion.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-pointer flex items-center font-medium text-gray-700";
        btn.innerHTML = `<span class="inline-block bg-gray-100 text-gray-600 rounded-md px-2 py-1 mr-3 text-sm font-bold">${String.fromCharCode(65 + index)}</span> <span class="flex-1">${option}</span>`;
        btn.addEventListener('click', () => selectOption(btn, index));
        optionsContainer.appendChild(btn);
    });
}

// Şık Seçimi (Doğru / Yanlış Belirteci)
function selectOption(selectedBtn, optionIndex) {
    if (optionSelected) return; // Birden fazla tıklamayı engelle
    optionSelected = true;
    
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const correctIndex = currentQuestion.answer;
    const buttons = optionsContainer.querySelectorAll('button');
    
    if (optionIndex === correctIndex) {
        // Doğru Seçim
        selectedBtn.classList.remove('border-gray-200', 'hover:bg-gray-50');
        selectedBtn.classList.add('bg-emerald-50', 'border-emerald-500', 'text-emerald-800');
        selectedBtn.querySelector('span').classList.add('bg-emerald-500', 'text-white');
        selectedBtn.innerHTML += `<i class="fas fa-check-circle text-emerald-600 text-xl ml-2"></i>`;
        score.correct++;
    } else {
        // Yanlış Seçim
        selectedBtn.classList.remove('border-gray-200', 'hover:bg-gray-50');
        selectedBtn.classList.add('bg-rose-50', 'border-rose-500', 'text-rose-800');
        selectedBtn.querySelector('span').classList.add('bg-rose-500', 'text-white');
        selectedBtn.innerHTML += `<i class="fas fa-times-circle text-rose-600 text-xl ml-2"></i>`;
        
        // Doğru Şıkkı da Göster
        const correctBtn = buttons[correctIndex];
        correctBtn.classList.add('bg-emerald-50', 'border-emerald-300', 'text-emerald-800');
        score.wrong++;
    }
    
    // Diğer butonların hover efektini ve tıklanabilirliğini kaldır
    buttons.forEach(btn => btn.classList.add('pointer-events-none'));
    
    // Sonraki Soru butonunu aktifleştir
    nextBtn.classList.remove('hidden');
}

// Sonraki Soru Buton Olayı
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Sonuç Ekranı
function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    categoryResultTitle.textContent = quizData[currentCategory].title;
    totalQuestionsText.textContent = currentQuestions.length;
    correctCountText.textContent = score.correct;
    wrongCountText.textContent = score.wrong;
}

// Başa Dön
restartBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    categoryScreen.classList.remove('hidden');
    init();
});

// Sayfa Yüklendiğinde Başlat
document.addEventListener('DOMContentLoaded', init);