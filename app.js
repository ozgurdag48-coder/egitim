let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = { correct: 0, wrong: 0 };
let optionSelected = false;
let userSessionHistory = []; // Word raporu üretmek için verileri tutar

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
const quizBackBtn = document.getElementById('quiz-back-btn');
const categoryResultTitle = document.getElementById('category-result-title');
const totalQuestionsText = document.getElementById('total-questions');
const correctCountText = document.getElementById('correct-count');
const wrongCountText = document.getElementById('wrong-count');
const restartBtn = document.getElementById('restart-btn');
const exportWordBtn = document.getElementById('export-word-btn');

// Uygulama Başlangıcı
function init() {
    if (!categoriesGrid) return;
    categoriesGrid.innerHTML = "";
    userSessionHistory = [];
    
    if (typeof quizData === 'undefined') {
        console.error("Hata: quizData nesnesine erişilemedi.");
        return;
    }

    Object.keys(quizData).forEach(key => {
        const btn = document.createElement('button');
        btn.className = "p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 text-left transition-all duration-200 cursor-pointer flex justify-between items-center group w-full";
        btn.innerHTML = `
            <span class="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">${quizData[key].title}</span>
            <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-500 transition-colors"></i>
        `;
        btn.addEventListener('click', () => startQuiz(key));
        categoriesGrid.appendChild(btn);
    });
}

// Fisher-Yates Algoritması ile Karıştırma (Tekrarı ve Sıralı Kalıpları Önler)
function shuffle(array) {
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
    // Soruları karıştırıyoruz
    currentQuestions = shuffle(quizData[categoryKey].questions);
    currentQuestionIndex = 0;
    score = { correct: 0, wrong: 0 };
    userSessionHistory = [];
    
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
    
    // Şıkların orijinal hallerini koruyarak indeks takibi için eşliyoruz ve şıkları da karıştırıyoruz
    let mappedOptions = currentQuestion.options.map((opt, i) => ({ text: opt, isCorrect: i === currentQuestion.answer }));
    mappedOptions = shuffle(mappedOptions);
    
    mappedOptions.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-150 cursor-pointer flex items-center font-medium text-gray-700 bg-white";
        btn.innerHTML = `<span class="inline-block bg-gray-100 text-gray-600 rounded-md px-2 py-1 mr-3 text-sm font-bold">${String.fromCharCode(65 + index)}</span> <span class="flex-1">${option.text}</span>`;
        
        btn.addEventListener('click', () => selectOption(btn, index, mappedOptions));
        optionsContainer.appendChild(btn);
    });
}

// Şık Seçimi ve Doğru-Yanlış Denetimi
function selectOption(selectedBtn, selectedIndex, mappedOptions) {
    if (optionSelected) return;
    optionSelected = true;
    
    const buttons = optionsContainer.querySelectorAll('button');
    let correctIndex = mappedOptions.findIndex(o => o.isCorrect);
    
    // Kullanıcı geçmişi kaydı
    userSessionHistory.push({
        question: currentQuestions[currentQuestionIndex].q,
        options: mappedOptions.map((o, idx) => `${String.fromCharCode(65 + idx)}) ${o.text}`),
        userAnswer: String.fromCharCode(65 + selectedIndex),
        correctAnswer: String.fromCharCode(65 + correctIndex),
        isSuccess: selectedIndex === correctIndex
    });

    if (selectedIndex === correctIndex) {
        selectedBtn.classList.remove('border-gray-200', 'hover:bg-gray-50');
        selectedBtn.classList.add('bg-emerald-50', 'border-emerald-500', 'text-emerald-800');
        selectedBtn.querySelector('span').classList.add('bg-emerald-500', 'text-white');
        selectedBtn.innerHTML += `<i class="fas fa-check-circle text-emerald-600 text-xl ml-2"></i>`;
        score.correct++;
    } else {
        selectedBtn.classList.remove('border-gray-200', 'hover:bg-gray-50');
        selectedBtn.classList.add('bg-rose-50', 'border-rose-500', 'text-rose-800');
        selectedBtn.querySelector('span').classList.add('bg-rose-500', 'text-white');
        selectedBtn.innerHTML += `<i class="fas fa-times-circle text-rose-600 text-xl ml-2"></i>`;
        
        // Doğru şıkkı yeşille vurgula
        const correctBtn = buttons[correctIndex];
        correctBtn.classList.add('bg-emerald-50', 'border-emerald-300', 'text-emerald-800');
        score.wrong++;
    }
    
    buttons.forEach(btn => btn.classList.add('pointer-events-none'));
    nextBtn.classList.remove('hidden');
}

