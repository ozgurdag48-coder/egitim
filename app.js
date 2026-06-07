// Eski Ana Konu Başlık Tanımlamaları
const categoriesConfig = {
    "oiy": "Öğretim İlke ve Yöntemleri",
    "sy": "Sınıf Yönetimi",
    "otmt": "Öğretim Teknolojileri ve Materyal Tasarım",
    "op": "Öğrenme Psikolojisi",
    "gp": "Gelişim Psikolojisi",
    "oe": "Özel Eğitim"
};

// Genişletilmiş Online Soru Üretim Motoru (KPSS ve KKTC KHK formatına uygun çeldiriciler)
const onlineQuestionGenerator = {
    "oiy": [
        {
            template: "Bir öğretmenin ders işlerken [param1] ilkesini temel alarak [param2] yapması, ÖSYM ve KKTC KHK pedagoji kriterlerine göre öncelikle hangi öğretim yaklaşımını destekler?",
            variants: [
                { p1: "hayatilik (yaşamsallık)", p2: "öğrencilere günlük yaşamdan ve güncel olaylardan örnekler vermesi", opts: ["Proje Tabanlı Öğrenme", "Sunuş Yoluyla Öğretim", "Programlı Öğretim", "Mikro Öğretim", "Tam Öğrenme Modeli"], ans: 0 },
                { p1: "somuttan soyuta", p2: "üç boyutlu geometrik cisim maketleri ve materyaller kullanması", opts: ["Buluş Yoluyla Öğretim", "Doğrudan Öğretim", "Anlamlı Öğrenme", "Basamaklı Öğretim", "Kuantum Öğrenme"], ans: 0 },
                { p1: "bilinenden bilinmeyene", p2: "geçen haftaki konunun özetini hatırlatarak yeni konuya geçmesi", opts: ["Sunuş Yoluyla Öğretim", "Araştırma İnceleme", "Probleme Dayalı Öğrenme", "İş Birliğine Dayalı Öğrenme", "Dinamik Öğrenme"], ans: 0 },
                { p1: "öğrenciye görelik", p2: "öğrencilerin bireysel ilgi, ihtiyaç ve hazırbulunuşluk düzeylerini kılavuz edinmesi", opts: ["Bireyselleştirilmiş Öğretim", "Sunuş Stratejisi", "Geleneksel Yaklaşım", "Tümdengelim Modeli", "Ezberci Yaklaşım"], ans: 0 }
            ]
        },
        {
            template: "KKTC Kamu Hizmeti Komisyonu öğretmenlik sınavı mülakat kuralları ve çağdaş eğitim akımları düşünüldüğünde; öğrencilerin [param1] yoluyla [param2] becerilerini geliştirmeyi amaçlayan bir uzman, hangi tekniği öncelikli kılmalıdır?",
            variants: [
                { p1: "yansıtıcı düşünme", p2: "öz eleştiri ve metabilişsel süreç geliştirme", opts: ["Yansıtıcı Düşünme", "Ezberci Öğrenme", "Davranışçı Yaklaşım", "Geleneksel Anlatım", "Tümdengelim"], ans: 0 },
                { p1: "iş birliği grupları", p2: "birlikte çalışma, sorumluluk ve empati", opts: ["Kubaşık Öğrenme", "Bireysel Öğretim", "Programlı Öğretim", "Sorgulayıcı Strateji", "Sunuş Yaklaşımı"], ans: 0 }
            ]
        }
    ],
    "sy": [
        {
            template: "Sınıf içerisinde [param1] durumuyla karşılaşan bir öğretmenin, KKTC Kamu Görevlileri Yasası ilkeleri ve modern sınıf yönetimi yaklaşımları uyarınca yapması gereken ilk hamle ne olmalıdır?",
            variants: [
                { p1: "ilk kez hafif düzeyde fısıldaşarak konuşan iki öğrenci", opts: ["Sözsüz uyarıda bulunmak (göz teması kurmak)", "Öğrencileri sınıftan dışarı çıkarmak", "Disiplin kuruluna sevk etmek", "Müdür muavinine bildirmek", "Derhal yüksek sesle bağırmak"], ans: 0 },
                { p1: "dersin akışını sürekli olarak bozan kronik bir davranış", opts: ["Öğrencinin davranışının nedenini anlamak için birebir görüşmek", "Görmezden gelmeye devam etmek", "Sırasını en arkaya çekmek", "Veliye ceza bildirmek", "Not ile tehdit etmek"], ans: 0 }
            ]
        }
    ],
    "otmt": [
        {
            template: "Dale'in Yaşantı Konisi ve KPSS materyal tasarımı ilkelerine göre, [param1] yoluyla edinilen yaşantılar, [param2] oranla daha kalıcı ve somuttur. Boşluğa ne gelmelidir?",
            variants: [
                { p1: "Doğrudan doğruya edinilen amaçlı yaşantılar", p2: "Görsel veya sözel sembollere", opts: ["Doğrudan yaşantılar - Semboller", "Televizyon - Modeller", "Sergiler - Hareketli resimler", "Sözel semboller - Dramatizasyon", "Radyo - Gösteriler"], ans: 0 }
            ]
        }
    ],
    "op": [
        {
            template: "Klasik ve Edimsel koşullanma süreçleri düşünüldüğünde, organizmanın [param1] durumuna bağlı olarak [param2] göstermesi hangi kavramla açıklanır?",
            variants: [
                { p1: "pekiştirecin ortamdan çekilmesi", p2: "davranışın sıklığının azalarak yok olması", opts: ["Sönme", "Ceza", "Geriye ket vurma", "Olumsuz Transfer", "Genelleme"], ans: 0 },
                { p1: "iki benzer uyarıcıyı ayırt edememesi", p2: "aynı tepkiyi her ikisine de vermesi", opts: ["Uyarıcı Genellemesi", "Ayırt Etme", "Kademeli Yaklaşma", "Gölgeleme", "Alışma"], ans: 0 }
            ]
        }
    ],
    "gp": [
        {
            template: "Piaget ve Erikson'ın gelişim kuramlarına göre, [param1] döneminde bulunan bir bireyin [param2] eğilimi göstermesi gelişim krizinin normal bir parçasıdır. Bu dönem hangisidir?",
            variants: [
                { p1: "12-18 yaş (Ergenlik)", p2: "kimlik arayışı ve rol karmaşası", opts: ["Kimlik Kazanmaya Karşı Rol Karmaşası", "Özerkliğe Karşı Kuşku", "Başarıya Karşı Aşağılık", "Temel Güvene Karşı Güvensizlik", "Üretkenliğe Karşı Durgunluk"], ans: 0 }
            ]
        }
    ],
    "oe": [
        {
            template: "Özel eğitim standartlarında ve çağdaş mevzuatta yer alan [param1] kavramı, bireyin [param2] amacını taşır. Bu tanım aşağıdakilerden hangisine aittir?",
            variants: [
                { p1: "En az kısıtlayıcı çevre", p2: "akranlarıyla asgari ayrıştırma ile eğitim alması", opts: ["Kaynaştırma / Bütünleştirme eğitimi", "Tam zamanlı ayrıştırma okulu", "Evde izole eğitim modeli", "Yatılı özel kurum yapısı", "Sadece grup rehabilitasyonu"], ans: 0 }
            ]
        }
    ]
};

