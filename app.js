// Konu Başlıkları
const categoriesConfig = {
    "oiy": "Öğretim İlke ve Yöntemleri",
    "sy": "Sınıf Yönetimi",
    "otmt": "Öğretim Teknolojileri ve Materyal Tasarım",
    "op": "Öğrenme Psikolojisi",
    "gp": "Gelişim Psikolojisi",
    "oe": "Özel Eğitim"
};

// Kalıcı Hafıza Önbelleği
let globalWrongQuestionsPool = { "oiy": [], "sy": [], "otmt": [], "op": [], "gp": [], "oe": [] };
let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = { correct: 0, wrong: 0 };
let userSessionHistory = [];

// --- LOCALSTORAGE VERİ TABANI MOTORU ---
// Uygulama ilk kez açıldığında boş kalmasın diye yüklenecek olan kaliteli KPSS Başlangıç Seti
const defaultKpssQuestions = [
    { id: "oiy_init_1", category: "oiy", q: "Bir öğretmen, bölme işlemini anlatırken öğrencilerin geçmiş yıllarda öğrendiği çarpma işlemi bilgilerini kontrol etmiş ve hatırlatmıştır. Öğretmenin bu yaklaşımı hangi öğretim ilkesiyle doğrudan örtüşür?", options: ["Bilinenden bilinmeyene", "Somuttan soyuta", "Yakından uzağa", "Açıklık", "Bireyselleştirme"], answer: 0, explanation: "Yeni bilgilerin mevcut zihinsel şemalar ve eski öğrenmeler üzerine inşa edilmesi 'Bilinenden Bilinmeyene' ilkesidir." },
    { id: "oiy_init_2", category: "oiy", q: "Öğrencilerin gruplar halinde çalışarak somut, disiplinler arası bir ürün ortaya koydukları ve gerçek yaşam senaryolarına dayalı çözümler geliştirdikleri öğretim yöntemi hangisidir?", options: ["Proje Tabanlı Öğrenme", "Sunuş Yoluyla Öğretim", "Anlatım Yöntemi", "Beyin Fırtınası", "Örnek Olay Modeli"], answer: 0, explanation: "Proje tabanlı öğrenme, sürecin sonunda mutlaka somut, sergilenebilir özgün bir ürünün ya da performansın ortaya konmasını gerektirir." },
    { id: "sy_init_1", category: "sy", q: "Sınıf yönetiminde kurallar belirlenirken uyulması gereken öncelikli pedagojik kriter aşağıdakilerden hangisidir?", options: ["Kuralları öğrencilerle birlikte belirlemek", "Kuralları tamamen okul yönetimine bırakmak", "Olumsuz ifadeler seçmek", "Kuralların listesini uzun tutmak", "Cezaları açıkça yazmak"], answer: 0, explanation: "Demokratik sınıf yönetiminde kurallar ortak katılımıyla belirlenirse, öğrencilerin kuralları içselleştirmesi kolaylaşır." },
    { id: "otmt_init_1", category: "otmt", q: "Edgar Dale'in Yaşantı Konisi modeline göre, kalıcılığı ve somut öğrenme düzeyi en yüksek olan yaşantı türü aşağıdakilerden hangisidir?", options: ["Doğrudan doğruya edinilen amaçlı yaşantılar", "Model ve maketlerle edinilen yaşantılar", "Televizyon ve hareketli görüntüler", "Görsel semboller", "Sözel semboller"], answer: 0, explanation: "Yaşantı Konisi'nin en tabanında yer alan 'Doğrudan edinilen yaşantılar', yaparak-yaşayarak öğrendiğimiz en kalıcı deneyimlerdir." },
    { id: "op_init_1", category: "op", q: "Klasik koşullanma oluştuktan sonra, organizmaya koşullu uyarıcı verilmesine rağmen uzun süre koşulsuz uyarıcı verilmezse, koşullu tepkinin azalarak yok olması durumu hangisidir?", options: ["Sönme", "Genelleme", "Ayırt etme", "Gölgeleme", "Kendiliğinden geri gelme"], answer: 0, explanation: "Ödülle desteklenmeyen koşullu uyarıcılar zamanla etkisini yitirir ve davranışın ortadan kalkması yani 'Sönme' gerçekleşir." },
    { id: "gp_init_1", category: "gp", q: "Piaget'nin Bilişsel Gelişim Kuramı'na göre, bir çocuğun nesnelerin şekli değişse dahi miktar veya ağırlıklarının değişmediğini kavraması (Korunum) hangi dönemin temel kazancıdır?", options: ["Somut İşlemler Dönemi", "İşlem Öncesi Dönem", "Duyusal Motor Dönemi", "Soyut İşlemler Dönemi", "Sezgisel Dönem"], answer: 0, explanation: "Maddenin miktarının değişmediğini algılama becerisi olan 'Korunum', Somut İşlemler döneminde (7-11 yaş) kazanılır." },
    { id: "oe_init_1", category: "oe", q: "Özel gereksinimli bireylerin, akranlarından koparılmadan, en az kısıtlayıcı eğitim ortamında normal sınıflarda eğitim alması modeline ne ad verilir?", options: ["Kaynaştırma / Bütünleştirme Eğitimi", "Özel Alt Sınıf Uygulaması", "Ayrıştırılmış Eğitim Kampüsü", "Yatılı Özel Okul Hizmeti", "Evde İzole Eğitim"], answer: 0, explanation: "Modern özel eğitim anlayışı, bireyleri toplumdan soyutlamayan 'Kaynaştırma / Bütünleştirme' modelini esas alır." }
];

