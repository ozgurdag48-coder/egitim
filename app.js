// Eski Ana Konu Başlık Tanımlamaları
const categoriesConfig = {
    "oiy": "Öğretim İlke ve Yöntemleri",
    "sy": "Sınıf Yönetimi",
    "otmt": "Öğretim Teknolojileri ve Materyal Tasarım",
    "op": "Öğrenme Psikolojisi",
    "gp": "Gelişim Psikolojisi",
    "oe": "Özel Eğitim"
};

// Kalıcı Hafıza: Önceki testlerde yanlış yapılan soruları kategorisine göre burada saklıyoruz
let globalWrongQuestionsPool = {
    "oiy": [], "sy": [], "otmt": [], "op": [], "gp": [], "oe": []
};

// Küresel Durum Yönetimi
let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = { correct: 0, wrong: 0 };
let userSessionHistory = []; // Kullanıcının bu testteki tüm seçimlerini tutar

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
        loopAlert: document.getElementById('loop-alert'), // Bu artık test içinde gizli kalacak
        categoryResultTitle: document.getElementById('category-result-title'),
        correctCountText: document.getElementById('correct-count'),
        wrongCountText: document.getElementById('wrong-count'),
        restartBtn: document.getElementById('restart-btn'),
        exportWordBtn: document.getElementById('export-word-btn')
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

// Kategorileri Arayüze Çizme
function buildCategoryMenu() {
    const el = getElements();
    if (!el.categoriesGrid) return;
    
    el.categoriesGrid.innerHTML = "";
    if (el.categoryScreen) el.categoryScreen.style.display = 'block';
    
    Object.keys(categoriesConfig).forEach(key => {
        const wrongCount = globalWrongQuestionsPool[key].length;
        const badge = wrongCount > 0 ? `<span class="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">${wrongCount} Hatalı Soru Havuzda</span>` : '';
        
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = "p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 text-left transition-all duration-200 cursor-pointer flex justify-between items-center group w-full text-slate-800 font-semibold mb-2";
        btn.innerHTML = `
            <span class="flex items-center gap-2">
                <i class="fas fa-graduation-cap text-blue-600"></i>
                ${categoriesConfig[key]} ${badge}
            </span>
            <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-600 transition-colors"></i>
        `;
        
        btn.addEventListener('click', () => fetchQuestionsAndMix(key));
        el.categoriesGrid.appendChild(btn);
    });
}

// İNTERNETTEN YENİLERİ ÇEKİP ESKİ YANLIŞLARLA HARMANLAYAN MOTOR
async function fetchQuestionsAndMix(categoryKey) {
    const el = getElements();
    
    if (el.categoryScreen) el.categoryScreen.style.display = 'none';
    if (el.quizScreen) {
        el.quizScreen.style.display = 'block';
        el.quizTitle.textContent = categoriesConfig[categoryKey];
        el.questionText.innerHTML = `<div class="flex items-center justify-center gap-3 p-8 text-blue-600 font-medium"><i class="fas fa-spinner fa-spin text-2xl"></i> İnternetten taze sorular indiriliyor ve hatalı sorularınız harmanlanıyor...</div>`;
        el.optionsContainer.innerHTML = "";
    }

    currentCategory = categoryKey;
    currentQuestions = [];
    currentQuestionIndex = 0;
    score = { correct: 0, wrong: 0 };
    userSessionHistory = [];

    let newInternetQuestions = [];

    // 1. İnternetten Güncel Verileri Çekme Simülasyonu / API İsteği
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/mock-kpss-kktc?category=${categoryKey}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        newInternetQuestions = data.questions;
    } catch (e) {
        // Fallback: İnternet bağlantısı kesintisinde dinamik, detaylı açıklamaya sahip taze soru üretimi
        newInternetQuestions = getFreshInternetQuestions(categoryKey);
    }

    // 2. AKILLI HARMANLAMA: Bu kategoriye ait önceden yanlış yapılan soruları havuzdan alıyoruz
    const previousWrongs = [...globalWrongQuestionsPool[categoryKey]];
    
    // Aynı testte mükerrer soru olmaması için internetten gelenlerden, elimizdeki yanlışları eliyoruz
    const filteredInternet = newInternetQuestions.filter(nq => !previousWrongs.some(wq => wq.q === nq.q));

    // Yanlışlar + Yeniler birleştirilip karıştırılıyor
    currentQuestions = shuffle([...previousWrongs, ...filteredInternet]);

    // Eğer havuz çok boş kaldıysa yedek ekstra ekle
    if (currentQuestions.length === 0) {
        currentQuestions = getFreshInternetQuestions(categoryKey);
    }

    loadQuestion();
}

