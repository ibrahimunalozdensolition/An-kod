# An-Kod

Vefat eden sevdiklerimiz (insan veya hayvan) için kişiselleştirilebilir bir anı sayfası oluşturulur. Bu sayfanın linki, fiziksel olarak 3D basılan bir QR ile mezar taşına/plataya yerleştirilir.

## Proje özeti
- Kullanıcı kayıt olur ve sevdiği kişi/hayvan için bir anı sayfası oluşturur.
- Sayfa tasarlanır (arka plan, yerleşim, medya).
- Ödeme sonrası sayfa **public** olur ve benzersiz link üzerinden erişilir.
- Aynı linke bağlı QR fiziksel olarak üretilir ve süreç üretici panelinden takip edilir.

## Akış
Kayıt → Şablon seçimi → İçerik yükleme → Önizleme → Ödeme → Yayınla

## Hesap ve kimlik doğrulama
- Hesap oluşturma sistemi Firebase ile yapılacak.
- Giriş/kayıt kısmında **e-posta adresi** ve **telefon numarası** zorunlu olacak.
- Telefon numarası SMS doğrulama (OTP) ile doğrulanacak.

## Taslak / yayın mantığı
- Ödeme yapılmadan kişiselleştirme yapılabilecek ama **public** olmayacak.
- Public sayfa sadece **Yayınla** ile güncellenecek.
- Ödeme öncesi önizleme sadece kullanıcıya özel olacak (public olmayacak).

## Ödeme modeli
- Kullanıcı isterse aynı hesap içinde yeni bir anı sayfası daha ekleyebilecek; **her yeni sayfa için tekrar ödeme** alınacak.
- Ek olarak ücret karşılığında "Yeni QR talep et" özelliği olacak; **aynı sayfanın linki değişmeyecek**, sadece yeni fiziksel QR talep edilecek.

### Ödeme kalemleri
- Yeni anı sayfası oluşturma (ilk kurulum)
- Fotoğraf sınırı (8 üstü) ek hak satın alma
- "Yeni QR talep et" (aynı link için yeni fiziksel QR)

## İçerik modeli (anılar)
- İçerik “anılar” listesi gibi olacak: foto/video + tarih + açıklama + etiket.
- İçerik üzerinde düzenleme yapılabilecek (kırpma, sıralama, görünürlük).
- Panelde "Yeni anı ekle" butonu olacak ve eklenen anılar ilgili sayfa altında listelenecek.
- Fotoğraf sınırı 8 olacak; 8 üstü ücretli olacak.
- Video maksimum 50 MB olacak.
- Moderasyon/raporlama kurgusu olacak.

## Paneller
Müşteri için 2 temel panel olacak:
- Panel 1: Fotoğraf/video düzenleme, yerleşim, arka plan, duruş, fotoğraf büyüklüğü, efekt vb.
- Panel 2: Yönetim sistemi

Müşteri paneli:
- Kullanıcının oluşturduğu tüm anı sayfaları listelenecek ve her birinin yönetimi ayrı yapılacak.
- Kullanıcı bir sayfa seçip içerikleri, yorumları, üretim/QR durumunu ve temel metrikleri görebilecek.

## Roller / seviyeler
- Müşteri hesabı
- Admin hesabı    
- Üretici seviyesi

## QR ve public sayfa
- Public kısım site üzerinden bir uzantı gibi olacak; benzersiz bir link olacak.
- QR sabit kalacak, kullanıcı sayfayı güncelledikçe aynı QR yeni içeriği gösterecek.
- Önizleme ve public ayrımı net olacak: Önizleme private, public sayfa yayın sonrası açık olacak.
- Sayfa için yayından kaldırma seçeneği olacak; link/QR aynı kalsa da public görünürlük kapatılabilecek.
- Yayından kaldırma ekranı: **Siyah arka plan** üzerinde **beyaz yazı** ile büyük şekilde sadece **vefat edenin ismi** yazacak.

## Yorumlar
- Ziyaretçiler yorum/anma mesajı bırakabilecek.
- Yorum bırakırken **isim zorunlu** olacak.
- Yorumlar kullanıcı isteği ile yayınlanacak (kullanıcı onayı olmadan görünmeyecek).
- Kullanıcı kendi sayfasına gelen yorumları onaylayabilecek veya silebilecek.
- Yorumlar için aç/kapat seçeneği olacak.
- Yorumlar için spam/bot koruması olacak (hız limiti vb.).
- Yorumlar silindiğinde public'te görünmeyecek; admin tarafında “silindi” durumu ile takip edilecek.

