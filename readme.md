# QR Mezarlık

Ölen hayvanlar için kişiselleştirilebilir bir anı sayfası oluşturulur. Bu sayfanın linki, fiziksel olarak 3D basılan bir QR ile mezar taşına/plataya yerleştirilir.

## Proje özeti
- Kullanıcı kayıt olur ve hayvanı için bir anı sayfası oluşturur.
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
- Kullanıcı isterse aynı hesap içinde yeni bir hayvan/sayfa daha ekleyebilecek; **her yeni hayvan/sayfa için tekrar ödeme** alınacak.
- Ek olarak ücret karşılığında “Yeni QR talep et” özelliği olacak; **aynı sayfanın linki değişmeyecek**, sadece yeni fiziksel QR talep edilecek.

### Ödeme kalemleri
- Yeni hayvan/sayfa oluşturma (ilk kurulum)
- Fotoğraf sınırı (8 üstü) ek hak satın alma
- “Yeni QR talep et” (aynı link için yeni fiziksel QR)

## İçerik modeli (anılar)
- İçerik “anılar” listesi gibi olacak: foto/video + tarih + açıklama + etiket.
- İçerik üzerinde düzenleme yapılabilecek (kırpma, sıralama, görünürlük).
- Panelde “Yeni anı ekle” butonu olacak ve eklenen anılar ilgili hayvan altında listelenecek.
- Fotoğraf sınırı 8 olacak; 8 üstü ücretli olacak.
- Video maksimum 50 MB olacak.
- Moderasyon/raporlama kurgusu olacak.

## Paneller
Müşteri için 2 temel panel olacak:
- Panel 1: Fotoğraf/video düzenleme, yerleşim, arka plan, duruş, fotoğraf büyüklüğü, efekt vb.
- Panel 2: Yönetim sistemi

Müşteri paneli:
- Kullanıcının oluşturduğu tüm hayvanlar/sayfalar listelenecek ve her birinin yönetimi ayrı yapılacak.
- Kullanıcı bir hayvan/sayfa seçip içerikleri, yorumları, üretim/QR durumunu ve temel metrikleri görebilecek.

## Roller / seviyeler
- Müşteri seviyesi
- Admin seviyesi    
- Üretici seviyesi

## QR ve public sayfa
- Public kısım site üzerinden bir uzantı gibi olacak; benzersiz bir link olacak.
- QR sabit kalacak, kullanıcı sayfayı güncelledikçe aynı QR yeni içeriği gösterecek.
- Önizleme ve public ayrımı net olacak: Önizleme private, public sayfa yayın sonrası açık olacak.
- Sayfa için yayından kaldırma seçeneği olacak; link/QR aynı kalsa da public görünürlük kapatılabilecek.
- Yayından kaldırma ekranı: **Siyah arka plan** üzerinde **beyaz yazı** ile büyük şekilde sadece **ölen hayvanın ismi** yazacak.

## Yorumlar
- Ziyaretçiler yorum/anma mesajı bırakabilecek.
- Yorum bırakırken **isim zorunlu** olacak.
- Yorumlar kullanıcı isteği ile yayınlanacak (kullanıcı onayı olmadan görünmeyecek).
- Kullanıcı kendi sayfasına gelen yorumları onaylayabilecek veya silebilecek.
- Yorumlar için aç/kapat seçeneği olacak.
- Yorumlar için spam/bot koruması olacak (hız limiti vb.).
- Yorumlar silindiğinde public'te görünmeyecek; admin tarafında “silindi” durumu ile takip edilecek.

## Üretici seviyesi
- Üretici 1’den fazla kullanıcı olabilecek.
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
| Yeni hayvan/sayfa oluşturma | İstenilen tarihler arasında |
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
- Hayvan/sayfa
- Ürün türü (yeni sayfa / 8 üstü foto / yeni QR)

## Yetkilendirme kuralları
| Rol | Yetkiler |
| --- | --- |
| Müşteri | Kendi içeriklerini düzenler, yayınlar (genel yap)/yayından kaldırır, yorumları onaylar/siler, yorumları açar/kapatır, analitiği kendi sayfaları için görür, “Yeni QR talep et” isteği açar |
| Üretici | Kendisine düşen işlerde üretim durumlarını günceller, “Yeni QR talep et” işlerini takip eder |
| Admin | Kullanıcı yönetimi yapar, üretici hesaplarını yönetir, destek taleplerini yönetir, analitik ekranını görür, üretim süreçlerini izler, üretici aktivitelerini üretici adıyla görür |

# An-kod