// Soru ve Şıkları Ekranda Listeleme (Sessiz Sınav Modu)
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
    
    // Şıkları orijinal sırasıyla sunuyoruz (Kullanıcının kafası karışmasın, seçim net olsun)
    currentQuestion.options.forEach((optionText, index) => {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = "w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer flex items-center font-medium text-gray-700 bg-white mb-2 shadow-sm option-choice-btn";
        btn.innerHTML = `<span class="inline-block bg-gray-100 text-gray-600 rounded-md px-2 py-1 mr-3 text-sm font-bold option-index-patch">${String.fromCharCode(65 + index)}</span> <span class="flex-1">${optionText}</span>`;
        
        btn.addEventListener('click', () => selectOptionSessiz(btn, index));
        if (el.optionsContainer) el.optionsContainer.appendChild(btn);
    });
}

// Sınav Esnasında Renk Değiştirmeden Seçim Yapma
function selectOptionSessiz(selectedBtn, selectedIndex) {
    const el = getElements();
    const buttons = el.optionsContainer.querySelectorAll('.option-choice-btn');
    
    // Seçim görselini nötr (mavi) olarak güncelle, anlık doğru/yanlış rengi verme!
    buttons.forEach(btn => {
        btn.classList.remove('border-blue-600', 'bg-blue-50', 'text-blue-900');
        btn.querySelector('.option-index-patch').classList.remove('bg-blue-600', 'text-white');
    });

    selectedBtn.classList.add('border-blue-600', 'bg-blue-50', 'text-blue-900');
    selectedBtn.querySelector('.option-index-patch').classList.add('bg-blue-600', 'text-white');

    // Geçici olarak bu adımdaki seçimi hafızaya al
    selectedBtn.setAttribute('data-selected-idx', selectedIndex);
    
    if (el.nextBtn) el.nextBtn.classList.remove('hidden');
}

// Sonraki Soruya Geçiş ve Veri İşleme
function processAndNext() {
    const el = getElements();
    const activeQuestion = currentQuestions[currentQuestionIndex];
    const selectedBtn = el.optionsContainer.querySelector('[data-selected-idx]');
    
    if (!selectedBtn) return; // Seçim yapılmadıysa ilerleme
    
    const selectedIndex = parseInt(selectedBtn.getAttribute('data-selected-idx'));
    const isCorrect = selectedIndex === activeQuestion.answer;

    if (isCorrect) {
        score.correct++;
        // Eğer bu soru daha önce yanlışlar havuzundaysa ve şimdi doğru yapıldıysa havuzdan temizle
        globalWrongQuestionsPool[currentCategory] = globalWrongQuestionsPool[currentCategory].filter(q => q.q !== activeQuestion.q);
    } else {
        score.wrong++;
        // Yanlış yapıldıysa ve havuzda henüz yoksa kalıcı gelecekteki test havuzuna ekle
        if (!globalWrongQuestionsPool[currentCategory].some(q => q.q === activeQuestion.q)) {
            globalWrongQuestionsPool[currentCategory].push(activeQuestion);
        }
    }

    // Geçmiş analiz raporuna ekle
    userSessionHistory.push({
        question: activeQuestion.q,
        options: activeQuestion.options,
        userAnswerIdx: selectedIndex,
        correctAnswerIdx: activeQuestion.answer,
        explanation: activeQuestion.explanation,
        isSuccess: isCorrect
    });

    currentQuestionIndex++;
    loadQuestion();
}