## Üretici hesabı
- Üretici hesabı 1’den fazla kullanıcı olabilecek.
- Yeni kayıt: Parası ödenen, sayfası oluşturulmuş public hale getirilmiş kullanıcıların linkleri görülecek.
- Ödeme sonrası sipariş otomatik “iş emri”ne dönüşecek ve üretici panelinde yönetilecek.
- Durumlar kural setiyle ilerleyecek (durum makinesi mantığı).
- Durum değiştirme kuralı: Üretici durumları sadece sırayla ilerletebilecek.
- Bildirim: Yapılan değişiklikler e-posta ve SMS ile bildirilecek.
- İlk etapta fiziksel ürün tek tip olacak.
- “Yeni QR talep et” istekleri üretici tarafında ayrı bir iş olarak takip edilecek, ücretli olacak ve kullanıcı panelinde durumları görülecek.

### Üretim durumu (iş emri)
| Sıra | Durum |
| --- | --- |
| 1 | Talep alındı |
| 2 | Üretime başlandı |
| 3 | Üretim tamamlandı, kontroller yapılıyor |
| 4 | Kargoya verildi |
| 5 | Teslim edildi |

### “Yeni QR talep et” durumu
| Sıra | Durum |
| --- | --- |
| 1 | Talep alındı |
| 2 | Üretime başlandı |
| 3 | Kargoya verildi |
| 4 | Teslim edildi |

## Admin seviyesi
- Kullanıcı yönetimi olacak; tüm kullanıcılar görünecek.
- Kullanıcıların e-posta adresi ve telefon numarası admin panelinde görünecek.
- Admin üretici hesaplarını da yönetebilecek.
- Ödeme tarihi ve hangi tarihten itibaren uygulamaya kayıt olduğu görünecek.
- Müşteri yaşam döngüsü tek ekrandan takip edilecek: Kayıt → Ödeme → Yayın → Üretim → Teslim → Destek.
- İstisna akışları: Ödeme hatası, üretim hatası.
- İade ve yeniden baskı olmayacak.

### Destek sistemi
- Kullanıcı destek talepleri açacak, admin panelden yönetip yanıtlayacak.
- Destek taleplerinde kategori olacak (ödeme, içerik, üretim, kargo vb.).
- Destek taleplerinde durum olacak: Açık / Beklemede / Çözüldü.

### Üretici görünürlüğü (admin)
- Üretici hesabının verdiği emirler ve yaptığı işlemler (durum güncellemeleri vb.) admin sayfasından görülebilecek.
- Admin ekranında üretici emirleri ve durum değişiklikleri üreticinin ismi ile görüntülenecek.
- Admin ekranında üretici aktivite kaydı olacak: Hangi üretici / hangi iş / hangi durum değişti / tarih-saat.

### Analitik
- Analitik hem kullanıcı panelinde (kendi sayfaları için) hem admin panelinde (kullanıcı/sistem bazlı) görülebilecek.
- Analitikte QR okutma ve sayfa ziyaretleri ayrı metrik olarak tutulacak.
- Zaman aralığı filtresi: istenilen tarihler arasında

#### Admin analitik ekranı (örnek metrikler)
| Metrik | Açıklama |
| --- | --- |
| Toplam QR okutma | İstenilen tarihler arasında |
| Toplam sayfa ziyaret | İstenilen tarihler arasında |
| Toplam satın alım | İstenilen tarihler arasında |
| Toplam ciro | İstenilen tarihler arasında |
| Yeni kayıt | İstenilen tarihler arasında |
| Ödeme yapan kullanıcı | İstenilen tarihler arasında |
| Yayına alınan sayfa | İstenilen tarihler arasında |
| Yeni anı sayfası oluşturma | İstenilen tarihler arasında |
| 8 üstü foto hak satın alımı | İstenilen tarihler arasında |
| Ücretli “Yeni QR talep et” | İstenilen tarihler arasında |
| Destek talebi (kategori bazlı) | İstenilen tarihler arasında |
| Üretimdeki iş sayısı + durum dağılımı | İstenilen tarihler arasında |
| Yorumlar (onay bekleyen/yayınlanan/silinen) | İstenilen tarihler arasında |
| En çok ziyaret edilen sayfalar | İstenilen tarihler arasında |
| En çok QR okutulan sayfalar | İstenilen tarihler arasında |

