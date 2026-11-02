 # 📹 Aplikasi Checklist Instalasi CCTV & Sistem Pro

Aplikasi web modern profesional untuk mempermudah teknisi dan PIC (Person in Charge) dalam mengisi checklist instalasi CCTV & sistem di lapangan, dilengkapi **tanda tangan digital ganda**, **ekspor gambar resolusi tinggi (PNG)**, **dokumen cetak resmi (PDF A4)**, serta **integrasi Google Apps Script (GAS) & Google Spreadsheet** sebagai database. Siap di-hosting ke **GitHub** dan di-deploy ke **Vercel** dengan domain kustom Anda.

---

## 🌟 Fitur Utama

1. **Desain Poster 1:1 Presisi & Diperbagus**:
   - Menghasilkan dokumen sertifikat/checklist yang identik dan bahkan lebih modern, tajam, dan elegan dibanding poster referensi cetak.
   - Menggunakan grafis vektor murni (SVG) untuk kamera CCTV 3D, server rak NVR, hard disk 2x 8TB, dongle Wi-Fi TP-Link, dome camera, PC client 50", dan video wall 16-channel.
   - Hasil ekspor tidak akan pecah/blur saat dicetak maupun dikirim ke klien via WhatsApp atau Email.

2. **Formulir Interaktif & Responsif**:
   - Tampilan ramah perangkat: smartphone, tablet lapangan, hingga laptop/desktop.
   - Tiga mode tampilan:
     - **Form Input**: Fokus pengisian data teknis secara cepat.
     - **Split Mode**: Layar ganda berdampingan (input di kiri, poster live-update di kanan).
     - **Poster Hasil**: Pratinjau 1:1 sebelum diekspor.
   - Fitur "Centang Semua Bagian", "Isi Contoh Data" (Quick Demo), dan kalkulator progress otomatis.

3. **Tanda Tangan Digital Ganda (Dual Digital Signature)**:
   - Dilengkapi kanvas tanda tangan sentuh halus untuk:
     - **Teknisi Pelaksana**
     - **PIC Site / Customer**
   - Mendukung fitur Undo goresan dan Hapus.
   - Hasil tanda tangan otomatis tertanam rapi ke dalam kotak tanda tangan di poster hasil.

4. **Ekspor Multi-Format Kualitas Tinggi**:
   - 🖼️ **Ekspor Gambar PNG**: Skala 2.4x (setara 300 DPI cetak) dengan sekali klik.
   - 📄 **Ekspor PDF A4 Landscape**: Tata letak presisi A4 standar internasional dengan margin rapi.
   - 🖨️ **Print Langsung**: Dilengkapi aturan `@media print` otomatis tanpa header browser.

5. **Integrasi Google Sheets & Google Apps Script (GAS)**:
   - Data checklist, rekapitulasi persentase, catatan, hingga gambar tanda tangan otomatis terkirim dan tercatat rapi di Google Spreadsheet.
   - Dilengkapi tab otomatis:
     - `Log_Checklist_CCTV`: Menyimpan riwayat setiap pekerjaan.
     - `Ringkasan_Dashboard`: Formula otomatis untuk memonitor total instalasi dan status pekerjaan.

6. **Draf Otomatis Tersimpan (Auto-save Offline)**:
   - Data tidak hilang meskipun browser tertutup atau sinyal terputus di lapangan.

---

## 📂 Struktur Berkas

```text
cctv-checklist-app/
├── index.html         # Tampilan antarmuka formulir dan live poster dokumen
├── styles.css         # Desain modern dark tech, layout poster cetak, dan print rules
├── app.js             # Logika aplikasi, kanvas tanda tangan, ekspor PNG/PDF & sync GAS
├── Code.gs            # Script backend Google Apps Script untuk Google Spreadsheet
├── package.json       # Konfigurasi npm & dependensi
├── vercel.json        # Konfigurasi deployment & security header Vercel
├── server.js          # Server lokal Node.js (untuk pengujian di komputer)
└── README.md          # Dokumentasi panduan lengkap
```

---

## 🚀 Panduan Setup 1: Google Spreadsheet & Google Apps Script (GAS)

Langkah ini membuat backend Google Sheets gratis untuk menyimpan semua data hasil instalasi.

