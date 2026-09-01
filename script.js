// 💡 慧斗くんのシートIDと、本物の正しいGoogleのURL（://google.com...）をガチッと合体させました！
const SHEET_URL = 'https://://google.com/spreadsheets/d/1c6iBycArcX-3AwtFvb110x0tv0Zxo3puU09WLRGavUI/export?format=csv';

function loadStatusFromSheet() {
    const avatarContainer = document.getElementById('avatarContainer');
    const statusBadge = document.getElementById('statusBadge');
    const tagsContainer = document.getElementById('tagsContainer');
    const emergencyAlert = document.getElementById('emergencyAlert');

    fetch(SHEET_URL)
        .then(res => {
            if (!res.ok) throw new Error('通信エラー');
            return res.text();
        })
        .then(csvText => {
            const lines = csvText.split('\n').map(line => line.split(','));
            if (!lines || lines.length < 3) return;
            
            const targetRow = lines[2]; // 💡 3行目のデータを正確に取得
            const cleanText = (val) => val ? val.replace(/^"|"$/g, '').trim() : '';

            const statusText = cleanText(targetRow[1]);   // B列：話せるかどうか
            const tagsText = cleanText(targetRow[2]);     // C列：タグ
            const alertText = cleanText(targetRow[3]);    // D列：アラート
            const alertUrlText = cleanText(targetRow[4]); // E列：url

            const isOnline = (statusText === '話せる');
            const tagsArray = tagsText ? tagsText.split('/').map(t => t.trim()) : [];

            if (avatarContainer && statusBadge) {
                if (isOnline) {
                    avatarContainer.className = "avatar-container online";
                    statusBadge.innerHTML = '<span class="dot"></span>話せます';
                } else {
                    avatarContainer.className = "avatar-container offline";
                    statusBadge.innerHTML = '<span class="dot"></span>話せない';
                }
                avatarContainer.style.opacity = "1";
            }

            if (tagsContainer && tagsArray.length > 0 && tagsArray[0] !== "") {
                tagsContainer.innerHTML = tagsArray.map(tag => `<span class="status-tag">#${tag}</span>`).join('');
            } else if (tagsContainer) {
                tagsContainer.innerHTML = '';
            }
            
            if (emergencyAlert) {
                if (alertText && alertText !== "") {
                    if (alertUrlText) {
                        emergencyAlert.innerHTML = `<a href="${alertUrlText}" style="color: inherit; text-decoration: none; display: block; width: 100%; height: 100%;">${alertText}</a>`;
                    } else {
                        emergencyAlert.innerText = alertText;
                    }
                    emergencyAlert.style.display = "block";
                } else {
                    emergencyAlert.style.display = "none";
                }
            }
        })
        .catch(error => console.error('Error loading status from Sheet:', error));
}

function loadNewsFromJson() {
    const newsList = document.getElementById('newsList');
    if (!newsList) return;
    fetch('/my-profile/news.json')
        .then(response => response.json())
        .then(data => {
            if (data) {
                newsList.innerHTML = data.map(item => `
                    <li>
                        <a href="${item.url}" style="text-decoration: none; color: inherit; display: block; width: 100%;">
                            ${item.date}　${item.text}
                        </a>
                    </li>
                `).join('');
            }
        })
        .catch(error => console.error('Error loading news:', error));
}

function loadSharedComponents() {
    fetch('/my-profile/shared.html')
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const headerEl = document.querySelector('header');
            const footerEl = document.querySelector('footer');
            const sharedHeader = doc.getElementById('commonHeader');
            const sharedFooter = doc.getElementById('commonFooter');
            if (headerEl && sharedHeader) headerEl.innerHTML = sharedHeader.innerHTML;
            if (footerEl && sharedFooter) footerEl.innerHTML = sharedFooter.innerHTML;
        })
        .catch(error => console.error('Error loading shared components:', error));
}

window.addEventListener('DOMContentLoaded', () => {
    loadSharedComponents();
    loadStatusFromSheet();
    loadNewsFromJson();
});

function openQrModal() { document.getElementById('qrModal').style.display = 'flex'; }
function closeQrModal() { document.getElementById('qrModal').style.display = 'none'; }
