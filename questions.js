const quizData = {
    "oiy": {
        title: "Öğretim İlke ve Yöntemleri",
        questions: [
            { q: "Bir öğretmenin derse başlarken öğrencilerin dikkatini çekmek için sıra dışı bir görsel materyal getirmesi veya şaşırtıcı bir soru sorması ders planının öncelikle hangi aşamasına hizmet eder?", options: ["Hedeften haberdar etme", "Güdüleme", "Dikkati çekme", "Geçiş", "Yansıtma"], answer: 2 },
            { q: "Öğretmenin derste somut nesneler kullanarak soyut kavramları açıklamaya çalışması, hangi öğretim ilkesiyle doğrudan ilgilidir?", options: ["Açıklık (Ayanilik)", "Somuttan Soyuta", "Yakından Uzağa", "Ekonomiklik", "Bilinenden Bilinmeyene"], answer: 1 },
            { q: "Öğrencilerin yaparak ve yaşayarak öğrenmelerini temel alan, iş birliğine dayalı ve problem çözme becerilerini geliştirmeyi amaçlayan çağdaş yaklaşım hangisidir?", options: ["Sunuş Yoluyla Öğretim", "Proje Tabanlı Öğrenme", "Buluş Yoluyla Öğretim", "Programlı Öğretim", "Tam Öğrenme Modeli"], answer: 1 },
            { q: "Öğretmenin yeni öğreteceği konuyu öğrencilerin geçmiş yaşantıları ve mevcut bilgileriyle ilişkilendirerek anlatması hangi öğretim ilkesinin bir gereğidir?", options: ["Bilinenden bilinmeyene", "Somuttan soyuta", "Açıklık", "Güncellik", "Aktivite"], answer: 0 },
            { q: "Ausubel tarafından geliştirilen, anlamlı öğrenmeyi temel alan ve tümdengelim yoluyla genel kavramlardan özel kavramlara doğru ilerleyen öğretim stratejisi hangisidir?", options: ["Buluş yoluyla öğretim", "Sunuş yoluyla öğretim", "Araştırma-inceleme yoluyla öğretim", "Tam öğrenme", "Basamaklı öğretim"], answer: 1 },
            { q: "John Dewey'in felsefesine dayanan, öğrencilerin gerçek yaşam problemlerine bilimsel yöntem basamaklarını kullanarak çözümler ürettiği öğretim stratejisi hangisidir?", options: ["Buluş yoluyla öğretim", "Sunuş yoluyla öğretim", "Araştırma-inceleme yoluyla öğretim", "Kuantum öğrenme", "Mikro öğretim"], answer: 2 },
            { q: "Öğretilen bilgilerin günlük yaşamda kullanılabilir olması, transfer edilebilmesi ve işe yaraması aşağıdaki öğretim ilkelerinden hangisinin temelidir?", options: ["Yakından uzağa", "Güncellik", "Hayatilik (Yaşamsallık)", "Bilinenden bilinmeyene", "Somuttan soyuta"], answer: 2 },
            { q: "Öğretim sürecinin en az zaman, en az emek ve en az maliyetle en yüksek verimi elde edecek şekilde planlanması hangi ilkedir?", options: ["Bütünlük", "Açıklık", "Sosyallik", "Ekonomiklik", "Öğrenciye görelik"], answer: 3 },
            { q: "Öğrencilerin üst düzey zihinsel süreçlerini geliştirerek kendi öğrenme yollarının farkına varmalarını sağlayan kavram aşağıdakilerden hangisidir?", options: ["Metabiliş (Yürütücü biliş)", "Anlamlı öğrenme", "Gizil öğrenme", "Tümevarım", "Şemalandırma"], answer: 0 },
            { q: "Bir coğrafya öğretmeninin Türkiye'nin yer şekillerini anlatırken önce yakın çevredeki dağ ve akarsulardan başlaması hangi öğretim ilkesine uygundur?", options: ["Somuttan soyuta", "Yakından uzağa", "Görsellik", "Ekonomiklik", "Güncellik"], answer: 1 }
        ]
    },
    "sy": {
        title: "Sınıf Yönetimi",
        questions: [
            { q: "Sınıfta istenmeyen bir davranış ortaya çıktığında öğretmenin ilk olarak yapması gereken en uygun eylem aşağıdakilerden hangisidir?", options: ["Öğrenciyi sınıftan çıkarmak", "Sert bir şekilde uyarmak", "Göz teması kurmak veya duruma göre hafifçe görmezden gelmek", "Veliyi aramaya karar vermek", "Disipline sevk etmek"], answer: 2 },
            { q: "Sınıf kurallarının belirlenmesi sürecinde aşağıdakilerden hangisine dikkat edilmesi, kuralların öğrenciler tarafından benimsenmesini en üst düzeneye çıkarır?", options: ["Kuralların okul yönetimi tarafından belirlenmesi", "Kuralların öğretmen tarafından tek taraflı dikte edilmesi", "Kuralların öğrencilerle birlikte (ortaklaşa) belirlenmesi", "Kuralların ceza odaklı ve çok sert yazılması", "Kuralların her hafta değiştirilmesi"], answer: 2 },
            { q: "Öğretmenin sınıf içindeki tüm olaylardan aynı anda haberdar olması ve bunu öğrencilere hissettirmesi, Kounin'in sınıf yönetimi modellerinde hangi kavramla ifade edilir?", options: ["Aşırılık", "Aynı anda birden fazla işi yürütme", "Sınıfta olup bitenlere egemen olma (Her yerde olma)", "Dalgasallık etkisi", "Grup odağı"], answer: 2 },
            { q: "Sınıfta oturma düzeni seçilirken, öğrencilerin yoğun bir şekilde tartışma ve karşılıklı etkileşim kurması hedefleniyorsa hangi düzen en uygundur?", options: ["Sıralı (Geleneksel) düzen", "U düzeni", "Küme (Grup) düzeni", "Daire düzeni", "Bireysel düzen"], answer: 2 },
            { q: "Bir öğrencinin derste sürekli yanındaki arkadaşıyla konuşarak dersin akışını bozması durumunda, öğretmenin derse ara vermeden öğrencinin yanına doğru yürümesi hangi teknikle açıklanır?", options: ["Sözsüz uyarı (Fiziksel yakınlık)", "Sözlü uyarı", "Görmezden gelme", "Ceza verme", "Sorumluluk verme"], answer: 0 },
            { q: "Etkili bir zaman yönetimi için öğretmenin ders planında aşağıdakilerden hangisine en çok zaman ayırması beklenir?", options: ["Yoklama alma ve idari işlere", "Sınıfı sessizleştirmeye çalışmaya", "Akademik öğrenme ve etkinlik zamanına", "Ödev kontrolüne", "Serbest zaman ve oyun etkinliklerine"], answer: 2 },
            { q: "Sınıf yönetimi boyutlarından hangisi, öğrenme ortamının ısısı, ışığı, renkleri ve temizliği gibi değişkenleri barındırır?", options: ["Fiziksel düzen", "Plan-program yönetimi", "Zaman yönetimi", "Davranış yönetimi", "İlişki yönetimi"], answer: 0 }
        ]
    },
    "otmt": {
        title: "Öğretim Teknolojileri ve Materyal Tasarım",
        questions: [
            { q: "Dale'in Yaşantı Konisi'ne göre, en kalıcı öğrenmeler hangi yaşantılar yoluyla gerçekleşir?", options: ["Doğrudan doğruya edinilen amaçlı yaşantılar", "Model ve numunelerle edinilen yaşantılar", "Gösteriler yoluyla edinilen yaşantılar", "Gözlem gezileri yoluyla edinilen yaşantılar", "Sözel semboller yoluyla edinilen yaşantılar"], answer: 0 },
            { q: "Öğretim materyallerinde görsel öğelerin (örneğin önemli bir kavramın) vurgulanması için zıt renklerin kullanılması, hangi tasarım ilkesiyle doğrudan ilgilidir?", options: ["Denge", "Vurgu / Odak noktası", "Hizalama", "Yakınlık", "Bütünlük"], answer: 1 },
            { q: "Materyal tasarımında unsurların (yazı, resim, şekil) sayfa üzerinde dengeli bir şekilde dağıtılması, dikey veya yatay eksene göre simetrik veya asimetrik yerleştirilmesi hangi ilkedir?", options: ["Ritim", "Denge", "Bütünlük", "Oran-Orantı", "Hizalama"], answer: 1 },
            { q: "Dale'in Yaşantı Konisi dikkate alındığında, somuttan soyuta doğru sıralamada aşağıdakilerden hangisi en soyut öğrenme yaşantısını sağlar?", options: ["Görsel semboller", "Sözel semboller", "Radyo ve plaklar", "Hareketli resimler", "Sergiler"], answer: 1 },
            { q: "Bir öğretim materyalinde yazı tipi seçimi yapılırken okunabilirliği artırmak adına aşağıdakilerden hangisinden kaçınılmalıdır?", options: ["Zemin ile metin arasında yüksek kontrast sağlamaktan", "Aynı materyalde 3-4'ten fazla farklı yazı tipi (font) kullanmaktan", "Başlıklarda kalın karakterler kullanmaktan", "Satır arası boşlukları dengeli ayarlamaktan", "Gözü yormayan renk kombinasyonları seçmekten"], answer: 1 }
        ]
    },
    "op": {
        title: "Öğrenme Psikolojisi",
        questions: [
            { q: "Klasik koşullanmada, koşullu uyarıcının bir süre tek başına verilmesi sonucunda koşullu tepkinin ortadan kalkması sürecine ne ad verilir?", options: ["Sönme", "Geriye ket vurma", "Alışma", "Duyarsızlaşma", "Genelleme"], answer: 0 },
            { q: "Thorndike'ın Bağlaşımcılık kuramına göre, bir davranışın pekiştirilmesi veya cezalandırılmasının o davranışın gücünü etkilemesi hangi kanunla açıklanır?", options: ["Hazırbulunuşluk kanunu", "Egzersiz kanunu", "Etki kanunu", "Tekrar kanunu", "Çağrışımsal geçiş kanunu"], answer: 2 },
            { q: "Skinner'ın Edimsel Koşullanma kuramına göre, ortama konulduğunda davranışın yapılma sıklığını artırıp organizmayı rahatlatan uyarıcılara ne ad verilir?", options: ["Olumsuz pekiştireç", "Olumlu pekiştireç", "Birinci tür ceza", "İkinci tür ceza", "Ayırt edici uyarıcı"], answer: 1 },
            { q: "Bireyin yeni öğrendiği bir bilgi yüzünden eski öğrendiği bilgileri hatırlamakta zorluk çekmesi durumuna ne ad verilir?", options: ["İleriye ket vurma", "Geriye ket vurma", "Olumsuz transfer", "Sönme", "Unutma"], answer: 1 },
            { q: "Bandura'nın Sosyal Öğrenme Kuramı'na göre, bireyin başkalarının davranışlarını gözlemleyerek ve onları model alarak öğrenmesi sürecine ne ad verilir?", options: ["Edimsel koşullanma", "Dolaylı öğrenme (Modelden öğrenme)", "Gizil öğrenme", "İçgörüsel öğrenme", "Deneme-yanılma öğrenmesi"], answer: 1 }
        ]
    },
    "gp": {
        title: "Gelişim Psikolojisi",
        questions: [
            { q: "Piaget'nin zihinsel gelişim kuramına göre, bir çocuğun 'korunum' ilkesini kazandığı dönem aşağıdakilerden hangisidir?", options: ["Duyusal Motor Dönemi", "İşlem Öncesi Dönem", "Somut İşlemler Dönemi", "Soyut İşlemler Dönemi", "Oral Dönem"], answer: 2 },
            { q: "Erikson'ın Psikososyal Gelişim Kuramı'na göre, 12-18 yaş aralığındaki ergenlik döneminde çözülmesi gereken temel kriz aşağıdakilerden hangisidir?", options: ["Güvene karşı güvensizlik", "Özerkliğe karşı kuşku ve utanç", "Başarıya karşı aşağılık duygusu", "Kimlik kazanmaya karşı rol karmaşası", "Üretkenliğe karşı durgunluk"], answer: 3 },
            { q: "Kohlberg'in Ahlaki Gelişim Kuramı'na göre, kurallara sadece ceza almamak ve otoriteye boyun etmek için uyan bir birey hangi ahlaki evrededir?", options: ["İtaat ve Ceza Eğilimi", "Saf Çıkarcı Eğilimi", "İyi Çocuk Eğilimi", "Kanun ve Düzen Eğilimi", "Sosyal Sözleşme Eğilimi"], answer: 0 },
            { q: "Gelişim ilkeleri düşünüldüğünde, bir çocuğun önce kollarını kontrol edip ardından parmaklarıyla küçük nesneleri tutabilmesi hangi gelişim ilkesiyle açıklanır?", options: ["Gelişim genelden özele doğrudur", "Gelişim baştan ayağa doğrudur", "Gelişimde bireysel farklar vardır", "Gelişim bir bütündür", "Gelişim nöbetleşe devam eder"], answer: 0 }
        ]
    },
    "oe": {
        title: "Özel Eğitim",
        questions: [
            { q: "Özel eğitime ihtiyacı olan bireylerin, akranlarıyla birlikte aynı sınıfta tam veya yarı zamanlı olarak eğitim görmelerini esas alan uygulama hangisidir?", options: ["Ayrıştırma", "Kaynaştırma / Bütünleştirme", "Özel Sınıf Uygulaması", "Evde Eğitim", "Destek Eğitim Odası"], answer: 1 },
            { q: "Özel eğitim ihtiyacı olan bir öğrenci için okulda kurulan komisyon tarafından hazırlanan, öğrencinin gelişimsel ve akademik hedeflerini içeren yasal plana ne ad verilir?", options: ["BEP (Bireyselleştirilmiş Eğitim Programı)", "BÖP (Bireyselleştirilmiş Öğretim Planı)", "Yıllık Plan", "Ünitendirilmiş Ders Planı", "Rehberlik Programı"], answer: 0 },
            { q: "Özel eğitimde 'en az kısıtlayıcı çevre' ilkesinin temel amacı aşağıdakilerden hangisidir?", options: ["Öğrenciyi tamamen toplumdan uzaklaştırmak", "Öğrenciye en az maliyetli eğitimi sunmak", "Öğrencinin sosyal ve eğitsel açıdan akranlarından ayrılmadan en uygun ortamda eğitim almasını sağlamak", "Sadece yatılı özel eğitim okullarını yaygınlaştırmak", "Öğretmenin yükünü azaltmak"], answer: 2 }
        ]
    }
};