#### Admin analitik filtreleri
- Tarih aralığı
- Kullanıcı
- Anı sayfası
- Ürün türü (yeni sayfa / 8 üstü foto / yeni QR)

## Yetkilendirme kuralları
| Rol | Yetkiler |
| --- | --- |
| Müşteri | Kendi içeriklerini düzenler, yayınlar (genel yap)/yayından kaldırır, yorumları onaylar/siler, yorumları açar/kapatır, analitiği kendi sayfaları için görür, "Yeni QR talep et" isteği açar |
| Üretici | Kendisine düşen işlerde üretim durumlarını günceller, "Yeni QR talep et" işlerini takip eder |
| Admin | Kullanıcı yönetimi yapar, üretici hesaplarını yönetir, destek taleplerini yönetir, analitik ekranını görür, üretim süreçlerini izler, üretici aktivitelerini üretici adıyla görür |

## Geliştirme Fazları

### Faz 2: Müşteri Paneli - Anı Sayfası Oluşturma
- [x] Anı sayfası oluşturma formu
- [x] Şablon seçim sistemi
- [x] Panel 1: Medya yükleme (foto/video)
  - [x] 8 fotoğraf limiti kontrolü
  - [x] Video boyut kontrolü (max 50 MB)
- [x] İçerik düzenleme (kırpma, sıralama, görünürlük)
- [x] Arka plan, yerleşim, efekt ayarları
- [x] Önizleme sistemi (private)
- [x] "Anılar" listesi (foto/video + tarih + açıklama + etiket)

### Faz 3: Ödeme Sistemi
- [x] Ödeme entegrasyonu (mock)
- [x] Ödeme kalemleri:
  - [x] Yeni anı sayfası (₺299)
  - [x] 8+ fotoğraf için ek hak (₺99)
  - [x] Yeni QR talebi (₺149)
- [x] Ödeme başarı/hata yönetimi
- [x] Ödeme sonrası sayfa public hale getirme

### Faz 4: Public Sayfa ve QR
- [x] Benzersiz link oluşturma sistemi
- [x] Public anı sayfası görünümü
- [x] QR kod oluşturma
- [x] Yayınla/Yayından Kaldır özelliği
- [x] Yayından kaldırma ekranı (siyah arka plan + beyaz yazı + isim)

### Faz 5: Yorum Sistemi
- [x] Ziyaretçi yorum bırakma (isim zorunlu)
- [x] Müşteri panelinde yorum onaylama/silme
- [x] Yorumları aç/kapat özelliği
- [x] Spam/bot koruması (rate limiting)

### Faz 6: Üretici Paneli
- [x] Üretici hesabı ve paneli
- [x] İş emri sistemi (durum makinesi)
- [x] 5 aşamalı üretim durumu yönetimi
- [x] "Yeni QR talep et" iş takibi (4 aşamalı)
- [x] E-posta ve SMS bildirimleri
- [x] Müşteri panelinde üretim durumu görünümü

### Faz 7: Admin Paneli - Temel
- [x] Kullanıcı yönetimi
- [x] Üretici hesap yönetimi
- [x] Müşteri yaşam döngüsü takibi
- [x] Üretici aktivite kayıtları

### Faz 8: Destek Sistemi
- [x] Destek talebi oluşturma (müşteri)
- [x] Destek talebi yönetimi (admin)
- [x] Kategori ve durum sistemi

### Faz 9: Analitik
- [x] Müşteri analitik (kendi sayfaları için)
- [x] Admin analitik (tüm sistem)
- [x] QR okutma ve sayfa ziyaret metrikleri
- [x] Tarih aralığı ve diğer filtreler
- [x] Raporlama

### Faz 10: Moderasyon ve İyileştirmeler
- [x] İçerik moderasyonu/raporlama
- [x] Güvenlik iyileştirmeleri
- [x] Performans optimizasyonu
- [x] Kullanıcı deneyimi düzeltmeleri

### Faz 11: Test ve Yayın
- Kapsamlı testler
- Hata düzeltmeleri
- Deployment ve production hazırlık

### Önerilen Geliştirme Sırası
1. **MVP (Minimum Viable Product):** Faz 1 → 2 → 3 → 4
2. **Temel Özellikler:** Faz 5 → 6
3. **Yönetim ve Analitik:** Faz 7 → 8 → 9
4. **Tamamlama:** Faz 10 → 11
