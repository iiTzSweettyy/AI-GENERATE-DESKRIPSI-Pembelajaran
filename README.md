# 🎓 AI Generate Deskripsi Pembelajaran KBC

Aplikasi web cerdas berbasis Artificial Intelligence (AI) yang dirancang untuk membantu pendidik merumuskan Tujuan Pembelajaran Kurikulum Berbasis Cinta (KBC) dengan cepat, terstruktur, dan bervariasi. 

Aplikasi ini memproses *input* berupa Mata Pelajaran, Fase Kelas, Materi Pokok, Nilai Panca Cinta, dan Dimensi Profil Lulusan, lalu mengirimkannya ke **Google Gemini API** untuk diracik menjadi deskripsi pembelajaran yang komprehensif.

---

## ✨ Fitur Utama

* 🤖 **AI-Powered Generation:** Menghasilkan 3 variasi gaya bahasa (Detail, Mengalir, Ringkas) secara instan.
* 🛡️ **Sistem Anti-Limit (Failover Fallback):** Dilengkapi dengan mekanisme *fallback* cerdas yang akan otomatis beralih ke 4 model Gemini cadangan (`gemini-3.1-flash-lite`, `gemini-3.5-flash`, `gemini-3-flash`, `gemini-2.5-flash`) untuk mencegah *error rate limit* (429) maupun *server downtime* (503).
* 📋 **One-Click Copy:** Fitur salin teks ke *clipboard* dengan satu klik untuk memudahkan pemindahan teks.
* 🎨 **Modern UI/UX:** Antarmuka yang bersih, intuitif, dan responsif menggunakan Tailwind CSS.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, Tailwind CSS (via CDN), Vanilla JavaScript.
* **Backend:** Python, FastAPI, Google GenAI SDK.
* **Deployment:** Vercel (Serverless Functions).

---

## 📁 Struktur Direktori

```text
├── api/
│   ├── main.py          # Logika backend FastAPI & rute integrasi Gemini API
|   └──.env              # environment variables
├── public/
│   ├── index.html       # Antarmuka utama form aplikasi
│   ├── script.js        # Logika frontend (Fetch API, DOM Manipulation)
│   └── style.css        # Styling tambahan
├── requirements.txt     # Daftar dependensi library Python
├── vercel.json          # Konfigurasi routing untuk deployment Vercel
└── README.md
```

🚀 Cara Menjalankan di Lokal (Local Development)
Jika ingin mengembangkan atau menguji coba aplikasi ini di komputer sendiri, ikuti langkah-langkah berikut:

1. Persiapan Lingkungan
Pastikan kamu sudah menginstal Python 3.9+ dan memiliki akun Google AI Studio untuk mendapatkan API Key.

2. Instalasi
Clone repositori ini ke komputer lokal kamu:

git clone [https://github.com/iiTzSweettyy/AI-GENERATE-DESKRIPSI-Pembelajaran.git](https://github.com/iiTzSweettyy/AI-GENERATE-DESKRIPSI-Pembelajaran.git)
cd AI-GENERATE-DESKRIPSI-Pembelajaran
Instal semua dependensi Python yang dibutuhkan:

pip install -r requirements.txt
3. Konfigurasi Environment Variables
Buat file bernama .env di direktori utama proyek, lalu masukkan API Key Gemini kamu:

GEMINI_API_KEY=masukkan_api_key_gemini_kamu_di_sini

4. Menjalankan Server
Jalankan backend server (FastAPI) menggunakan Uvicorn:

cd api
uvicorn main:app --reload
Server backend akan berjalan di http://127.0.0.1:8000.

Selanjutnya, buka file public/index.html menggunakan ekstensi Live Server di VS Code untuk menjalankan antarmuka frontend-nya.

Catatan: Jangan lupa sesuaikan URL fetch di file script.js dari /api/generate-kbc menjadi http://127.0.0.1:8000/api/generate-kbc khusus saat masa pengembangan lokal.

👨‍💻 Author
Ulung Putra Sadewo
Software Engineering Undergraduate Student