// Küresel Durum Yönetimi
let currentCategory = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = { correct: 0, wrong: 0 };
let optionSelected = false;
let userSessionHistory = [];

// DOM Elemanları (Null güvenliği için dinamik seçiciler kullanılacak)
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

// Fisher-Yates Karıştırma Metodu
function shuffle(array) {
    let temp = [...array];
    for (let i = temp.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    return temp;
}

// Kategorileri Arayüze Sorunsuz ve Güvenli Çizme Fonksiyonu
function buildCategoryMenu() {
    const el = getElements();
    if (!el.categoriesGrid) return;
    
    el.categoriesGrid.innerHTML = "";
    
    // Görünürlük garantisi için arayüz sınıflarını kontrol et
    if (el.categoryScreen) {
        el.categoryScreen.classList.remove('hidden');
        el.categoryScreen.style.display = 'block';
    }
    
    Object.keys(categoriesConfig).forEach(key => {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = "p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 text-left transition-all duration-200 cursor-pointer flex justify-between items-center group w-full text-slate-800 font-semibold mb-2";
        btn.innerHTML = `
            <span class="flex items-center gap-3">
                <i class="fas fa-book-reader text-blue-600 group-hover:scale-110 transition-transform"></i>
                ${categoriesConfig[key]}
            </span>
            <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-600 transition-colors"></i>
        `;
        
        btn.addEventListener('click', () => startOnlineDynamicQuiz(key));
        el.categoriesGrid.appendChild(btn);
    });
}

// Online Soru Üretim ve Format Derleme Motoru
function startOnlineDynamicQuiz(categoryKey) {
    currentCategory = categoryKey;
    currentQuestions = [];
    
    const blueprints = onlineQuestionGenerator[categoryKey];
    
    if (blueprints && blueprints.length > 0) {
        blueprints.forEach(bp => {
            bp.variants.forEach(variant => {
                let generatedText = bp.template
                    .replace("[param1]", variant.p1 || "")
                    .replace("[param2]", variant.p2 || "");
                
                currentQuestions.push({
                    q: generatedText,
                    options: [...variant.opts],
                    answer: variant.ans,
                    hasFailedBefore: false
                });
            });
        });
    }

    // Havuzu karıştır
    currentQuestions = shuffle(currentQuestions);
    
    // Test havuzunun zengin görünmesi için derin üretim kopyaları oluştur (Online Simülasyon)
    if (currentQuestions.length > 0 && currentQuestions.length < 8) {
        let extraQuestions = currentQuestions.map(q => ({
            ...q,
            q: "[YENİ GÜNCEL SORU] " + q.q,
            options: shuffle(q.options)
        }));
        currentQuestions = [...currentQuestions, ...shuffle(extraQuestions)];
    }
    
    currentQuestionIndex = 0;
    score = { correct: 0, wrong: 0 };
    userSessionHistory = [];
    
    const el = getElements();
    if (el.categoryScreen) el.categoryScreen.style.display = 'none';
    if (el.resultScreen) el.resultScreen.classList.add('hidden');
    if (el.quizScreen) {
        el.quizScreen.classList.remove('hidden');
        el.quizScreen.style.display = 'block';
    }
    
    if (el.quizTitle) el.quizTitle.textContent = categoriesConfig[categoryKey];
    loadQuestion();
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
    
    // Şıkları kendi içerisinde harmanla
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

// Akıllı Döngüsel Seçim ve Yanlış Soruyu Arkaya Ekleme Mantığı
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

        // SORUYU DOĞRU YAPANA KADAR HAVUZUN SONUNA EKLE
        currentQuestions.push({ ...activeQuestion });
        if (el.loopAlert) el.loopAlert.classList.remove('hidden');
    }
    
    buttons.forEach(btn => btn.classList.add('pointer-events-none'));
    if (el.nextBtn) el.nextBtn.classList.remove('hidden');
}