// Sonraki Soru Tetikleyicisi
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Geri / Ana Sayfa Buton Ataması
quizBackBtn.addEventListener('click', () => {
    if(confirm("Testten çıkmak ve ana sayfaya dönmek istediğinize emin misiniz? İlerlemeniz silinecektir.")) {
        quizScreen.classList.add('hidden');
        categoryScreen.classList.remove('hidden');
        init();
    }
});

// Sonuç Ekranı Sunumu
function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    categoryResultTitle.textContent = quizData[currentCategory].title;
    totalQuestionsText.textContent = currentQuestions.length;
    correctCountText.textContent = score.correct;
    wrongCountText.textContent = score.wrong;
}

// Word Belgesi (.docx) Aktarım Motoru
exportWordBtn.addEventListener('click', () => {
    const categoryName = quizData[currentCategory].title;
    
    // Word HTML Şablon Yapısı
    let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <title>Test Sonuç Raporu</title>
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333333; }
                h1 { color: #1e40af; text-align: center; font-size: 20pt; margin-bottom: 5pt; }
                .meta { text-align: center; font-style: italic; color: #555555; margin-bottom: 20pt; }
                .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 25pt; }
                .summary-table th, .summary-table td { border: 1px solid #dddddd; padding: 8px; text-align: center; }
                .summary-table th { bg-color: #f3f4f6; font-weight: bold; }
                .question-block { margin-bottom: 20pt; padding: 10px; border-left: 3px solid #3b82f6; background: #fafafa; }
                .question-text { font-weight: bold; font-size: 11pt; margin-bottom: 5pt; }
                .option { margin-left: 15pt; font-size: 10.5pt; color: #444444; }
                .status-success { color: #16a34a; font-weight: bold; }
                .status-fail { color: #dc2626; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>EĞİTİM BİLİMLERİ TEST SONUÇ RAPORU</h1>
            <div class="meta">Kategori: ${categoryName} | Tarih: ${new Date().toLocaleDateString('tr-TR')}</div>
            
            <table class="summary-table">
                <thead>
                    <tr>
                        <th>Soru Sayısı</th>
                        <th>Doğru Cevap</th>
                        <th>Yanlış Cevap</th>
                        <th>Başarı Oranı</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${userSessionHistory.length}</td>
                        <td>${score.correct}</td>
                        <td>${score.wrong}</td>
                        <td>%${Math.round((score.correct / userSessionHistory.length) * 100)}</td>
                    </tr>
                </tbody>
            </table>
            
            <hr style="border: 0; border-top: 1px solid #eeeeee; margin-bottom: 20pt;"/>
    `;

    userSessionHistory.forEach((item, index) => {
        htmlContent += `
            <div class="question-block">
                <div class="question-text">Soru ${index + 1}: ${item.question}</div>
                ${item.options.map(opt => `<div class="option">${opt}</div>`).join('')}
                <div style="margin-top: 6pt; font-size: 10pt;">
                    <span><b>Sizin Cevabınız:</b> ${item.userAnswer}</span> | 
                    <span><b>Doğru Cevap:</b> ${item.correctAnswer}</span> -> 
                    <span class="${item.isSuccess ? 'status-success' : 'status-fail'}">${item.isSuccess ? 'DOĞRU' : 'YANLIŞ'}</span>
                </div>
            </div>
        `;
    });

    htmlContent += `</body></html>`;

    // Blob verisi oluşturma ve indirtme adımı
    const blob = new Blob(['\ufeff' + htmlContent], {
        type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KPSS_Test_Raporu_${currentCategory}_${new Date().toISOString().slice(0,10)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Ana Sayfa Tetikleyicisi
restartBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    categoryScreen.classList.remove('hidden');
    init();
});

// Sayfa Yüklendiğinde Başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}