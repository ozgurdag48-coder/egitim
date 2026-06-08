// Belirttiğin Ana Konu Başlıklarının KPSS Tanımlamaları
const categoriesConfig = {
    "oiy": "Öğretim İlke ve Yöntemleri",
    "sy": "Sınıf Yönetimi",
    "otmt": "Öğretim Teknolojileri ve Materyal Tasarım",
    "op": "Öğrenme Psikolojisi",
    "gp": "Gelişim Psikolojisi",
    "oe": "Özel Eğitim"
};

// Kalıcı Yanlış Soru Havuzu (Sadece gerçekten yanlış yapılanları tutar)
let globalWrongQuestionsPool = {
    "oiy": [], "sy": [], "otmt": [], "op": [], "gp": [], "oe": []
};

// Küresel Durum Yönetimi
let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = { correct: 0, wrong: 0 };
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
        categoryResultTitle: document.getElementById('category-result-title'),
        correctCountText: document.getElementById('correct-count'),
        wrongCountText: document.getElementById('wrong-count'),
        restartBtn: document.getElementById('restart-btn')
    };
}

// Karıştırma Fonksiyonu
function shuffle(array) {
    let temp = [...array];
    for (let i = temp.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    return temp;
}

// Kategorileri Menüye Basma
function buildCategoryMenu() {
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

// YENİ VE TEMİZ TEST OLUŞTURMA MOTORU
async function startNewUniqueQuiz(categoryKey) {
    const el = getElements();
    
    if (el.categoryScreen) el.categoryScreen.style.display = 'none';
    if (el.quizScreen) {
        el.quizScreen.style.display = 'block';
        el.quizTitle.textContent = categoriesConfig[categoryKey];
        el.questionText.innerHTML = `<div class="flex items-center justify-center gap-3 p-8 text-blue-600 font-medium"><i class="fas fa-spinner fa-spin text-2xl"></i> KPSS Soru Havuzundan Benzersiz Test Derleniyor...</div>`;
        el.optionsContainer.innerHTML = "";
    }

    currentCategory = categoryKey;
    currentQuestions = [];
    currentQuestionIndex = 0;
    score = { correct: 0, wrong: 0 };
    userSessionHistory = [];

    // 1. Orijinal KPSS Soru Bankasından ilgili kategoriye ait taze soruları çek
    let freshPool = getKpssQuestionBank(categoryKey);
    
    // 2. Önceki testlerden kalan aktif yanlışları getir
    let previousWrongs = [...globalWrongQuestionsPool[categoryKey]];

    // TEMİZLİK GÜVENCESİ: Eğer taze havuzda yanlışlardan biri varsa mükerrer olmasın diye taze havuzdan eliyoruz
    let filteredFresh = freshPool.filter(fq => !previousWrongs.some(wq => wq.id === fq.id));

    // 3. Yanlışlar ile yenileri harmanla ve tamamen rastgele karıştır
    let mixedSet = shuffle([...previousWrongs, ...filteredFresh]);

    // Her testte çözülebilir dengeli bir sayı (Örn: 4 veya 5 soru) sınırla
    currentQuestions = mixedSet.slice(0, 5);

    loadQuestion();
}

// Soru ve Şıkları Listeleme
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
    
    // Şıkların yerini sınav başında karıştırıyoruz
    let originalOptions = currentQuestion.options.map((opt, idx) => ({
        text: opt,
        isCorrect: idx === currentQuestion.answer
    }));
    
    let shuffledOptions = shuffle(originalOptions);
    // Yeni doğru şık indeksini bulup soru nesnesine dinamik işleyelim (Doğruluk kontrolü sapmasın)
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

// Soru Geçişi ve Doğru/Yanlış Havuz Yönetimi (Hatalı Kod Arındırma Noktası)
function processAndNext() {
    const el = getElements();
    const activeQuestion = currentQuestions[currentQuestionIndex];
    const selectedBtn = el.optionsContainer.querySelector('[data-selected-idx]');
    
    if (!selectedBtn) return;
    
    const selectedIndex = parseInt(selectedBtn.getAttribute('data-selected-idx'));
    const isCorrect = selectedIndex === activeQuestion.dynamicCorrectIdx;

    if (isCorrect) {
        score.correct++;
        // DOĞRU BİLİNDİYSE: global havuzdan ID eşleşmesiyle TAMAMEN TEMİZLE (Eski kod hatası buradaydı)
        globalWrongQuestionsPool[currentCategory] = globalWrongQuestionsPool[currentCategory].filter(q => q.id !== activeQuestion.id);
    } else {
        score.wrong++;
        // YANLIŞ BİLİNDİYSE: Havuzda mükerrer kayıt oluşmasını engelle, yoksa ekle
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

// Test Bittikten Sonra Analiz ve Çözüm Gerekçesi Ekranı
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

// BAŞLIKLARA GÖRE ÖZGÜN KPSS SORU BANKASI HAVUZU
function getKpssQuestionBank(categoryKey) {
    const bank = {
        "oiy": [
            { id: "oiy_1", q: "Bir öğretmen, bölme işlemini anlatırken öğrencilerin daha önceki sınıflarda öğrenmiş olduğu çarpma işlemi bilgilerinden yararlanmaktadır. Öğretmenin bu uygulaması hangi öğretim ilkesiyle doğrudan ilişkilidir?", options: ["Bilinenden bilinmeyene", "Somuttan soyuta", "Yakından uzağa", "Açıklık", "Ekonomiklik"], answer: 0, explanation: "Yeni öğrenilecek bir konunun, öğrencinin hazırbulunuşluk düzeyinde var olan eski bilgilerle ilişkilendirilerek anlatılması 'Bilinenden Bilinmeyene' ilkesinin temel kuralıdır." },
            { id: "oiy_2", q: "Öğrencilerin gerçek yaşam problemlerine çözümler ürettiği, disiplinler arası bağ kurduğu ve somut bir ürün ortaya koyduğu çağdaş öğretim yöntemi hangisidir?", options: ["Proje Tabanlı Öğrenme", "Sunuş Yoluyla Öğretim", "Örnek Olay Yöntemi", "Beyin Fırtınası", "Anlatım Yöntemi"], answer: 0, explanation: "Proje tabanlı öğrenmede temel amaç; gerçek yaşam senaryoları üzerinde çalışarak disiplinler arası bir yaklaşımla özgün, somut bir ürün veya performans üretmektir." },
            { id: "oiy_3", q: "Kavram haritaları, anlam çözümleme tabloları ve örgütleyiciler aşağıdaki öğretim stratejilerinden en çok hangisinde etkilidir?", options: ["Sunuş Yoluyla Öğretim", "Buluş Yoluyla Öğretim", "Araştırma-İnceleme", "Tam Öğrenme", "Kubaşık Öğrenme"], answer: 0, explanation: "Ausubel'in sunuş yoluyla öğretim stratejisinde bilgilerin organize edilmesi, zihinsel şemaların yapılandırılması için ön organize ediciler ve kavram haritaları birincil araçlardır." }
        ],
        "sy": [
            { id: "sy_1", q: "Sınıf kuralları belirlenirken dikkat edilmesi gereken en temel pedagojik kural aşağıdakilerden hangisidir?", options: ["Kuralları öğrencilerle birlikte belirlemek", "Kuralları okul idaresine onaylatmak", "Emir kipi içeren olumsuz ifadeler kullanmak", "Kuralları olabildiğince uzun ve detaylı yazmak", "Cezaları kuralların yanına açıkça eklemek"], answer: 0, explanation: "Sınıf kurallarına uyulma düzeyini artıran en önemli faktör, kuralların demokratik bir yaklaşımla öğretmen ve öğrencilerin ortak katılımıyla belirlenmesidir." },
            { id: "sy_2", q: "Ders esnasında iki öğrencinin kendi arasında fısıldaşarak konuştuğunu fark eden bir öğretmenin sınıf yönetimi modellerine göre atması gereken 'en az müdahale' içeren ilk adım ne olmalıdır?", options: ["Öğrencilerle göz teması kurmak veya yanlarına yaklaşmak", "Öğrencileri sınıftan dışarı çıkarmak", "İsimlerini yüksek sesle bağırarak uyarmak", "Hemen disiplin formu doldurmak", "Durumu görmezden gelerek konuyu anlatmaya devam etmek"], answer: 0, explanation: "Sınıfta istenmeyen davranışlara müdahale edilirken 'en az müdahale' ilkesi uygulanır. Dersin akışını bozmadan sözsüz (göz teması, fiziksel yakınlık) uyaranlar ilk sırada yer almalıdır." }
        ],
        "otmt": [
            { id: "otmt_1", q: "Edgar Dale'in Yaşantı Konisi temel alındığında, bir öğrenme sürecinde kalıcılığı ve somutluğu en yüksek olan öğrenme yaşantısı aşağıdakilerden hangisidir?", options: ["Doğrudan doğruya edinilen amaçlı yaşantılar", "Model ve maketlerle edinilen yaşantılar", "Televizyon ve hareketli resimler", "Görsel semboller ve grafikler", "Sözel semboller ve kelimeler"], answer: 0, explanation: "Dale'in Yaşantı Konisi'nin en tabanında 'Doğrudan edinilen yaşantılar' bulunur. Öğrenci sürece tüm duyu organlarıyla aktif katıldığı için öğrenme en kalıcı hale gelir." }
        ],
        "op": [
            { id: "op_1", q: "Klasik koşullanma sürecinde, organizmaya koşullu uyarıcı verildikten sonra uzun süre pekiştireç (koşulsuz uyarıcı) verilmezse hangi durumun ortaya çıkması beklenir?", options: ["Sönme", "Genelleme", "Ayırt etme", "Gölgeleme", "Kendiliğinden geri gelme"], answer: 0, explanation: "Koşullu tepki oluştuktan sonra, ortamdan ödül/pekiştireç uzun süre çekilirse, kazanılan o yapay davranış azalarak tamamen kaybolur. Buna 'Sönme' denir." }
        ],
        "gp": [
            { id: "gp_1", q: "Piaget'nin bilişsel gelişim kuramına göre, bir çocuğun nesneleri sadece dış görünüşlerine göre değil, hacim ve ağırlık gibi boyutlarının değişmediğini kavrayabilmesi hangi dönemin kazancıdır?", options: ["Somut İşlemler Dönemi", "İşlem Öncesi Dönem", "Duyusal Motor Dönemi", "Soyut İşlemler Dönemi", "Sezgisel Dönem"], answer: 0, explanation: "Maddelerin şekli değişse de özünün/miktarının değişmediğini algılama becerisi olan 'Korunum Kavramı', Somut İşlemler döneminde (7-11 yaş) kazanılır." }
        ],
        "oe": [
            { id: "oe_1", q: "Özel eğitim ihtiyacı olan öğrencilerin, akranlarından ayrıştırılmadan destek eğitim hizmetleri de sunularak normal sınıflarda eğitim görmelerini amaçlayan çağdaş model hangisidir?", options: ["Kaynaştırma / Bütünleştirme Eğitimi", "Özel Alt Sınıf Modeli", "Yatılı Özel Eğitim Okulu", "Evde Eğitim Hizmeti", "Ayrıştırılmış Eğitim Kampüsü"], answer: 0, explanation: "Kaynaştırma eğitimi, özel gereksinimli bireyin 'en az kısıtlayıcı eğitim ortamında' yani normal akranlarıyla bir arada, gerekli destek sağlanarak eğitilmesini esas alır." }
        ]
    };
    return bank[categoryKey] || [];
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
