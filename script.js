const SPREADSHEET_ID = '1c6iBycArcX-3AwtFvb110x0tv0Zxo3puU09WLRGavUI';
// ://google.com が抜けてしまっていました！
const SHEET_URL = `https://://google.com${SPREADSHEET_ID}/export?format=csv`;


function showDebugOnScreen(title, content) {
    const emergencyAlert = document.getElementById('emergencyAlert');
    if (emergencyAlert) {
        emergencyAlert.innerHTML = `
            <div style="color: #1a202c; background: #fff0f0; padding: 15px; border: 2px solid red; font-size: 14px; text-align: left; font-weight: bold; line-height: 1.6;">
                <span style="color: red; font-size: 16px;">⚠️ ${title}</span><br><br>
                ⬇️ 【プログラムがGoogleから実際に受信した生データ】 ⬇️
                <pre style="background: #2d3748; color: #fff; padding: 10px; border-radius: 6px; overflow-x: auto; font-family: monospace; font-size: 12px; margin-top: 5px;">${content}</pre>
                <br>
                💡 もし上の黒い箱が空っぽ（何も書かれていない）なら、URLが開けていません。<br>
                シートのメニューから「ファイル」➔「共有」➔「ウェブに公開」をポチッと押して公開状態にしてください！
            </div>
        `;
        emergencyAlert.style.display = "block";
    }
}

function loadStatusFromSheet() {
    const avatarContainer = document.getElementById('avatarContainer');
    const statusBadge = document.getElementById('statusBadge');
    const tagsContainer = document.getElementById('tagsContainer');

    fetch(SHEET_URL)
        .then(res => {
            if (!res.ok) throw new Error(`通信エラー (HTTP: ${res.status})`);
            return res.text();
        })
        .then(csvText => {
            // 💡 通信が成功したら、届いた生テキストをそのまま画面の黒い箱の中に映し出します！
            showDebugOnScreen('URLの読み込み自体は成功しています！データの中身をチェック中...', csvText || '[空っぽです]');

            const lines = csvText.split('\n').map(line => line.split(','));
            if (!lines || lines.length < 3) return;
            
            const targetRow = lines[2];
            const cleanText = (val) => val ? val.replace(/^"|"$/g, '').trim() : '';

            const statusText = cleanText(targetRow[1]);   
            const tagsText = cleanText(targetRow[2]);     
            const alertText = cleanText(targetRow[3]);    
            const alertUrlText = cleanText(targetRow[4]); 

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
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showDebugOnScreen('通信そのものに失敗しました（URLが開けません）', error.message);
        });
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