// Tarayıcı hafızasını başlatan fonksiyon
function initLocalDatabase() {
    if (!localStorage.getItem('kpss_question_repository')) {
        localStorage.setItem('kpss_question_repository', JSON.stringify(defaultKpssQuestions));
    }
}

// Dışarıdan panel vasıtasıyla yeni soru ekleme fonksiyonu (Gelecekte kullanman için hazırlandı)
function addNewQuestionToRepository(category, questionText, optionsArray, correctIndex, explanationText) {
    let repo = JSON.parse(localStorage.getItem('kpss_question_repository')) || [];
    let newQuestion = {
        id: "custom_" + Date.now() + "_" + Math.floor(Math.random() * 100),
        category: category,
        q: questionText,
        options: optionsArray,
        answer: parseInt(correctIndex),
        explanation: explanationText
    };
    repo.push(newQuestion);
    localStorage.setItem('kpss_question_repository', JSON.stringify(repo));
    buildCategoryMenu(); // Menüdeki sayıları / durumları tazele
}
// -------------------------------------------

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
        categoryResultTitle: document.getElementById('category-result-title'),
        correctCountText: document.getElementById('correct-count'),
        wrongCountText: document.getElementById('wrong-count'),
        restartBtn: document.getElementById('restart-btn')
    };
}