1. Buka [Google Spreadsheet](https://sheets.new) di browser Anda.
2. Beri nama spreadsheet, contoh: `Database_Checklist_CCTV_Site`.
3. Klik menu **Ekstensi (Extensions)** > **Apps Script**.
4. Hapus seluruh kode bawaan yang ada di editor Apps Script (`myFunction`).
5. Buka berkas `Code.gs` dari folder proyek ini, salin (**Copy**) seluruh isinya, lalu tempel (**Paste**) ke editor Apps Script.
6. Pada dropdown pilihan fungsi di toolbar atas Apps Script, pilih **`setupSheet`**, lalu klik tombol **Jalankan (Run)**.
   > **Catatan Izin**: Google akan meminta izin akses ("Authorization Required"). Klik **Review permissions** > Pilih Akun Google Anda > Klik **Advanced** (Lanjutan) > Klik **Go to Untitled project (unsafe)** > Klik **Allow** (Izinkan).
   > *Setelah selesai, spreadsheet Anda otomatis memiliki 2 tab: `Log_Checklist_CCTV` (dengan header rapi berwarna navy) dan `Ringkasan_Dashboard`.*
7. Klik tombol **Terapkan (Deploy)** di pojok kanan atas > Pilih **Penerapan baru (New deployment)**.
8. Klik ikon roda gigi (Select type) > Pilih **Aplikasi Web (Web app)**.
9. Isi konfigurasi berikut:
   - **Deskripsi**: `Checklist CCTV Web API v1`
   - **Jalankan sebagai (Execute as)**: `Saya (emailanda@gmail.com)`
   - **Yang memiliki akses (Who has access)**: **`Siapa saja (Anyone)`** *(Wajib "Anyone" agar form web Vercel bisa mengirimkan data tanpa login).*
10. Klik **Terapkan (Deploy)**.
11. Salin **URL Aplikasi Web** yang berakhiran `/exec`.
    - Contoh format URL: `https://script.google.com/macros/s/AKfycbx.../exec`
12. Di aplikasi web Anda, klik tombol **GAS** di pojok kanan atas, tempelkan URL tersebut, lalu klik **Simpan Pengaturan**.

---

## 🐙 Panduan Setup 2: Upload ke GitHub

1. Buka [GitHub](https://github.com) dan buat repository baru (misal: `cctv-checklist-app`).
2. Di komputer lokal Anda, buka terminal pada folder proyek ini:
   ```bash
   cd /Users/armend/.gemini/antigravity-ide/scratch/cctv-checklist-app
   git init
   git add .
   git commit -m "feat: initial release checklist cctv pro with signatures and export"
   git branch -M main
   git remote add origin https://github.com/USERNAME-ANDA/cctv-checklist-app.git
   git push -u origin main
   ```

---

## ⚡ Panduan Setup 3: Hosting di Vercel & Pengaturan Domain Kustom

1. Masuk ke [Vercel Dashboard](https://vercel.com).
2. Klik tombol **Add New...** > **Project**.
3. Hubungkan akun GitHub Anda dan pilih repository **`cctv-checklist-app`**.
4. Pada bagian *Framework Preset*, biarkan sebagai **Other** (karena aplikasi ini berupa static web murni yang sangat cepat dan ringan).
5. Klik **Deploy**. Dalam waktu kurang dari 30 detik, aplikasi Anda sudah live dengan URL Vercel (contoh: `https://cctv-checklist-app.vercel.app`).

### Menghubungkan Domain Kustom di Vercel:
1. Di halaman proyek Vercel Anda, klik menu **Settings** > **Domains**.
2. Masukkan nama domain atau subdomain Anda (misal: `cctv.perusahaananda.com` atau `checklistcctv.com`).
3. Tambahkan DNS Record pada penyedia domain Anda sesuai instruksi Vercel:
   - Untuk **Root domain**: A Record mengarah ke IP `76.76.21.21`
   - Untuk **Subdomain**: CNAME Record mengarah ke `cname.vercel-dns.com`
4. Tunggu sertifikat SSL otomatis terbit (biasanya 5–15 menit). Selesai!

---

## 💻 Pengujian Lokal di Komputer

Jika ingin menjalankan aplikasi di komputer lokal sebelum deploy:
```bash
cd /Users/armend/.gemini/antigravity-ide/scratch/cctv-checklist-app
npm start
```
Buka browser di alamat: **`http://localhost:3000`**

---

## 📋 Daftar Rincian Checklist Sesuai Standar Lapangan

- **Bagian A. Persiapan & NVR (10 Item)**:
  - MOS (Material On Site)
  - Pemasangan label SN (Serial Number)
  - Dokumen list IP dari SM
  - Pemasangan perangkat pada rack server
  - Pemasangan CCTV (jumlah terpasang / target unit)
  - Pemasangan & aktivasi HDD NVR (2 × 8TB)
  - Setting date & time NVR sesuai NTP site
  - Pemasangan dongle Wi-Fi TP-Link
  - Koneksi NVR ke Wi-Fi setempat
  - Instalasi remote access (RustDesk/UltraViewer)
- **Bagian B. Konfigurasi CCTV (8 Item)**:
  - Setting watermark, penamaan CCTV, setting date & time, sinkronisasi waktu PC/NTP, setting IP address, adding camera, adjustment kamera, troubleshooting.
- **Bagian C. PC Client (8 Item)**:
  - Instalasi & konfigurasi PC client, NTP site, setting IP, Wi-Fi, remote access, instalasi software CWERK dari `C:\NVR`, tampilan monitor 50", pemastian tampilan normal.
- **Bagian D. Final Check & Penutup (11 Item)**:
  - Seluruh CCTV online, live view normal, recording & playback normal, HDD terdeteksi, date & time sinkron, PC client & monitor normal, remote access berfungsi, dokumentasi seluruh sistem, serah terima ke PIC site, transfer knowledge, dismantle.
- **Validasi Akhir**:
  - Catatan/kendala lapangan
  - Status pekerjaan: Selesai / Selesai dengan catatan / Belum selesai
  - Tanda tangan digital Teknisi & PIC Site
  - Tagline resmi: *Profesional • Akurat • Terpercaya*
