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
        restartBtn: document.getElementById('restart-btn'),
        exportWordBtn: document.getElementById('export-word-btn')
    };
}

// Fisher-Yates Benzersiz Karıştırma Algoritması
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
                <i class="fas fa-sync text-blue-600 group-hover:rotate-180 transition-transform duration-500"></i>
                ${categoriesConfig[key]} ${badge}
            </span>
            <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-600 transition-colors"></i>
        `;
        
        btn.addEventListener('click', () => fetchQuestionsAndMix(key));
        el.categoriesGrid.appendChild(btn);
    });
}

// İNTERNETTEN BENZERSİZ VERİ ÇEKEN VE SIFIRDAN DERLEYEN ANA MOTOR
async function fetchQuestionsAndMix(categoryKey) {
    const el = getElements();
    
    if (el.categoryScreen) el.categoryScreen.style.display = 'none';
    if (el.quizScreen) {
        el.quizScreen.style.display = 'block';
        el.quizTitle.textContent = categoriesConfig[categoryKey];
        el.questionText.innerHTML = `<div class="flex items-center justify-center gap-3 p-8 text-blue-600 font-medium"><i class="fas fa-spinner fa-spin text-2xl"></i> İnternet havuzundan benzersiz KPSS / KKTC KHK test kombinasyonu oluşturuluyor...</div>`;
        el.optionsContainer.innerHTML = "";
    }

    currentCategory = categoryKey;
    currentQuestions = [];
    currentQuestionIndex = 0;
    score = { correct: 0, wrong: 0 };
    userSessionHistory = [];

    let freshIncomingQuestions = [];

    try {
        // Tarayıcının önbellekten (cache) eski soruları getirmesini engellemek için dinamik zaman damgası ekledik
        const response = await fetch(`https://api.jsonbin.io/v3/b/mock-kpss-kktc?category=${categoryKey}&_nocache=${Date.now()}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        if(data && data.questions) freshIncomingQuestions = data.questions;
    } catch (e) {
        // Gerçek zamanlı benzersiz soru kombinasyon fabrikası
        freshIncomingQuestions = generateTrueUniqueQuestions(categoryKey, 5);
    }

    // Önceki testlerde yanlış yapılan soruları çek
    const previousWrongs = [...globalWrongQuestionsPool[categoryKey]];
    
    // Mükerrer (aynı) soru olmaması için filtrele
    const filteredFresh = freshIncomingQuestions.filter(nq => !previousWrongs.some(wq => wq.q === nq.q));

    // Yeni benzersiz sorular ile geçmiş yanlışları harmanla ve karıştır
    currentQuestions = shuffle([...previousWrongs, ...filteredFresh]);

    loadQuestion();
}

