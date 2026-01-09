import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBBGr000pSogCJdQR9f0-6Kjb33ZyhbtF0",
    authDomain: "notyy-ai.firebaseapp.com",
    projectId: "notyy-ai",
    storageBucket: "notyy-ai.firebasestorage.app",
    messagingSenderId: "574390094806",
    appId: "1:574390094806:web:aa5ba964fbb5326796f277"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM Elemente
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');

// --- AUTHENTIFIKATION ---
loginBtn.onclick = () => signInWithPopup(auth, provider);
logoutBtn.onclick = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
    if (user) {
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
        document.getElementById('user-info').innerText = `Hallo, ${user.displayName}`;
    } else {
        authContainer.style.display = 'block';
        appContainer.style.display = 'none';
    }
});

// --- NOTENVERWALTUNG ---
let grades = [];
window.addGrade = () => {
    const sub = document.getElementById('subject').value;
    const grd = parseFloat(document.getElementById('grade').value);
    if(sub && grd) {
        grades.push({sub, grd});
        renderGrades();
    }
};

function renderGrades() {
    const list = document.getElementById('grade-list');
    list.innerHTML = grades.map(g => `<li>${g.sub}: ${g.grd}</li>`).join('');
    const avg = grades.reduce((acc, curr) => acc + curr.grd, 0) / grades.length;
    document.getElementById('average').innerText = avg.toFixed(2);
}

// --- GEMINI KI FUNKTION ---
window.askGemini = async () => {
    const input = document.getElementById('ai-input').value;
    const output = document.getElementById('chat-output');
    const apiKey = "DEIN_GEMINI_API_KEY"; // HIER KEY EINSETZEN

    output.innerHTML += `<p><b>Du:</b> ${input}</p>`;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Ich habe folgende Noten: ${JSON.stringify(grades)}. Frage: ${input}` }] }]
            })
        });
        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;
        output.innerHTML += `<p><b>Gemini:</b> ${aiText}</p>`;
    } catch (e) {
        output.innerHTML += `<p style="color:red">Fehler: API Key ungültig oder Limit erreicht.</p>`;
    }
};