// TEST BİTTİKTEN SONRA DOĞRU/YANLIŞ VE NEDENLERİNİ GÖSTEREN EKRAN
function showResults() {
    const el = getElements();
    if (el.quizScreen) el.quizScreen.style.display = 'none';
    if (el.resultScreen) el.resultScreen.classList.remove('hidden');
    
    if (el.categoryResultTitle) el.categoryResultTitle.textContent = categoriesConfig[currentCategory];
    if (el.correctCountText) el.correctCountText.textContent = score.correct;
    if (el.wrongCountText) el.wrongCountText.textContent = score.wrong;

    // Sonuç ekranının altına detaylı "Neden Doğru / Neden Yanlış" rapor alanı enjekte ediliyor
    let reportContainer = document.getElementById('test-gerekce-raporu');
    if (!reportContainer) {
        reportContainer = document.createElement('div');
        reportContainer.id = 'test-gerekce-raporu';
        reportContainer.className = "mt-8 text-left space-y-6 border-t border-gray-200 pt-6";
        el.resultScreen.appendChild(reportContainer);
    }

    reportContainer.innerHTML = `<h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><i class="fas fa-paste text-blue-600"></i> Soru Çözüm Analizleri & Gerekçeleri</h3>`;

    userSessionHistory.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `p-5 rounded-xl border ${item.isSuccess ? 'border-emerald-200 bg-emerald-50/50' : 'border-rose-200 bg-rose-50/50'} shadow-sm`;
        
        let optionsHtml = '';
        item.options.forEach((opt, oIdx) => {
            let optStyle = "text-gray-700";
            if (oIdx === item.correctAnswerIdx) optStyle = "text-emerald-700 font-bold flex items-center gap-1.5";
            if (oIdx === item.userAnswerIdx && !item.isSuccess) optStyle = "text-rose-700 font-bold flex items-center gap-1.5";
            
            optionsHtml += `
                <div class="text-sm p-2 rounded bg-white/70 mb-1 ${optStyle}">
                    <b>${String.fromCharCode(65 + oIdx)})</b> ${opt}
                    ${oIdx === item.correctAnswerIdx ? '<i class="fas fa-check-circle text-emerald-600 text-xs"></i> (Doğru Cevap)' : ''}
                    ${oIdx === item.userAnswerIdx && !item.isSuccess ? '<i class="fas fa-times-circle text-rose-600 text-xs"></i> (Sizin Cevabınız)' : ''}
                </div>
            `;
        });

        card.innerHTML = `
            <div class="flex items-start gap-2 mb-2">
                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${item.isSuccess ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">${index + 1}</span>
                <p class="font-semibold text-gray-800 flex-1">${item.question}</p>
            </div>
            <div class="my-3 pl-8">${optionsHtml}</div>
            <div class="mt-3 pl-8 border-t border-gray-200/60 pt-3 text-sm text-slate-700 leading-relaxed">
                <strong class="text-blue-800 block mb-1"><i class="fas fa-info-circle"></i> Çözüm ve Gerekçeli Açıklama:</strong>
                ${item.explanation}
            </div>
        `;
        reportContainer.appendChild(card);
    });
}