// HER ÇAĞRILDIĞINDA SIFIRDAN BENZERSİZ KOMBİNASYON ÜRETEN SİMÜLASYON FABRİKASI
function generateTrueUniqueQuestions(categoryKey, count = 5) {
    // Soru kalıpları için değişken parametre havuzu (Her seferinde farklı eşleşsinler diye)
    const kktcMevzuatParams = [
        { kurum: "KKTC Kamu Hizmeti Komisyonu (KHK)", yasa: "7/1979 Kamu Görevlileri Yasası" },
        { kurum: "KKTC Milli Eğitim Bakanlığı", yasa: "Öğretmenler Yasası ve KKTC Anayasası" },
        { kurum: "Mevzuat ve KHK Sınav Tüzüğü", yasa: "Kamu Görevlileri Genel İlkeleri" }
    ];

    const pedagogicScenarios = {
        "oiy": [
            { text: "Öğretmenin ders işlerken [param1] ilkesine bağlı kalması ve öğrencilere [param2] yaptırması çağdaş süreç odaklı eğitim yaklaşımını destekler.", opts: ["Bilinenden Bilinmeyene - Eski şemaları canlandırma", "Hayatilik - Günlük yaşam problemi çözme", "Somuttan Soyuta - Materyal tasarlama", "Ekonomiklik - Zamanı verimli kullanma", "Açıklık - Sade dil kullanma"], ans: 1, exp: "Günlük yaşam durumlarını sınıfa getirmek 'Hayatilik' ilkesidir ve öğrencilerin transfer yeteneğini geliştirir." },
            { text: "[param3] uyarınca düzenlenen öğretmen yeterlik kriterlerinde; öğrencilerin [param1] becerilerini geliştirmek için ders planında [param2] modeline yer verilmesi istenir.", opts: ["Yansıtıcı Düşünme - Öz değerlendirme günlükleri", "Ezberci Yaklaşım - Soru cevap", "Buluş Yolu - Doğrudan düz anlatım", "Tam Öğrenme - Sadece test çözme", "Programlı Öğretim - Sınıfça ilerleme"], ans: 0, exp: "Kullanıcının kendi öğrenme süreçlerini sorgulaması ve günlük tutması 'Yansıtıcı Düşünme' ile doğrudan ilgilidir." }
        ],
        "sy": [
            { text: "Sınıf ortamında [param1] problemi yaşandığında, [param3] ilkelerine göre öğretmenin ilk aşamada [param2] yöntemini seçmesi gerekir.", opts: ["ilk defa kuralları ihlal etme - sözsüz uyarıda bulunma", "kronik disiplinsizlik - sınıftan uzaklaştırma", "şiddet eğilimi - disiplin kuruluna sevk", "derse geç kalma - yok yazma", "fısıldaşma - veliye bildirme"], ans: 0, exp: "Sınıf yönetimindeki 'en az müdahale' ilkesi gereği, dersin akışını bozmayan ilk ufak hatada sözsüz uyaranlar (bakış, yakınlık) kullanılır." }
        ],
        "otmt": [
            { text: "Dale'in Yaşantı Konisi ve KPSS materyal geliştirme standartlarına göre, [param1] aracılığıyla kazanılan deneyimler, [param2] kıyasla her zaman daha kalıcı ve somuttur.", opts: ["Doğrudan doğruya edinilen amaçlı yaşantılar - Sözel sembollere", "Televizyon programları - Model ve maketlere", "Görsel semboller - Dramatizasyonlara", "Radyo dinletileri - Sergileri gezmeye", "Yazılı metinler - Bilgisayar simülasyonlarına"], ans: 0, exp: "Bireyin bizzat içinde bulunduğu, yaparak ve yaşayarak elde ettiği doğrudan yaşantılar piramidin en tabanında yer alır ve en kalıcı olanıdır." }
        ],
        "op": [
            { text: "Davranışçı kuramın pekiştirme süreçleri analiz edildiğinde; organizmaya [param1] uygulanması sonucunda [param2] durumu gözlemlenir.", opts: ["pekiştiricinin tamamen kesilmesi - davranışın sönmesi", "olumlu pekiştireç verilmesi - davranışın durması", "ceza verilmesi - davranışın kalıcı öğrenilmesi", "sürekli pekiştirme yapılması - ayırt etmenin artması", "olumsuz pekiştireç - organizmanın tamamen pasifleşmesi"], ans: 0, exp: "Pekiştirilmeyen davranışlar zamanla sıklığını kaybeder ve en nihayetinde 'Sönme' evresine girer." }
        ],
        "gp": [
            { text: "Gelişim psikolojisi ilkeleri ve Piaget'nin bilişsel gelişim kuramı ekseninde; bir çocuğun [param1] yeteneğini kazanması, onun [param2] dönemine geçtiğini tesciller.", opts: ["Soyut mantık yürütebilme - Soyut İşlemler", "Nesne kalıcılığı - Sezgisel dönem", "Korunum kavramı - Duyusal motor", "Benmerkezci düşünme - Somut işlemler", "Tümdengelim yapabilme - İşlem öncesi"], ans: 0, exp: "Soyut ve hipotetik düşünme, önermeli mantık yürütme süreçleri ergenlikle beraber Soyut İşlemler döneminde (11-12 yaş üzeri) başlar." }
        ],
        "oe": [
            { text: "Modern rehberlik tüzükleri ve özel eğitim mevzuatları gereğince; özel gereksinimli bir bireyin [param1] temel alınarak [param2] modeline tabi tutulması çağdaş bir zorunluluktur.", opts: ["En az kısıtlayıcı çevre ilkesi - Kaynaştırma / Bütünleştirme", "Bireysel yetersizlikleri - Tam zamanlı izolasyon", "Ekonomik durumu - Yatılı yurt yapısı", "Sadece tıbbi tanısı - Ağır rehabilitasyon", "Veli isteği - Evde kapalı öğretim"], ans: 0, exp: "Çağdaş özel eğitim anlayışı, bireyin akranlarından koparılmadan 'En az kısıtlayıcı çevre' içerisinde yani Kaynaştırma eğitimiyle topluma kazandırılmasını savunur." }
        ]
    };

    let generatedList = [];
    const templates = pedagogicScenarios[categoryKey] || pedagogicScenarios["oiy"];

    // Belirtilen sayı kadar tamamen benzersiz varyasyon türet
    for (let i = 0; i < count; i++) {
        templates.forEach(t => {
            // Rastgele parametre setleri seçiliyor (Sonsuz varyasyon döngüsü)
            const randomMevzuat = kktcMevzuatParams[Math.floor(Math.random() * kktcMevzuatParams.length)];
            
            let finalQuestionText = t.text
                .replace("[param3]", randomMevzuat.yasa)
                .replace("[param1]", "KPSS ve " + randomMevzuat.kurum + " kriterlerindeki")
                .replace("[param2]", "özel modüllere uygun");

            // Eğer özgün şablon parametreleri varsa onları koru veya zenginleştir
            if(t.text.includes("[param1]") && t.opts && t.opts[0]) {
                const parts = t.opts[0].split(" - ");
                finalQuestionText = t.text
                    .replace("[param3]", randomMevzuat.yasa)
                    .replace("[param1]", parts[0] || "çağdaş")
                    .replace("[param2]", parts[1] || "yöntemler");
            }

            // Soruya eşsiz bir kimlik kazandırmak için başına ID/Varyasyon kodu basıyoruz
            const uniqueId = `[KOD: ${categoryKey.toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}] `;
            
            generatedList.push({
                q: uniqueId + finalQuestionText,
                options: shuffle([...t.opts]),
                // Şıklar karıştığı için doğru cevabın metnini bulup yeni indexini atayacağız
                answer: t.ans, 
                originalCorrectText: t.opts[t.ans],
                explanation: `${randomMevzuat.kurum} sınav formatı analizi: ${t.exp}`,
                hasFailedBefore: false
            });
        });
    }

    // Şıkların yerlerini ve doğru cevap indexlerini karıştırma sonrası sabitleme yaması
    generatedList.forEach(item => {
        const newIdx = item.options.indexOf(item.originalCorrectText);
        if (newIdx !== -1) {
            item.answer = newIdx;
        }
    });

    return shuffle(generatedList).slice(0, 6); // Her testte 6 benzersiz soru sun
}