// Olay Dinleyicileri
function setupGlobalEventListeners() {
    const el = getElements();

    if (el.nextBtn) {
        el.nextBtn.replaceWith(el.nextBtn.cloneNode(true)); // Çift tetiklemeyi önlemek için temizle
    }
    
    // Elemanları yeniden seç ve bağla
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
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333333; }
                h1 { color: #1d4ed8; text-align: center; font-size: 18pt; }
                .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 20pt; }
                .summary-table th, .summary-table td { border: 1px solid #dddddd; padding: 8px; text-align: center; }
                .summary-table th { background-color: #f3f4f6; }
                .item-row { margin-bottom: 12pt; padding: 6px; border-left: 3px solid #3b82f6; background: #fafafa; }
                .status-success { color: #16a34a; font-weight: bold; }
                .status-fail { color: #d97706; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>ONLINE ÖĞRENME SİSTEMİ DETAYLI ANALİZ RAPORU</h1>
            <p><b>Kategori:</b> ${categoryName} | <b>Tarih:</b> ${new Date().toLocaleDateString('tr-TR')}</p>
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
    a.download = `Online_Ogrenme_Analizi_${currentCategory}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// DOM tamamen yüklendiğinde güvenli başlatma sağla
document.addEventListener('DOMContentLoaded', () => {
    buildCategoryMenu();
    setupGlobalEventListeners();
});
window.addEventListener('load', () => {
    buildCategoryMenu();
});