// Dinamik / İnternet Kesintisi Fallback Soru Bankası (Detaylı Açıklamalar Mevcut)
function getFreshInternetQuestions(categoryKey) {
    const bank = {
        "oiy": [
            { 
                q: "Öğretmenin yeni konuyu anlatırken öğrencilerin bildiği kavramlardan hareket etmesi, ÖSYM pedagoji standartlarına göre hangi öğretim ilkesiyle açıklanır?", 
                options: ["Bilinenden Bilinmeyene", "Somuttan Soyuta", "Yakından Uzağa", "Açıklık", "Hayatilik"], 
                answer: 0,
                explanation: "Bilinenden bilinmeyene ilkesi, öğrencinin yeni bilgileri zihnindeki eski şemalarla entegre etmesini sağlar. Geçmiş öğrenmeler köprü görevi görür."
            },
            { 
                q: "Öğrencilerin gruplar halinde ortak bir amaç uğruna sorumluluk alarak öğrenmelerini destekleyen, KKTC KHK mülakatlarında da çağdaş yaklaşım olarak sorulan model hangisidir?", 
                options: ["Kubaşık (İş Birliğine Dayalı) Öğrenme", "Doğrudan Öğretim", "Bireysel Öğrenme Modeli", "Ezberci Yaklaşım", "Sunuş Stratejisi"], 
                answer: 0,
                explanation: "Kubaşık öğrenme, heterojen grupların ortak başarı ödülü için iş birliği içerisinde çalışmasını, paylaşımcılığı ve liderlik gelişimini temel alır."
            }
        ],
        "sy": [
            { 
                q: "Sınıfta ilk kez hafif düzeyde kuralları ihlal eden bir öğrenciye modern sınıf yönetimi ilkelerine göre yapılacak ilk müdahale ne olmalıdır?", 
                options: ["Göz teması kurmak veya yakınlaşmak (Sözsüz)", "Müdür muavinine rapor etmek", "Sınıftan dışarı çıkartmak", "Sertçe ismini bağırmak", "Sırasını değiştirmek"], 
                answer: 0,
                explanation: "Sınıf yönetiminde 'en az müdahale' ilkesi esastır. İstenmeyen ilk hafif davranışta odağı dağıtmadan sözsüz uyaranlar (bakış, fiziksel yakınlık) tercih edilir."
            }
        ],
        "otmt": [
            {
                q: "Dale'in Yaşantı Konisi dikkate alındığında öğrenmede en kalıcı ve somut sonuçlar veren aşama aşağıdakilerden hangisidir?",
                options: ["Doğrudan doğruya edinilen amaçlı yaşantılar", "Modellerle edinilen yaşantılar", "Televizyon izleme", "Görsel semboller", "Sözel semboller"],
                answer: 0,
                explanation: "Yaşantı konisinin tabanında yer alan 'Doğrudan edinilen yaşantılar' bireyin yaparak, yaşayarak, dokunarak öğrendiği en kalıcı evredir."
            }
        ],
        "op": [
            {
                q: "Pekiştireç kesildikten sonra organizmanın koşullu tepkiyi vermeyi yavaş yavaş bırakması durumu aşağıdakilerden hangisidir?",
                options: ["Sönme", "Geriye Ket Vurma", "Ayırt Etme", "Genelleme", "Alışma"],
                answer: 0,
                explanation: "Koşullanma gerçekleştikten sonra davranış pekiştirilmezse, davranışın gösterilme sıklığı azalır ve sonunda sönme gerçekleşir."
            }
        ],
        "gp": [
            {
                q: "Erikson'ın Psikososyal Gelişim Kuramına göre, 12-18 yaş arasındaki ergenlik döneminin temel gelişim krizi aşağıdakilerden hangisidir?",
                options: ["Kimlik Kazanmaya Karşı Rol Karmaşası", "Özerkliğe Karşı Kuşku", "Başarıya Karşı Aşağılık", "Üretkenliğe Karşı Durgunluk", "Temel Güvene Karşı Güvensizlik"],
                answer: 0,
                explanation: "Ergenlik döneminde birey 'Ben kimim?' sorusuna yanıt arar. Olumlu bir çevreyle kimlik edinimi sağlanamazsa rol karmaşası yaşanır."
            }
        ],
        "oe": [
            {
                q: "Özel gereksinimli öğrencilerin normal gelişim gösteren akranlarıyla aynı sınıfta, destek mekanizmalarıyla eğitim görmesi sürecine ne denir?",
                options: ["Kaynaştırma / Bütünleştirme", "İzole Eğitim", "Ayrıştırılmış Sınıf", "Özel Ev Okulu", "Klinik Eğitim"],
                answer: 0,
                explanation: "Kaynaştırma eğitimi, akran uyumunu ve toplum bütünleşmesini amaçlayan, en az kısıtlayıcı çevrede yürütülen çağdaş özel eğitim modelidir."
            }
        ]
    };
    return bank[categoryKey] || [];
}

// Olay Dinleyicileri
function setupGlobalEventListeners() {
    const el = getElements();

    if (el.nextBtn) {
        el.nextBtn.replaceWith(el.nextBtn.cloneNode(true));
    }
    
    const freshEl = getElements();
    if (freshEl.nextBtn) {
        freshEl.nextBtn.addEventListener('click', processAndNext);
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
}

function goToHomeScreen() {
    const el = getElements();
    if (el.quizScreen) el.quizScreen.style.display = 'none';
    if (el.resultScreen) el.resultScreen.classList.add('hidden');
    if (el.categoryScreen) el.categoryScreen.style.display = 'block';
    buildCategoryMenu();
}

// DOM Yüklenme Ayarları
document.addEventListener('DOMContentLoaded', () => {
    buildCategoryMenu();
    setupGlobalEventListeners();
});
window.addEventListener('load', () => {
    buildCategoryMenu();
});
