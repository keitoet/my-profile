// 🌟 あなたのスプレッドシートIDをここに貼り付けてね！
const SPREADSHEET_ID = '1c6iBycArcX-3AwtFvb110x0tv0Zxo3puU09WLRGavUI';
const SHEET_URL = `https://google.com{SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

function loadStatusFromSheet() {
    const avatarContainer = document.getElementById('avatarContainer');
    const statusBadge = document.getElementById('statusBadge');
    const tagsContainer = document.getElementById('tagsContainer');
    const emergencyAlert = document.getElementById('emergencyAlert');

    fetch(SHEET_URL)
        .then(res => res.text())
        .then(text => {
            const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
            const json = JSON.parse(jsonString);
            const rows = json.table.rows;
            
            // 💡 3行目のデータをピンポイントで指定して取得します
            if (!rows || rows.length < 2) return;
            const cols = rows[1].c; 

            // 💡 スプレッドシートの列（B列〜E列）に完全に合わせました
            const statusText = cols[1] ? cols[1].v : '';     // B列：話せるかどうか
            const tagsText = cols[2] ? cols[2].v : '';       // C列：タグ
            const alertText = cols[3] ? cols[3].v : '';      // D列：アラート
            const alertUrlText = cols[4] ? cols[4].v : '';   // E列：url

            const isOnline = (statusText === '話せる');
            const tagsArray = tagsText ? tagsText.toString().split(',').map(t => t.trim()) : [];

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

            if (tagsContainer && tagsArray.length > 0) {
                tagsContainer.innerHTML = tagsArray.map(tag => `<span class="status-tag">#${tag}</span>`).join('');
            } else if (tagsContainer) {
                tagsContainer.innerHTML = '';
            }
            
            if (emergencyAlert) {
                if (alertText && alertText.toString().trim() !== "") {
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

function openQrModal() {
    document.getElementById('qrModal').style.display = 'flex';
}
function closeQrModal() {
    document.getElementById('qrModal').style.display = 'none';
}
