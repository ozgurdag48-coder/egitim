let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = { correct: 0, wrong: 0 };
let optionSelected = false;
let userSessionHistory = [];

// DOM Ögeleri
const categoryScreen = document.getElementById('category-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const categoriesGrid = document.getElementById('categories-grid');
const quizTitle = document.getElementById('quiz-title');
const progressText = document.getElementById('progress');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const quizBackBtn = document.getElementById('quiz-back-btn');
const loopAlert = document.getElementById('loop-alert');
const categoryResultTitle = document.getElementById('category-result-title');
const correctCountText = document.getElementById('correct-count');
const wrongCountText = document.getElementById('wrong-count');
const restartBtn = document.getElementById('restart-btn');
const exportWordBtn = document.getElementById('export-word-btn');

// Başlatıcı
function init() {
    buildCategoryMenu();
    setupGlobalEventListeners();
}

function buildCategoryMenu() {
    if (!categoriesGrid) return;
    categoriesGrid.innerHTML = "";
    
    Object.keys(quizData).forEach(key => {
        const btn = document.createElement('button');
        btn.className = "p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-400 text-left transition-all duration-200 cursor-pointer flex justify-between items-center group w-full text-slate-800 font-semibold";
        btn.innerHTML = `
            <span>${quizData[key].title}</span>
            <i class="fas fa-chevron-right text-gray-400 group-hover:text-indigo-500 transition-colors"></i>
        `;
        btn.addEventListener('click', () => startSmartQuiz(key));
        categoriesGrid.appendChild(btn);
    });
}

function shuffle(array) {
    let temp = [...array];
    for (let i = temp.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    return temp;
}

function startSmartQuiz(categoryKey) {
    currentCategory = categoryKey;
    
    // Temiz dinamik derin havuz klonlaması
    const rawQuestions = quizData[categoryKey].questions.map(q => ({...q, hasFailedBefore: false}));
    currentQuestions = shuffle(rawQuestions); 
    
    currentQuestionIndex = 0;
    score = { correct: 0, wrong: 0 };
    userSessionHistory = [];
    
    categoryScreen.classList.replace('block', 'hidden');
    resultScreen.classList.add('hidden');
    quizScreen.classList.replace('hidden', 'block');
    
    quizTitle.textContent = quizData[categoryKey].title;
    loadQuestion();
}

function loadQuestion() {
    optionSelected = false;
    nextBtn.classList.add('hidden');
    loopAlert.classList.add('hidden');
    optionsContainer.innerHTML = "";
    
    const currentQuestion = currentQuestions[currentQuestionIndex];
    
    // Kalan aktif soru sayısı göstergesi
    const remainingCount = currentQuestions.length - currentQuestionIndex;
    progressText.textContent = `Kalan Benzersiz Soru: ${remainingCount}`;
    questionText.textContent = currentQuestion.q;
    
    let mappedOptions = currentQuestion.options.map((opt, i) => ({ text: opt, isCorrect: i === currentQuestion.answer }));
    mappedOptions = shuffle(mappedOptions);
    
    mappedOptions.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors duration-150 cursor-pointer flex items-center font-medium text-gray-700 bg-white";
        btn.innerHTML = `<span class="inline-block bg-gray-100 text-gray-600 rounded-md px-2 py-1 mr-3 text-sm font-bold">${String.fromCharCode(65 + index)}</span> <span class="flex-1">${option.text}</span>`;
        
        btn.addEventListener('click', () => handleOptionSelection(btn, index, mappedOptions));
        optionsContainer.appendChild(btn);
    });
}

