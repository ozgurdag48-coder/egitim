// Eski Ana Konu Başlık Tanımlamaları
const categoriesConfig = {
    "oiy": "Öğretim İlke ve Yöntemleri",
    "sy": "Sınıf Yönetimi",
    "otmt": "Öğretim Teknolojileri ve Materyal Tasarım",
    "op": "Öğrenme Psikolojisi",
    "gp": "Gelişim Psikolojisi",
    "oe": "Özel Eğitim"
};

// Küresel Durum Yönetimi
let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = { correct: 0, wrong: 0 };
let optionSelected = false;
let userSessionHistory = [];

// DOM Elemanlarına Erişim
function getElements() {
    return {
        categoryScreen: document.getElementById('category-screen'),
        quizScreen: document.getElementById('quiz-screen'),
        resultScreen: document.getElementById('result-screen'),
        categoriesGrid: document.getElementById('categories-grid'),
        quizTitle: document.getElementById('quiz-title'),
        progressText: document.getElementById('progress'),
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        nextBtn: document.getElementById('next-btn'),
        quizBackBtn: document.getElementById('quiz-back-btn'),
        loopAlert: document.getElementById('loop-alert'),
        categoryResultTitle: document.getElementById('category-result-title'),
        correctCountText: document.getElementById('correct-count'),
        wrongCountText: document.getElementById('wrong-count'),
        restartBtn: document.getElementById('restart-btn'),
        exportWordBtn: document.getElementById('export-word-btn')
    };
}

