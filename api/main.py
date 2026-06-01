from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import os

from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="API Deskripsi KBC")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mengambil API Key dari Environment Variable server
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("API Key Gemini tidak ditemukan!")
client = genai.Client(api_key=GEMINI_API_KEY)

class KBCRequest(BaseModel):
    mata_pelajaran: str
    fase: str
    tujuan: str
    cinta: list[str]
    dimensi: list[str]

@app.post("/api/generate-kbc")
async def generate_kbc(request: KBCRequest):
    try:
        cinta_text = ", ".join(request.cinta) if request.cinta else "kebaikan"
        dimensi_text = ", ".join(request.dimensi) if request.dimensi else "karakter luhur"
        
        prompt = f"""
        Buatkan 3 variasi Tujuan Pembelajaran yang berbeda berdasarkan data berikut:
        - Mata Pelajaran: {request.mata_pelajaran}
        - Fase/Kelas: {request.fase}
        - Materi Pokok: {request.tujuan}
        - Nilai Panca Cinta: {cinta_text}
        - Dimensi Profil Lulusan (DPL): {dimensi_text}

        ATURAN GAYA BAHASA:
        - Langsung to the point, awali kalimat dengan kata kerja operasional (Mampu memahami.... atau Murid mampu...).
        - Integrasikan nilai karakter dengan natural di tengah kalimat (misal: "...sebagai bentuk rasa Cinta...").
        - Hubungkan pemahaman teori dengan praktik di kehidupan sehari-hari.
        - Variasi 1: Kalimat detail dan komprehensif serta ringkas dan padat.
        - Variasi 2: Kalimat lebih mengalir (seperti bercerita). namun tetap padat dan jelas.
        - Variasi 3: Kalimat lebih ringkas dan padat.

        ATURAN FORMAT OUTPUT:
        Hanya berikan 3 paragraf hasil jadinya. 
        Pisahkan masing-masing variasi dengan tepat tiga garis vertikal: |||
        Jangan tambahkan kata pengantar apapun, jangan gunakan penomoran 1,2,3.
        """
        
        # --- STRATEGI 4 NYAWA ANTI-LIMIT ---
        daftar_model = [
            'gemini-3.1-flash-lite',
            'gemini-3.5-flash',
            'gemini-3-flash',
            'gemini-2.5-flash'
        ]
        
        response = None
        error_terakhir = None

        for nama_model in daftar_model:
            try:
                print(f"Mencoba generate menggunakan {nama_model}...")
                response = client.models.generate_content(
                    model=nama_model,
                    contents=prompt,
                )
                print(f"Sukses! Berhasil menggunakan model: {nama_model}")
                break  
            except Exception as e:
                error_terakhir = e
                print(f"Model {nama_model} gagal/limit. Beralih ke model berikutnya...")

        if response is None:
            raise Exception(f"Semua model Gemini sibuk/limit. Error: {error_terakhir}")
        
        # --- MEMECAH RESPONS AI ---
        hasil_teks = response.text
        variasi_list = [teks.strip() for teks in hasil_teks.split('|||') if teks.strip()]
        
        if len(variasi_list) == 0:
            variasi_list = [hasil_teks.strip()]

        return {"deskripsi_ai": variasi_list}
        
    except Exception as e:
        print(f"\n[!] ERROR DARI GEMINI: {str(e)}\n") 
        raise HTTPException(status_code=500, detail=str(e))