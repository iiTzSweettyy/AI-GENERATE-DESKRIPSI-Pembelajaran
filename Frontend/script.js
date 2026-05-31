let selectedCinta = [];
let selectedDimensi = [];

function toggleSelection(element, type) {
    element.classList.toggle('selected');
    const value = element.innerText;

    if (type === 'cinta') {
        if (selectedCinta.includes(value)) {
            selectedCinta = selectedCinta.filter(item => item !== value);
        } else {
            selectedCinta.push(value);
        }
    } else if (type === 'dimensi') {
        if (selectedDimensi.includes(value)) {
            selectedDimensi = selectedDimensi.filter(item => item !== value);
        } else {
            selectedDimensi.push(value);
        }
    }
}

function resetForm() {
    document.getElementById('mapel').value = "";
    document.getElementById('fase').value = "";
    document.getElementById('tujuan').value = "";

    selectedCinta = [];
    selectedDimensi = [];

    const pills = document.querySelectorAll('.pill');
    pills.forEach(pill => {
        pill.classList.remove('selected');
    });

    const outputElement = document.getElementById('hasil-output');
    outputElement.className = 'text-sm text-gray-600 italic';
    outputElement.innerHTML = 'Output AI akan muncul di sini...';
}

// Fitur baru: Menyalin teks ke clipboard
function salinTeks(buttonElement, teks) {
    navigator.clipboard.writeText(teks).then(() => {
        const teksAsli = buttonElement.innerText;
        buttonElement.innerText = "Tersalin! ✓";
        buttonElement.classList.add('bg-green-600', 'text-white');
        buttonElement.classList.remove('bg-gray-200', 'text-gray-800');
        
        setTimeout(() => {
            buttonElement.innerText = teksAsli;
            buttonElement.classList.remove('bg-green-600', 'text-white');
            buttonElement.classList.add('bg-gray-200', 'text-gray-800');
        }, 2000);
    });
}

async function generateDeskripsi() {
    const mapel = document.getElementById('mapel').value; 
    const fase = document.getElementById('fase').value;
    const tujuan = document.getElementById('tujuan').value;
    const btnGenerate = document.getElementById('btn-generate');
    const outputElement = document.getElementById('hasil-output');

    if (!mapel || !fase || !tujuan) {
        alert("Harap isi Mata Pelajaran, Fase, dan Tujuan Pembelajaran terlebih dahulu!");
        return;
    }

    btnGenerate.disabled = true;
    btnGenerate.innerText = "Memproses dengan AI...";
    outputElement.classList.remove('italic', 'text-gray-600', 'text-red-600');
    outputElement.classList.add('text-gray-800');
    outputElement.innerHTML = `<div class="flex justify-center items-center py-4"><em>Sedang meracik variasi deskripsi...</em></div>`;

    const payload = {
        mata_pelajaran: mapel,
        fase: fase,
        tujuan: tujuan,
        cinta: selectedCinta,
        dimensi: selectedDimensi
    };

    try {
        const response = await fetch('http://localhost:8000/api/generate-kbc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const arrayVariasi = data.deskripsi_ai;
        
        // Membersihkan kontainer sebelum diisi hasil baru
        outputElement.innerHTML = ""; 

        // Membuat kotak (card) untuk setiap variasi yang diberikan AI
        arrayVariasi.forEach((teks, index) => {
            // Hilangkan tanda bintang markdown bawaan AI (jika ada)
            const cleanTeks = teks.replace(/\*/g, ''); 
            
            const divOption = document.createElement('div');
            divOption.className = "bg-white border border-gray-300 p-4 rounded-xl mb-3 shadow-sm";
            divOption.innerHTML = `
                <h4 class="font-bold text-teal-700 mb-2">Opsi ${index + 1}</h4>
                <p class="text-gray-700 text-sm mb-4 leading-relaxed">${cleanTeks}</p>
                <button onclick="salinTeks(this, \`${cleanTeks.replace(/"/g, '&quot;')}\`)" class="w-full text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition duration-200">
                    Salin Opsi ${index + 1}
                </button>
            `;
            outputElement.appendChild(divOption);
        });

    } catch (error) {
        console.error("Error fetching AI:", error);
        outputElement.classList.add('text-red-600');
        outputElement.innerHTML = `<strong>Detail Error AI:</strong> ${error.message}`;
    } finally {
        btnGenerate.disabled = false;
        btnGenerate.innerText = "Generate Tujuan Pembelajaran KBC";
    }
}