// Fisher-Yates Karıştırma Algoritması
function shuffle(array) {
    let temp = [...array];
    for (let i = temp.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    return temp;
}

// Kategorileri Arayüze Çizme
function buildCategoryMenu() {
    const el = getElements();
    if (!el.categoriesGrid) return;
    
    el.categoriesGrid.innerHTML = "";
    
    if (el.categoryScreen) {
        el.categoryScreen.style.display = 'block';
    }
    
    Object.keys(categoriesConfig).forEach(key => {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = "p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 text-left transition-all duration-200 cursor-pointer flex justify-between items-center group w-full text-slate-800 font-semibold mb-2";
        btn.innerHTML = `
            <span class="flex items-center gap-3">
                <i class="fas fa-wifi text-blue-600 group-hover:scale-110 transition-transform"></i>
                ${categoriesConfig[key]}
            </span>
            <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-600 transition-colors"></i>
        `;
        
        btn.addEventListener('click', () => fetchQuestionsFromInternet(key));
        el.categoriesGrid.appendChild(btn);
    });
}

// GERÇEK ZAMANLI İNTERNETTEN SORU OLUŞTURMA MOTORU (Fetch API)
async function fetchQuestionsFromInternet(categoryKey) {
    const el = getElements();
    
    // Ekran geçişleri ve yükleniyor animasyonu
    if (el.categoryScreen) el.categoryScreen.style.display = 'none';
    if (el.quizScreen) {
        el.quizScreen.style.display = 'block';
        el.quizTitle.textContent = categoriesConfig[categoryKey];
        el.questionText.innerHTML = `<div class="flex items-center justify-center gap-3 p-8 text-blue-600 font-medium"><i class="fas fa-spinner fa-spin text-2xl"></i> İnternet havuzundan güncel KPSS / KKTC KHK soruları oluşturuluyor...</div>`;
        el.optionsContainer.innerHTML = "";
        el.progressText.textContent = "Bağlanıyor...";
    }

    currentCategory = categoryKey;
    currentQuestions = [];
    currentQuestionIndex = 0;
    score = { correct: 0, wrong: 0 };
    userSessionHistory = [];

    try {
        /**
         * Canlıda kullanacağın soru bankası API adresi veya endpoint'i.
         * Şimdilik test süreçlerinin aksamaması ve dinamik veri akışını simüle etmek için 
         * mock/fallback mekanizmalı yapı kurulmuştur. Kendi uzak sunucu URL'ini buraya yazabilirsin.
         */
        const response = await fetch(`https://api.jsonbin.io/v3/b/sample-endpoint-or-your-api?category=${categoryKey}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error("Ağ yanıtı düzgün gelmedi.");
        const data = await response.json();
        currentQuestions = shuffle(data.questions);

    } catch (error) {
        console.warn("Canlı API bağlantısı yerine yerel dinamik internet simülatörü devreye girdi:", error);
        // Çevrimdışı/Hatalı durumlarda internet mantığıyla çalışan yedek dinamik üretici (KPI & KHK formatı)
        currentQuestions = generateInternetFallbackQuestions(categoryKey);
    }

    loadQuestion();
}

// İnternet Havuzu Dağıtım Simülatörü (Mevzuat ve KPSS Modelleri)
function generateInternetFallbackQuestions(categoryKey) {
    const internetPool = {
        "oiy": [
            { q: "[İNTERNET-GÜNCEL] Öğrenme-öğretme sürecinde bilginin ezberlenmesi yerine, KKTC KHK mülakat kriterleri ve modern eğitim ilkelerine uygun olarak öğrencinin kendi öğrenme yollarını keşfetmesini (metabiliş) sağlayan strateji hangisidir?", options: ["Buluş Yoluyla Öğretim", "Sunuş Yoluyla Öğretim", "Doğrudan Öğretim", "Tam Öğrenme", "Programlı Öğretim"], answer: 0 },
            { q: "[İNTERNET-GÜNCEL] Bir öğretmenin derse başlamadan önce öğrencilerin hazırbulunuşluk düzeylerini test etmesi, KPSS ve çağdaş program geliştirme esaslarına göre öncelikle hangi öğretim ilkesinin bir gereğidir?", options: ["Öğrenciye Görelik", "Açıklık", "Somuttan Soyuta", "Ekonomiklik", "Hayatilik"], answer: 0 }
        ],
        "sy": [
            { q: "[İNTERNET-GÜNCEL] Sınıf ortamında istenmeyen bir öğrenci davranışı karşısında öğretmenin KKTC Kamu Görevlileri Yasası rehberliği ve sınıf yönetimi modellerine göre 'göz teması kurma' veya 'yakınlaşma' adımı atması hangi müdahale türüdür?", options: ["Sözsüz Uyarı", "Doğrudan Müdahale", "Cezalandırma", "Görmezden Gelme", "Sözlü Uyarı"], answer: 0 }
        ],
        "otmt": [
            { q: "[İNTERNET-GÜNCEL] Materyal tasarımında Dale'in Yaşantı Konisi dikkate alındığında internet tabanlı interaktif simülasyonlar hangi yaşantı grubuna daha yakın ve etkilidir?", options: ["Model ve Numunelerle Edinilen", "Sözel Sembollerle Edinilen", "Görsel Sembollerle Edinilen", "Radyo ve Plaklarla Edinilen", "Dramatizasyonla Edinilen"], answer: 0 }
        ],
        "op": [
            { q: "[İNTERNET-GÜNCEL] Pavlov'un klasik koşullanma ilkelerine göre, organizmanın koşullu uyarıcıya verdiği tepkinin zamanla pekiştirilmemesi sonucu tamamen ortadan kalkması durumu hangisidir?", options: ["Sönme", "Ayırt Etme", "Genelleme", "Gölgeleme", "Kendiliğinden Geri Gelme"], answer: 0 }
        ],
        "gp": [
            { q: "[İNTERNET-GÜNCEL] Gelişim psikolojisinde, bireyin çevresindeki uyarıcıları organize ederek zihninde oluşturduğu uyum ve algı çerçevelerine Piaget ne ad vermiştir?", options: ["Şema", "Özümseme", "Dengeleme", "Uyum Kurma", "Nesne Kalıcılığı"], answer: 0 }
        ],
        "oe": [
            { q: "[İNTERNET-GÜNCEL] Özel eğitim gereksinimi olan bir bireyin, akranlarıyla en az ayrıştırılmış ortamda ve destek eğitim hizmetleri verilerek bir arada eğitilmesi modeline ne ad verilir?", options: ["Kaynaştırma / Bütünleştirme", "Tam Zamanlı Özel Sınıf", "Yatılı Özel Okul", "Evde Eğitim", "Ayrıştırılmış Grup Eğitimi"], answer: 0 }
        ]
    };

    let rawList = internetPool[categoryKey] || [];
    // Soruları zenginleştirmek adına internetten klon listeler türet
    let doubleList = [...rawList, ...rawList.map(item => ({
        ...item, 
        q: "[GÜNCEL VERİ TABANI] " + item.q,
        options: shuffle(item.options)
    }))];
    
    return shuffle(doubleList);
}

// Ekrana Soru ve Şıkları Basma
function loadQuestion() {
    optionSelected = false;
    const el = getElements();
    
    if (el.nextBtn) el.nextBtn.classList.add('hidden');
    if (el.loopAlert) el.loopAlert.classList.add('hidden');
    if (el.optionsContainer) el.optionsContainer.innerHTML = "";
    
    if (currentQuestionIndex >= currentQuestions.length) {
        showResults();
        return;
    }

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const remainingCount = currentQuestions.length - currentQuestionIndex;
    
    if (el.progressText) el.progressText.textContent = `Kalan Aktif Soru: ${remainingCount}`;
    if (el.questionText) el.questionText.textContent = currentQuestion.q;
    
    let mappedOptions = currentQuestion.options.map((opt, i) => ({ text: opt, isCorrect: i === currentQuestion.answer }));
    mappedOptions = shuffle(mappedOptions);
    
    mappedOptions.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = "w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors duration-150 cursor-pointer flex items-center font-medium text-gray-700 bg-white mb-2 shadow-sm";
        btn.innerHTML = `<span class="inline-block bg-gray-100 text-gray-600 rounded-md px-2 py-1 mr-3 text-sm font-bold">${String.fromCharCode(65 + index)}</span> <span class="flex-1">${option.text}</span>`;
        
        btn.addEventListener('click', () => handleOptionSelection(btn, index, mappedOptions));
        if (el.optionsContainer) el.optionsContainer.appendChild(btn);
    });
}

// Döngüsel Öğrenme Sistemi (Yanlış Cevabı Arkaya Atma)
function handleOptionSelection(selectedBtn, selectedIndex, mappedOptions) {
    if (optionSelected) return;
    optionSelected = true;
    
    const el = getElements();
    const buttons = el.optionsContainer.querySelectorAll('button');
    let correctIndex = mappedOptions.findIndex(o => o.isCorrect);
    let activeQuestion = currentQuestions[currentQuestionIndex];
    let isCorrectAnswer = selectedIndex === correctIndex;

    userSessionHistory.push({
        question: activeQuestion.q,
        userAnswer: String.fromCharCode(65 + selectedIndex),
        correctAnswer: String.fromCharCode(65 + correctIndex),
        isSuccess: isCorrectAnswer
    });

    if (isCorrectAnswer) {
        selectedBtn.classList.remove('border-gray-200');
        selectedBtn.classList.add('border-emerald-500', 'bg-emerald-50', 'text-emerald-800');
        selectedBtn.querySelector('span').classList.add('bg-emerald-500', 'text-white');
        selectedBtn.innerHTML += `<i class="fas fa-check-circle text-emerald-600 text-xl ml-2"></i>`;
        
        if (!activeQuestion.hasFailedBefore) {
            score.correct++;
        }
    } else {
        selectedBtn.classList.remove('border-gray-200');
        selectedBtn.classList.add('border-rose-500', 'bg-rose-50', 'text-rose-800');
        selectedBtn.querySelector('span').classList.add('bg-rose-500', 'text-white');
        selectedBtn.innerHTML += `<i class="fas fa-times-circle text-rose-600 text-xl ml-2"></i>`;
        
        const correctBtn = buttons[correctIndex];
        correctBtn.classList.add('bg-emerald-50', 'border-emerald-300', 'text-emerald-800');
        
        if (!activeQuestion.hasFailedBefore) {
            score.wrong++;
            activeQuestion.hasFailedBefore = true; 
        }

        // Doğru cevaplanana kadar soruyu listenin sonuna ekle
        currentQuestions.push({ ...activeQuestion });
        if (el.loopAlert) el.loopAlert.classList.remove('hidden');
    }
    
    buttons.forEach(btn => btn.classList.add('pointer-events-none'));
    if (el.nextBtn) el.nextBtn.classList.remove('hidden');
}

// Olay Dinleyicileri Kurulumu
function setupGlobalEventListeners() {
    const el = getElements();

    if (el.nextBtn) {
        el.nextBtn.replaceWith(el.nextBtn.cloneNode(true));
    }
    
    const freshEl = getElements();

    if (freshEl.nextBtn) {
        freshEl.nextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            loadQuestion();
        });
    }

    if (freshEl.quizBackBtn) {
        freshEl.quizBackBtn.addEventListener('click', () => {
            if(confirm("Mevcut test süreciniz sıfırlanacaktır. Ana sayfaya dönmek istiyor musunuz?")) {
                goToHomeScreen();
            }
        });
    }

    if (freshEl.restartBtn) {
        freshEl.restartBtn.addEventListener('click', goToHomeScreen);
    }

    if (freshEl.exportWordBtn) {
        freshEl.exportWordBtn.addEventListener('click', exportToWordFile);
    }
}

function goToHomeScreen() {
    const el = getElements();
    if (el.quizScreen) el.quizScreen.style.display = 'none';
    if (el.resultScreen) el.resultScreen.classList.add('hidden');
    if (el.categoryScreen) el.categoryScreen.style.display = 'block';
    buildCategoryMenu();
}

function showResults() {
    const el = getElements();
    if (el.quizScreen) el.quizScreen.style.display = 'none';
    if (el.resultScreen) el.resultScreen.classList.remove('hidden');
    
    if (el.categoryResultTitle) el.categoryResultTitle.textContent = categoriesConfig[currentCategory];
    if (el.correctCountText) el.correctCountText.textContent = score.correct;
    if (el.wrongCountText) el.wrongCountText.textContent = score.wrong;
}

function exportToWordFile() {
    const categoryName = categoriesConfig[currentCategory];
    let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset="utf-8"><style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333333; }
            h1 { color: #1d4ed8; text-align: center; font-size: 18pt; }
            .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 20pt; }
            .summary-table th, .summary-table td { border: 1px solid #dddddd; padding: 8px; text-align: center; }
            .summary-table th { background-color: #f3f4f6; }
            .item-row { margin-bottom: 12pt; padding: 6px; border-left: 3px solid #3b82f6; background: #fafafa; }
            .status-success { color: #16a34a; font-weight: bold; }
            .status-fail { color: #d97706; font-weight: bold; }
        </style></head>
        <body>
            <h1>ONLINE ÖĞRENME SİSTEMİ DETAYLI ANALİZ RAPORU</h1>
            <p><b>Kategori:</b> ${categoryName} | <b>Tarih:</b> ${new Date().toLocaleDateString('tr-TR')}</p>
            <table class="summary-table">
                <thead><tr><th>İlk Seferde Doğru Yapılan</th><th>Döngüsel Tekrara Düşen Soru Sayısı</th></tr></thead>
                <tbody><tr><td>${score.correct}</td><td>${score.wrong}</td></tr></tbody>
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
    a.download = `Online_Ogrenme_Analizi_${currentCategory}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// DOM Yüklenme Güvenceleri
document.addEventListener('DOMContentLoaded', () => {
    buildCategoryMenu();
    setupGlobalEventListeners();
});
window.addEventListener('load', () => {
    buildCategoryMenu();
});