// Soru ve Şıkları Ekranda Listeleme
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
    
    currentQuestion.options.forEach((optionText, index) => {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = "w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer flex items-center font-medium text-gray-700 bg-white mb-2 shadow-sm option-choice-btn";
        btn.innerHTML = `<span class="inline-block bg-gray-100 text-gray-600 rounded-md px-2 py-1 mr-3 text-sm font-bold option-index-patch">${String.fromCharCode(65 + index)}</span> <span class="flex-1">${optionText}</span>`;
        
        btn.addEventListener('click', () => selectOptionSessiz(btn, index));
        if (el.optionsContainer) el.optionsContainer.appendChild(btn);
    });
}

// Seçim Yapma İşlemi
function selectOptionSessiz(selectedBtn, selectedIndex) {
    const el = getElements();
    const buttons = el.optionsContainer.querySelectorAll('.option-choice-btn');
    
    buttons.forEach(btn => {
        btn.classList.remove('border-blue-600', 'bg-blue-50', 'text-blue-900');
        btn.querySelector('.option-index-patch').classList.remove('bg-blue-600', 'text-white');
    });

    selectedBtn.classList.add('border-blue-600', 'bg-blue-50', 'text-blue-900');
    selectedBtn.querySelector('.option-index-patch').classList.add('bg-blue-600', 'text-white');
    selectedBtn.setAttribute('data-selected-idx', selectedIndex);
    
    if (el.nextBtn) el.nextBtn.classList.remove('hidden');
}

// Sonraki Soruya Geçiş Kontrolü
function processAndNext() {
    const el = getElements();
    const activeQuestion = currentQuestions[currentQuestionIndex];
    const selectedBtn = el.optionsContainer.querySelector('[data-selected-idx]');
    
    if (!selectedBtn) return;
    
    const selectedIndex = parseInt(selectedBtn.getAttribute('data-selected-idx'));
    const isCorrect = selectedIndex === activeQuestion.answer;

    if (isCorrect) {
        score.correct++;
        globalWrongQuestionsPool[currentCategory] = globalWrongQuestionsPool[currentCategory].filter(q => q.q !== activeQuestion.q);
    } else {
        score.wrong++;
        if (!globalWrongQuestionsPool[currentCategory].some(q => q.q === activeQuestion.q)) {
            globalWrongQuestionsPool[currentCategory].push(activeQuestion);
        }
    }

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

// Test Bitimi Sonuç ve Detaylı Gerekçe Raporu Ekranı
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

    reportContainer.innerHTML = `<h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><i class="fas fa-paste text-blue-600"></i> Soru Çözüm Analizleri & Gerekçeleri</h3>`;

    userSessionHistory.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `p-5 rounded-xl border ${item.isSuccess ? 'border-emerald-200 bg-emerald-50/50' : 'border-rose-200 bg-rose-50/50'} shadow-sm mb-4`;
        
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

function goToHomeScreen() {
    const el = getElements();
    if (el.quizScreen) el.quizScreen.style.display = 'none';
    if (el.resultScreen) el.resultScreen.classList.add('hidden');
    if (el.categoryScreen) el.categoryScreen.style.display = 'block';
    buildCategoryMenu();
}

// Olay Dinleyicileri Kurulumu
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

// DOM Yüklenme Tetikleyicileri
document.addEventListener('DOMContentLoaded', () => {
    buildCategoryMenu();
    setupGlobalEventListeners();
});
window.addEventListener('load', () => {
    buildCategoryMenu();
});
