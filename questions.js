const quizData = {
    "kktc_khk": {
        title: "KKTC KHK & Mevzuat ve Genel Kültür",
        questions: [
            { q: "KKTC 7/1979 Sayılı Kamu Görevlileri Yasası'na göre, kamu görevlilerinin haftalık çalışma saatleri prensip olarak Bakanlar Kurulu tarafından belirlenir. Aksine bir karar üretilmediği sürece haftalık çalışma süresi kaç saattir?", options: ["35 Saat", "38 Saat", "40 Saat", "42 Saat", "45 Saat"], answer: 1 },
            { q: "KKTC Anayasası'na göre Cumhurbaşkanı seçilebilmek için kaç yaşını doldurmuş olmak ve en az hangi düzeyde eğitim almış olmak şartı aranır?", options: ["35 yaş - Lise", "40 yaş - Yükseköğrenim", "30 yaş - Yükseköğrenim", "45 yaş - Lise", "40 yaş - Ortaokul"], answer: 1 },
            { q: "KKTC Kamu Görevlileri Yasası uyarınca, kadrosu içinde verimli çalışmadığı, görevini aksattığı veya disiplinsiz davrandığı saptanan memurlara disiplin kurulu kararı alınmadan önce en erken hangi ceza ilk aşamada yetkili amir tarafından verilebilir?", options: ["Maaş Kesintisi", "Uyarma ve Kınama", "Kademe Durdurulması", "Geçici Azil", "Görevden Çıkarma"], answer: 1 },
            { q: "KKTC Cumhuriyet Meclisi'nde milletvekili genel seçimleri kaç yılda bir gerçekleştirilir ve meclis toplam kaç milletvekilinden oluşur?", options: ["4 yılda bir - 50 Milletvekili", "5 yılda bir - 50 Milletvekili", "5 yılda bir - 60 Milletvekili", "4 yılda bir - 40 Milletvekili", "3 yılda bir - 50 Milletvekili"], answer: 1 },
            { q: "KKTC yasalarına göre, idarenin her türlü eylem ve işlemine karşı yargı yolu açıktır. İdari işlemlere karşı yürütmenin durdurulması davası öncelikle hangi mahkemede ikame edilir?", options: ["Kaza Mahkemesi", "Yargıtay", "Yüksek İdare Mahkemesi", "Anayasa Mahkemesi", "Askeri Mahkeme"], answer: 2 },
            { q: "KKTC'de kamu görevine ilk defa atanacak kişilerin tabi tutulduğu ve Kamu Hizmeti Komisyonu (KHK) tarafından organize edilen sınav türü aşağıdakilerden hangisidir?", options: ["Yeterlik Sınavı", "Yükselme Sınavı", "Muafiyet Sınavı", "Hizmet İçi Bitirme Sınavı", "Staj Değerlendirmesi"], answer: 0 },
            { q: "KKTC Anayasası uyarınca, Bakanlar Kurulu'nun başkanı kimdir ve bakanları atama yetkisi kime aittir?", options: ["Cumhurbaşkanı - Meclis Başkanı", "Başbakan - Cumhurbaşkanı", "Meclis Başkanı - Başbakan", "Başbakan - Bakanlar Kurulu", "Cumhurbaşkanı - Başbakan"], answer: 1 }
        ]
    },
    "oiy": {
        title: "Öğretim İlke ve Yöntemleri (KPSS)",
        questions: [
            { q: "Bir öğretmenin derse başlarken öğrencilerin dikkatini çekmek için sıra dışı bir görsel materyal getirmesi veya şaşırtıcı bir soru sorması ders planının öncelikle hangi aşamasına hizmet eder?", options: ["Hedeften haberdar etme", "Güdüleme", "Dikkati çekme", "Geçiş", "Yansıtma"], answer: 2 },
            { q: "Öğretmenin derste somut nesneler kullanarak soyut kavramları açıklamaya çalışması, hangi öğretim ilkesiyle doğrudan ilgilidir?", options: ["Açıklık (Ayanilik)", "Somuttan Soyuta", "Yakından Uzağa", "Ekonomiklik", "Bilinenden Bilinmeyene"], answer: 1 },
            { q: "Öğrencilerin yaparak ve yaşayarak öğrenmelerini temel alan, iş birliğine dayalı ve problem çözme becerilerini geliştirmeyi amaçlayan çağdaş yaklaşım hangisidir?", options: ["Sunuş Yoluyla Öğretim", "Proje Tabanlı Öğrenme", "Buluş Yoluyla Öğretim", "Programlı Öğretim", "Tam Öğrenme Modeli"], answer: 1 },
            { q: "Öğretmenin yeni öğreteceği konuyu öğrencilerin geçmiş yaşantıları ve mevcut bilgileriyle ilişkilendirerek anlatması hangi öğretim ilkesinin bir gereğidir?", options: ["Bilinenden bilinmeyene", "Somuttan soyuta", "Açıklık", "Güncellik", "Aktivite"], answer: 0 },
            { q: "Ausubel tarafından geliştirilen, anlamlı öğrenmeyi temel alan ve tümdengelim yoluyla genel kavramlardan özel kavramlara doğru ilerleyen öğretim stratejisi hangisidir?", options: ["Buluş yoluyla öğretim", "Sunuş yoluyla öğretim", "Araştırma-inceleme yoluyla öğretim", "Tam öğrenme", "Basamaklı öğretim"], answer: 1 },
            { q: "John Dewey'in felsefesine dayanan, öğrencilerin gerçek yaşam problemlerine bilimsel yöntem basamaklarını kullanarak çözümler ürettiği öğretim stratejisi hangisidir?", options: ["Buluş yoluyla öğretim", "Sunuş yoluyla öğretim", "Araştırma-inceleme yoluyla öğretim", "Kuantum öğrenme", "Mikro öğretim"], answer: 2 },
            { q: "Öğretilen bilgilerin günlük yaşamda kullanılabilir olması, transfer edilebilmesi ve işe yaraması aşağıdaki öğretim ilkelerinden hangisinin temelidir?", options: ["Yakından uzağa", "Güncellik", "Hayatilik (Yaşamsallık)", "Bilinenden bilinmeyene", "Somuttan soyuta"], answer: 2 },
            { q: "Öğretim sürecinin en az zaman, en az emek ve en az maliyetle en yüksek verimi elde edecek şekilde planlanması hangi ilkedir?", options: ["Bütünlük", "Açıklık", "Sosyallik", "Ekonomiklik", "Öğrenciye görelik"], answer: 3 },
            { q: "Öğrencilerin üst düzey zihinsel süreçlerini geliştirerek kendi öğrenme yollarının farkına varmalarını sağlayan kavram aşağıdakilerden hangisidir?", options: ["Metabiliş (Yürütücü biliş)", "Anlamlı öğrenme", "Gizil öğrenme", "Tümevarım", "Şemalandırma"], answer: 0 }
        ]
    },
    "sy": {
        title: "Sınıf Yönetimi",
        questions: [
            { q: "Sınıfta istenmeyen bir davranış ortaya çıktığında öğretmenin ilk olarak yapması gereken en uygun eylem aşağıdakilerden hangisidir?", options: ["Öğrenciyi sınıftan çıkarmak", "Sert bir şekilde uyarmak", "Göz teması kurmak veya duruma göre hafifçe görmezden gelmek", "Veliyi aramaya karar vermek", "Disipline sevk etmek"], answer: 2 },
            { q: "Sınıf kurallarının belirlenmesi sürecinde aşağıdakilerden hangisine dikkat edilmesi, kuralların öğrenciler tarafından benimsenmesini en üst düzeyeye çıkarır?", options: ["Kuralların okul yönetiminde belirlenmesi", "Kuralların öğretmen tarafından tek taraflı dikte edilmesi", "Kuralların öğrencilerle birlikte (ortaklaşa) belirlenmesi", "Kuralların ceza odaklı ve çok sert yazılması", "Kuralların her hafta değiştirilmesi"], answer: 2 },
            { q: "Öğretmenin sınıf içindeki tüm olaylardan aynı anda haberdar olması ve bunu öğrencilere hissettirmesi, Kounin'in sınıf yönetimi modellerinde hangi kavramla ifade edilir?", options: ["Aşırılık", "Aynı anda birden fazla işi yürütme", "Sınıfta olup bitenlere egemen olma (Her yerde olma)", "Dalgasallık etkisi", "Grup odağı"], answer: 2 },
            { q: "Sınıfta oturma düzeni seçilirken, öğrencilerin yoğun bir şekilde tartışma ve karşılıklı etkileşim kurması hedefleniyorsa hangi düzen en uygundur?", options: ["Sıralı (Geleneksel) düzen", "U düzeni", "Küme (Grup) düzeni", "Daire düzeni", "Bireysel düzen"], answer: 2 }
        ]
    }
};