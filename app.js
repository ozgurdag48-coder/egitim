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
const categoryResultTitle = document.getElementById('category-result-title');
const totalQuestionsText = document.getElementById('total-questions');
const correctCountText = document.getElementById('correct-count');
const wrongCountText = document.getElementById('wrong-count');
const restartBtn = document.getElementById('restart-btn');
const exportWordBtn = document.getElementById('export-word-btn');

// Ana Yapıyı Başlat ve Dinleyicileri Tek Seferlik Bağla
function init() {
    buildCategoryMenu();
    setupGlobalEventListeners();
}

// Kategorileri Grid Arayüzüne Çizme
function buildCategoryMenu() {
    if (!categoriesGrid) return;
    categoriesGrid.innerHTML = "";
    
    Object.keys(quizData).forEach(key => {
        const btn = document.createElement('button');
        btn.className = "p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 text-left transition-all duration-200 cursor-pointer flex justify-between items-center group w-full text-slate-800 font-semibold";
        btn.innerHTML = `
            <span>${quizData[key].title}</span>
            <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-500 transition-colors"></i>
        `;
        btn.addEventListener('click', () => startDynamicQuiz(key));
        categoriesGrid.appendChild(btn);
    });
}

// Fisher-Yates Karıştırma Metodu (Hem sorular hem şıklar için rastgelelik sağlar)
function shuffle(array) {
    let temp = [...array];
    for (let i = temp.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    return temp;
}

// Seçilen Havuzdan Online Tarzda Tamamen Farklı Soru Kombinasyonu Çekme
function startDynamicQuiz(categoryKey) {
    currentCategory = categoryKey;
    
    // Mevcut havuzdaki soruları tamamen karıştırıp çekiyoruz, her oturum benzersiz olur
    const rawQuestions = quizData[categoryKey].questions;
    currentQuestions = shuffle(rawQuestions); 
    
    currentQuestionIndex = 0;
    score = { correct: 0, wrong: 0 };
    userSessionHistory = [];
    
    // Ekran Geçişleri
    categoryScreen.classList.replace('block', 'hidden');
    resultScreen.classList.add('hidden');
    quizScreen.classList.replace('hidden', 'block');
    
    quizTitle.textContent = quizData[categoryKey].title;
    loadQuestion();
}

// Ekrana Soru ve Şıkları Basma
function loadQuestion() {
    optionSelected = false;
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = "";
    
    const currentQuestion = currentQuestions[currentQuestionIndex];
    progressText.textContent = `Soru: ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    questionText.textContent = currentQuestion.q;
    
    // Şıkları da kendi içerisinde tamamen karıştırarak kopya çekilmesini ve kalıpları engelliyoruz
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

// Şık Doğrulama Yönetimi
function handleOptionSelection(selectedBtn, selectedIndex, mappedOptions) {
    if (optionSelected) return;
    optionSelected = true;
    
    const buttons = optionsContainer.querySelectorAll('button');
    let correctIndex = mappedOptions.findIndex(o => o.isCorrect);
    
    userSessionHistory.push({
        question: currentQuestions[currentQuestionIndex].q,
        options: mappedOptions.map((o, idx) => `${String.fromCharCode(65 + idx)}) ${o.text}`),
        userAnswer: String.fromCharCode(65 + selectedIndex),
        correctAnswer: String.fromCharCode(65 + correctIndex),
        isSuccess: selectedIndex === correctIndex
    });

    if (selectedIndex === correctIndex) {
        selectedBtn.classList.replace('border-gray-200', 'border-emerald-500');
        selectedBtn.classList.add('bg-emerald-50', 'text-emerald-800');
        selectedBtn.querySelector('span').classList.add('bg-emerald-500', 'text-white');
        selectedBtn.innerHTML += `<i class="fas fa-check-circle text-emerald-600 text-xl ml-2"></i>`;
        score.correct++;
    } else {
        selectedBtn.classList.replace('border-gray-200', 'border-rose-500');
        selectedBtn.classList.add('bg-rose-50', 'text-rose-800');
        selectedBtn.querySelector('span').classList.add('bg-rose-500', 'text-white');
        selectedBtn.innerHTML += `<i class="fas fa-times-circle text-rose-600 text-xl ml-2"></i>`;
        
        const correctBtn = buttons[correctIndex];
        correctBtn.classList.add('bg-emerald-50', 'border-emerald-300', 'text-emerald-800');
    }
    
    buttons.forEach(btn => btn.classList.add('pointer-events-none'));
    nextBtn.classList.remove('hidden');
}

// Global Olay Dinleyicileri (Kilitlenme Yaşanmaması İçin Tek Sefer Tanımlanır)
function setupGlobalEventListeners() {
    // Sonraki Soru Butonu
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });

    // Test İçindeki Ana Sayfa / Geri Butonu
    quizBackBtn.addEventListener('click', () => {
        if(confirm("Mevcut test ilerlemeniz silinecektir. Ana sayfaya dönmek istiyor musiniz?")) {
            goToHomeScreen();
        }
    });

    // Sonuç Ekranındaki Ana Sayfaya Dön Butonu
    restartBtn.addEventListener('click', goToHomeScreen);

    // Word Raporu Aktarım Butonu
    exportWordBtn.addEventListener('click', exportToWordFile);
}

// Ekranı Sıfırlayıp Ana Sayfaya Güvenli Taşıma Fonksiyonu
function goToHomeScreen() {
    quizScreen.classList.replace('block', 'hidden');
    resultScreen.classList.add('hidden');
    categoryScreen.classList.replace('hidden', 'block');
    buildCategoryMenu(); // Dinamik menüyü yenile
}

// Sonuç Ekranı Tetikleyicisi
function showResults() {
    quizScreen.classList.replace('block', 'hidden');
    resultScreen.classList.remove('hidden');
    
    categoryResultTitle.textContent = quizData[currentCategory].title;
    totalQuestionsText.textContent = currentQuestions.length;
    correctCountText.textContent = score.correct;
    wrongCountText.textContent = score.wrong;
}

// Word (.docx) Dosya Çıktı Üretim Sistemi
function exportToWordFile() {
    const categoryName = quizData[currentCategory].title;
    let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>Test Sonuç Raporu</title>
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333333; }
                h1 { color: #1e40af; text-align: center; font-size: 18pt; }
                .meta { text-align: center; font-style: italic; color: #555555; margin-bottom: 15pt; }
                .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 20pt; }
                .summary-table th, .summary-table td { border: 1px solid #dddddd; padding: 8px; text-align: center; }
                .summary-table th { background-color: #f3f4f6; }
                .question-block { margin-bottom: 15pt; padding: 8px; border-left: 3px solid #3b82f6; background: #fafafa; }
                .question-text { font-weight: bold; margin-bottom: 4pt; }
                .option { margin-left: 12pt; color: #444444; }
                .status-success { color: #16a34a; font-weight: bold; }
                .status-fail { color: #dc2626; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>EĞİTİM BİLİMLERİ TEST SONUÇ RAPORU</h1>
            <div class="meta">Kategori: ${categoryName} | Tarih: ${new Date().toLocaleDateString('tr-TR')}</div>
            <table class="summary-table">
                <thead>
                    <tr><th>Soru Sayısı</th><th>Doğru</th><th>Yanlış</th><th>Başarı Oranı</th></tr>
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
    `;

    userSessionHistory.forEach((item, index) => {
        htmlContent += `
            <div class="question-block">
                <div class="question-text">Soru ${index + 1}: ${item.question}</div>
                ${item.options.map(opt => `<div class="option">${opt}</div>`).join('')}
                <div style="margin-top: 5pt; font-size: 10pt;">
                    <span><b>Sizin Cevabınız:</b> ${item.userAnswer}</span> | 
                    <span><b>Doğru Cevap:</b> ${item.correctAnswer}</span> -> 
                    <span class="${item.isSuccess ? 'status-success' : 'status-fail'}">${item.isSuccess ? 'DOĞRU' : 'YANLIŞ'}</span>
                </div>
            </div>
        `;
    });

    htmlContent += `</body></html>`;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KPSS_Sonuc_${currentCategory}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// DOM Yüklendiğinde Tetikle
document.addEventListener('DOMContentLoaded', init);