function shuffle(array) {
    let temp = [...array];
    for (let i = temp.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    return temp;
}

function buildCategoryMenu() {
    initLocalDatabase();
    const el = getElements();
    if (!el.categoriesGrid) return;
    
    el.categoriesGrid.innerHTML = "";
    if (el.categoryScreen) el.categoryScreen.style.display = 'block';
    
    Object.keys(categoriesConfig).forEach(key => {
        const wrongCount = globalWrongQuestionsPool[key].length;
        const badge = wrongCount > 0 ? `<span class="ml-2 bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">${wrongCount} Hata Hafızada</span>` : '';
        
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = "p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 text-left transition-all duration-200 cursor-pointer flex justify-between items-center group w-full text-slate-800 font-semibold mb-2";
        btn.innerHTML = `
            <span class="flex items-center gap-2">
                <i class="fas fa-book-open text-blue-600"></i>
                ${categoriesConfig[key]} ${badge}
            </span>
            <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-600 transition-colors"></i>
        `;
        
        btn.addEventListener('click', () => startNewUniqueQuiz(key));
        el.categoriesGrid.appendChild(btn);
    });
}

function startNewUniqueQuiz(categoryKey) {
    const el = getElements();
    if (el.categoryScreen) el.categoryScreen.style.display = 'none';
    if (el.quizScreen) {
        el.quizScreen.style.display = 'block';
        el.quizTitle.textContent = categoriesConfig[categoryKey];
        el.questionText.innerHTML = `<div class="flex items-center justify-center gap-3 p-8 text-blue-600 font-medium"><i class="fas fa-spinner fa-spin text-2xl"></i> Yerel Veri Tabanından Test Kombinasyonu Derleniyor...</div>`;
        el.optionsContainer.innerHTML = "";
    }

    currentCategory = categoryKey;
    currentQuestions = [];
    currentQuestionIndex = 0;
    score = { correct: 0, wrong: 0 };
    userSessionHistory = [];

    // 1. Tarayıcı yerel deposundan tüm havuzu oku ve filtrele
    let fullRepo = JSON.parse(localStorage.getItem('kpss_question_repository')) || [];
    let freshPool = fullRepo.filter(q => q.category === categoryKey);
    
    // 2. Aktif yanlış havuzunu getir
    let previousWrongs = [...globalWrongQuestionsPool[categoryKey]];

    // Mükerrer engelleme
    let filteredFresh = freshPool.filter(fq => !previousWrongs.some(wq => wq.id === fq.id));

    // 3. Harmanlama ve Karıştırma
    let mixedSet = shuffle([...previousWrongs, ...filteredFresh]);
    currentQuestions = mixedSet.slice(0, 5); // 5 Soru getirir

    loadQuestion();
}

function loadQuestion() {
    const el = getElements();
    if (el.nextBtn) el.nextBtn.classList.add('hidden');
    if (el.optionsContainer) el.optionsContainer.innerHTML = "";
    
    if (currentQuestionIndex >= currentQuestions.length) {
        showResults();
        return;
    }

    const currentQuestion = currentQuestions[currentQuestionIndex];
    if (el.progressText) el.progressText.textContent = `Soru: ${currentQuestionIndex + 1} / ${currentQuestions.length}`;
    if (el.questionText) el.questionText.textContent = currentQuestion.q;
    
    let originalOptions = currentQuestion.options.map((opt, idx) => ({
        text: opt,
        isCorrect: idx === currentQuestion.answer
    }));
    
    let shuffledOptions = shuffle(originalOptions);
    currentQuestion.dynamicCorrectIdx = shuffledOptions.findIndex(o => o.isCorrect);
    currentQuestion.dynamicOptionsList = shuffledOptions.map(o => o.text);

    shuffledOptions.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = "w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer flex items-center font-medium text-gray-700 bg-white mb-2 shadow-sm option-choice-btn";
        btn.innerHTML = `<span class="inline-block bg-gray-100 text-gray-600 rounded-md px-2 py-1 mr-3 text-sm font-bold option-index-patch">${String.fromCharCode(65 + index)}</span> <span class="flex-1">${option.text}</span>`;
        
        btn.addEventListener('click', () => {
            const buttons = el.optionsContainer.querySelectorAll('.option-choice-btn');
            buttons.forEach(b => {
                b.classList.remove('border-blue-600', 'bg-blue-50', 'text-blue-900');
                b.querySelector('.option-index-patch').classList.remove('bg-blue-600', 'text-white');
            });
            btn.classList.add('border-blue-600', 'bg-blue-50', 'text-blue-900');
            btn.querySelector('.option-index-patch').classList.add('bg-blue-600', 'text-white');
            btn.setAttribute('data-selected-idx', index);
            if (el.nextBtn) el.nextBtn.classList.remove('hidden');
        });
        
        if (el.optionsContainer) el.optionsContainer.appendChild(btn);
    });
}

function processAndNext() {
    const el = getElements();
    const activeQuestion = currentQuestions[currentQuestionIndex];
    const selectedBtn = el.optionsContainer.querySelector('[data-selected-idx]');
    
    if (!selectedBtn) return;
    
    const selectedIndex = parseInt(selectedBtn.getAttribute('data-selected-idx'));
    const isCorrect = selectedIndex === activeQuestion.dynamicCorrectIdx;

    if (isCorrect) {
        score.correct++;
        globalWrongQuestionsPool[currentCategory] = globalWrongQuestionsPool[currentCategory].filter(q => q.id !== activeQuestion.id);
    } else {
        score.wrong++;
        if (!globalWrongQuestionsPool[currentCategory].some(q => q.id === activeQuestion.id)) {
            globalWrongQuestionsPool[currentCategory].push(activeQuestion);
        }
    }

    userSessionHistory.push({
        question: activeQuestion.q,
        options: activeQuestion.dynamicOptionsList,
        userAnswerIdx: selectedIndex,
        correctAnswerIdx: activeQuestion.dynamicCorrectIdx,
        explanation: activeQuestion.explanation,
        isSuccess: isCorrect
    });

    currentQuestionIndex++;
    loadQuestion();
}

