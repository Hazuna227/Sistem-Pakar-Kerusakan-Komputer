// Data definitions
const symptoms = [
    { kode: 'G01', gejala: 'Komputer tidak menyala' },
    { kode: 'G02', gejala: 'Layar tidak menampilkan gambar' },
    { kode: 'G03', gejala: 'Komputer sering restart sendiri' },
    { kode: 'G04', gejala: 'Komputer berjalan lambat' },
    { kode: 'G05', gejala: 'Suara beep saat startup' },
    { kode: 'G06', gejala: 'Blue Screen of Death (BSOD)' },
    { kode: 'G07', gejala: 'Kipas komputer berisik' },
    { kode: 'G08', gejala: 'Harddisk berbunyi keras' },
    { kode: 'G09', gejala: 'Komputer overheat' },
    { kode: 'G10', gejala: 'Program sering not responding' }
];

const diagnoses = [
    { kode: 'K01', kerusakan: 'Power supply bermasalah' },
    { kode: 'K02', kerusakan: 'RAM bermasalah' },
    { kode: 'K03', kerusakan: 'Motherboard rusak' },
    { kode: 'K04', kerusakan: 'Kartu grafis bermasalah' },
    { kode: 'K05', kerusakan: 'CPU overheat' },
    { kode: 'K06', kerusakan: 'Harddisk rusak' },
    { kode: 'K07', kerusakan: 'Driver tidak kompatibel atau rusak' },
    { kode: 'K08', kerusakan: 'Virus atau malware' },
    { kode: 'K09', kerusakan: 'Kipas pendingin rusak' },
    { kode: 'K10', kerusakan: 'BIOS bermasalah' },
    { kode: 'K11', kerusakan: 'Kabel longgar atau rusak' }
];

const rules = [
    { gejala: ['G01'], kerusakan: ['K01', 'K03'] },
    { gejala: ['G02'], kerusakan: ['K04', 'K11'] },
    { gejala: ['G03', 'G09'], kerusakan: ['K05'] },
    { gejala: ['G04', 'G10'], kerusakan: ['K02', 'K08'] },
    { gejala: ['G05'], kerusakan: ['K02', 'K03', 'K10'] },
    { gejala: ['G07', 'G09'], kerusakan: ['K09'] },
    { gejala: ['G08'], kerusakan: ['K06'] }
];

// Ambil elemen-elemen yang diperlukan
const sidebar = document.getElementById('sidebar');
const toggleButton = document.getElementById('toggleSidebar');

// Tambahkan event listener untuk toggle button
toggleButton.addEventListener('click', function() {
    sidebar.classList.toggle('open');
});

// Function to toggle visibility of content sections
function toggleSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('show');
    });
    const section = document.getElementById(sectionId);
    section.classList.add('show');

    if (sectionId === 'home') {
        showHomeData();
    } else if (sectionId === 'symptoms') {
        showSymptoms();
    } else if (sectionId === 'diagnoses') {
        showDiagnoses();
    } else if (sectionId === 'rules') {
        showRules();
    } else if (sectionId === 'checkSymptoms') {
        populateSymptomCheckboxes();
    } else if (sectionId === 'about') {
        showabout(); 
    }
}

function showHomeData() {
    clearDataSummary();
    const dataSummary = document.getElementById('dataSummary');
    dataSummary.innerHTML = `
        <div class="summary-box">
            <h3>Total Data Gejala: ${symptoms.length}</h3>
        </div>
        <div class="summary-box">
            <h3>Total Data Kerusakan: ${diagnoses.length}</h3>
        </div>
        <div class="summary-box">
            <h3>Total Aturan Base: ${rules.length}</h3>
        </div>
    `;
}
function showSymptoms() {
    clearDataSummary();
    const tableBody = document.getElementById('symptomsTableBody');
    tableBody.innerHTML = '';
    symptoms.forEach((symptom, index) => {
        const row = `<tr><td>${index + 1}</td><td>${symptom.kode}</td><td>${symptom.gejala}</td></tr>`;
        tableBody.innerHTML += row;
    });
}

function showDiagnoses() {
    clearDataSummary();
    const tableBody = document.getElementById('diagnosesTableBody');
    tableBody.innerHTML = '';
    diagnoses.forEach((diagnose, index) => {
        const row = `<tr><td>${index + 1}</td><td>${diagnose.kode}</td><td>${diagnose.kerusakan}</td></tr>`;
        tableBody.innerHTML += row;
    });
}

function showRules() {
    clearDataSummary();
    const tableBody = document.getElementById('rulesTableBody');
    tableBody.innerHTML = '';
    rules.forEach((rule, index) => {
        const gejalaStr = rule.gejala.join(' AND ');
        const kerusakanStr = rule.kerusakan.join(' OR ');
        const row = `<tr><td>${index + 1}</td><td>IF (${gejalaStr}) THEN (${kerusakanStr})</td></tr>`;
        tableBody.innerHTML += row;
    });
}

function clearDataSummary() {
    const dataSummary = document.getElementById('dataSummary');
    dataSummary.innerHTML = '';
}

function populateSymptomCheckboxes() {
    const checkboxesDiv = document.getElementById('checkboxes');
    checkboxesDiv.innerHTML = '';
    symptoms.forEach(symptom => {
        const checkbox = `
            <label>
                <input type="checkbox" name="selectedSymptoms" value="${symptom.kode}">
                ${symptom.kode}: ${symptom.gejala}
            </label><br>
        `;
        checkboxesDiv.innerHTML += checkbox;
    });
}

// Function to handle form submission for symptom checking
document.getElementById('symptomForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const selectedSymptoms = Array.from(document.querySelectorAll('#symptomForm input[name="selectedSymptoms"]:checked'))
                                 .map(checkbox => checkbox.value);

    if (selectedSymptoms.length === 0) {
        alert('Pilih setidaknya satu gejala.');
        return;
    }

    const matchedDiagnoses = [];
    rules.forEach(rule => {
        if (rule.gejala.every(g => selectedSymptoms.includes(g))) {
            rule.kerusakan.forEach(k => {
                if (!matchedDiagnoses.includes(k)) {
                    matchedDiagnoses.push(k);
                }
            });
        }
    });

    displayResult(matchedDiagnoses);
});

// Function to display result of symptom checking
function displayResult(matchedDiagnoses) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';
    
    if (matchedDiagnoses.length > 0) {
        resultContainer.innerHTML = '<h3>Kerusakan yang mungkin:</h3>';
        matchedDiagnoses.forEach(k => {
            const diagnosis = diagnoses.find(d => d.kode === k);
            if (diagnosis) {
                resultContainer.innerHTML += `<p>${diagnosis.kode}: ${diagnosis.kerusakan}</p>`;
            }
        });
    } else {
        resultContainer.innerHTML = '<p>Tidak ditemukan kerusakan yang sesuai dengan gejala yang dipilih.</p>';
    }
}