function handleOptionSelection(selectedBtn, selectedIndex, mappedOptions) {
    if (optionSelected) return;
    optionSelected = true;
    
    const buttons = optionsContainer.querySelectorAll('button');
    let correctIndex = mappedOptions.findIndex(o => o.isCorrect);
    let activeQuestion = currentQuestions[currentQuestionIndex];
    let isCorrectAnswer = selectedIndex === correctIndex;

    // Rapor geçmişi kaydı
    userSessionHistory.push({
        question: activeQuestion.q,
        userAnswer: String.fromCharCode(65 + selectedIndex),
        correctAnswer: String.fromCharCode(65 + correctIndex),
        isSuccess: isCorrectAnswer
    });

    if (isCorrectAnswer) {
        selectedBtn.classList.replace('border-gray-200', 'border-emerald-500');
        selectedBtn.classList.add('bg-emerald-50', 'text-emerald-800');
        selectedBtn.querySelector('span').classList.add('bg-emerald-500', 'text-white');
        selectedBtn.innerHTML += `<i class="fas fa-check-circle text-emerald-600 text-xl ml-2"></i>`;
        
        // Eğer soru ilk defa gelmiş ve doğru yapılmışsa skora ekle
        if (!activeQuestion.hasFailedBefore) {
            score.correct++;
        }
    } else {
        selectedBtn.classList.replace('border-gray-200', 'border-rose-500');
        selectedBtn.classList.add('bg-rose-50', 'text-rose-800');
        selectedBtn.querySelector('span').classList.add('bg-rose-500', 'text-white');
        selectedBtn.innerHTML += `<i class="fas fa-times-circle text-rose-600 text-xl ml-2"></i>`;
        
        const correctBtn = buttons[correctIndex];
        correctBtn.classList.add('bg-emerald-50', 'border-emerald-300', 'text-emerald-800');
        
        if (!activeQuestion.hasFailedBefore) {
            score.wrong++;
            activeQuestion.hasFailedBefore = true; 
        }

        // AKILLI DÖNGÜ: Yanlış yapılan soruyu listenin sonuna tekrar ekliyoruz!
        currentQuestions.push({ ...activeQuestion });
        loopAlert.classList.remove('hidden');
    }
    
    buttons.forEach(btn => btn.classList.add('pointer-events-none'));
    nextBtn.classList.remove('hidden');
}

function setupGlobalEventListeners() {
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });

    quizBackBtn.addEventListener('click', () => {
        if(confirm("Test ilerlemeniz sıfırlanacaktır. Ana sayfaya dönmek istiyor musunuz?")) {
            goToHomeScreen();
        }
    });

    restartBtn.addEventListener('click', goToHomeScreen);
    exportWordBtn.addEventListener('click', exportToWordFile);
}

function goToHomeScreen() {
    quizScreen.classList.replace('block', 'hidden');
    resultScreen.classList.add('hidden');
    categoryScreen.classList.replace('hidden', 'block');
    buildCategoryMenu();
}

function showResults() {
    quizScreen.classList.replace('block', 'hidden');
    resultScreen.classList.remove('hidden');
    
    categoryResultTitle.textContent = quizData[currentCategory].title;
    correctCountText.textContent = score.correct;
    wrongCountText.textContent = score.wrong;
}

function exportToWordFile() {
    const categoryName = quizData[currentCategory].title;
    let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>Gelişmiş Çalışma Analiz Raporu</title>
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333333; }
                h1 { color: #312e81; text-align: center; font-size: 18pt; }
                .meta { text-align: center; font-style: italic; color: #555555; margin-bottom: 15pt; }
                .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 20pt; }
                .summary-table th, .summary-table td { border: 1px solid #dddddd; padding: 8px; text-align: center; }
                .summary-table th { background-color: #f3f4f6; }
                .item-row { margin-bottom: 12pt; padding: 6px; border-left: 3px solid #6366f1; background: #fafafa; }
                .status-success { color: #16a34a; font-weight: bold; }
                .status-fail { color: #d97706; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>AKILLI ÖĞRENME SİSTEMİ DETAYLI ANALİZ RAPORU</h1>
            <div class="meta">Kategori: ${categoryName} | Tarih: ${new Date().toLocaleDateString('tr-TR')}</div>
            <table class="summary-table">
                <thead>
                    <tr><th>İlk Seferde Doğru Yapılan</th><th>Döngüsel Tekrara Düşen Soru Sayısı</th></tr>
                </thead>
                <tbody>
                    <tr><td>${score.correct}</td><td>${score.wrong}</td></tr>
                </tbody>
            </table>
            <h3>Tüm Yanıt Geçmişi (Kronolojik Akış):</h3>
    `;

    userSessionHistory.forEach((item, index) => {
        htmlContent += `
            <div class="item-row">
                <div><b>Adım ${index + 1}:</b> ${item.question}</div>
                <div style="font-size: 10pt; margin-top:3px;">
                    Cevabınız: ${item.userAnswer} | Doğru Şık: ${item.correctAnswer} -> 
                    <span class="${item.isSuccess ? 'status-success' : 'status-fail'}">${item.isSuccess ? 'BAŞARILI' : 'DÖNGÜYE GÖNDERİLDİ (HATA)'}</span>
                </div>
            </div>
        `;
    });

    htmlContent += `</body></html>`;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Akilli_Ogrenme_Analizi_${currentCategory}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', init);