function showResults() {
    const el = getElements();
    if (el.quizScreen) el.quizScreen.style.display = 'none';
    if (el.resultScreen) el.resultScreen.classList.remove('hidden');
    
    if (el.categoryResultTitle) el.categoryResultTitle.textContent = categoriesConfig[currentCategory];
    if (el.correctCountText) el.correctCountText.textContent = score.correct;
    if (el.wrongCountText) el.wrongCountText.textContent = score.wrong;

    let reportContainer = document.getElementById('test-gerekce-raporu');
    if (!reportContainer) {
        reportContainer = document.createElement('div');
        reportContainer.id = 'test-gerekce-raporu';
        reportContainer.className = "mt-8 text-left space-y-6 border-t border-gray-200 pt-6";
        el.resultScreen.appendChild(reportContainer);
    }

    reportContainer.innerHTML = `<h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><i class="fas fa-file-alt text-blue-600"></i> KPSS Soru Çözümleri ve Gerekçeleri</h3>`;

    userSessionHistory.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `p-5 rounded-xl border ${item.isSuccess ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'} shadow-sm mb-4`;
        
        let optionsHtml = '';
        item.options.forEach((opt, oIdx) => {
            let optStyle = "text-gray-700";
            if (oIdx === item.correctAnswerIdx) optStyle = "text-emerald-700 font-bold flex items-center gap-1";
            if (oIdx === item.userAnswerIdx && !item.isSuccess) optStyle = "text-rose-700 font-bold flex items-center gap-1";
            
            optionsHtml += `
                <div class="text-sm p-2 rounded bg-white/80 mb-1 ${optStyle}">
                    <b>${String.fromCharCode(65 + oIdx)})</b> ${opt}
                    ${oIdx === item.correctAnswerIdx ? ' <i class="fas fa-check text-emerald-600"></i> (Doğru Cevap)' : ''}
                    ${oIdx === item.userAnswerIdx && !item.isSuccess ? ' <i class="fas fa-times text-rose-600"></i> (Sizin Cevabınız)' : ''}
                </div>
            `;
        });

        card.innerHTML = `
            <div class="flex items-start gap-2 mb-2">
                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${item.isSuccess ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">${index + 1}</span>
                <p class="font-semibold text-gray-800 flex-1">${item.question}</p>
            </div>
            <div class="my-3 pl-6">${optionsHtml}</div>
            <div class="mt-2 pl-6 pt-2 border-t border-dashed border-gray-200 text-sm text-slate-700">
                <strong class="text-blue-900 block mb-1"><i class="fas fa-lightbulb"></i> Akademik Gerekçe & Çözüm:</strong>
                ${item.explanation}
            </div>
        `;
        reportContainer.appendChild(card);
    });
}

function goToHomeScreen() {
    const el = getElements();
    if (el.quizScreen) el.quizScreen.style.display = 'none';
    if (el.resultScreen) el.resultScreen.classList.add('hidden');
    if (el.categoryScreen) el.categoryScreen.style.display = 'block';
    buildCategoryMenu();
}

function setupGlobalEventListeners() {
    const el = getElements();
    if (el.nextBtn) {
        el.nextBtn.replaceWith(el.nextBtn.cloneNode(true));
    }
    const freshEl = getElements();
    if (freshEl.nextBtn) freshEl.nextBtn.addEventListener('click', processAndNext);
    if (freshEl.quizBackBtn) {
        freshEl.quizBackBtn.addEventListener('click', () => {
            if(confirm("Test süreciniz sıfırlanacaktır. Ana sayfaya dönmek istiyor musunuz?")) goToHomeScreen();
        });
    }
    if (freshEl.restartBtn) freshEl.restartBtn.addEventListener('click', goToHomeScreen);
}

document.addEventListener('DOMContentLoaded', () => {
    buildCategoryMenu();
    setupGlobalEventListeners();
});
window.addEventListener('load', () => {
    buildCategoryMenu();
});
