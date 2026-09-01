// 【重要】あなたのスプレッドシートIDに書き換えてください
const SPREADSHEET_ID = "1c6iBycArcX-3AwtFvb110x0tv0Zxo3puU09WLRGavUI";

function loadStatusFromJson() {
    // 画像に合わせて、B3セルからE3セルまでの範囲をピンポイントで取得します
    const sheetUrl = `https://google.com{SPREADSHEET_ID}/gviz/tq?range=B3:E3&tqx=out:json`;

    fetch(sheetUrl)
        .then(response => response.text())
        .then(text => {
            const json = JSON.parse(text.substring(47, text.length - 2));
            const row = json.table.rows[0]; // 3行目のデータを取得
            
            // 各セルのデータを安全に抽出する補助関数
            const getVal = (index) => (row && row.c[index]) ? row.c[index].v : "";

            // --- 画像の列の並び順（B列〜E列）に完全に合わせました ---
            // B3セル: 「話せるかどうか」が「話せる」ならtrue
            const isOnline = (getVal(0) === "話せる"); 
            
            // C3セル: 「タグ」（カンマ区切り。画像だと「普通」が入っていますね）
            const rawTags = getVal(1);
            const tags = rawTags ? rawTags.split(",").map(t => t.trim()).filter(t => t) : [];
            
            // D3セル: 「アラート」
            const alert = getVal(2);
            
            // E3セル: 「url」
            const alertUrl = getVal(3);
            // -------------------------------------------------------------

            const avatarContainer = document.getElementById('avatarContainer');
            const statusBadge = document.getElementById('statusBadge');
            const tagsContainer = document.getElementById('tagsContainer');
            const emergencyAlert = document.getElementById('emergencyAlert');

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

            if (tagsContainer && tags.length > 0) {
                tagsContainer.innerHTML = tags.map(tag => `<span class="status-tag">#${tag}</span>`).join('');
            } else if (tagsContainer) {
                tagsContainer.innerHTML = ''; 
            }
            
            if (emergencyAlert) {
                if (alert && alert.trim() !== "") {
                    if (alertUrl) {
                        emergencyAlert.innerHTML = `<a href="${alertUrl}" style="color: inherit; text-decoration: none; display: block; width: 100%; height: 100%;">${alert}</a>`;
                    } else {
                        emergencyAlert.innerText = alert;
                    }
                    emergencyAlert.style.display = "block";
                } else {
                    emergencyAlert.style.display = "none";
                }
            }
        })
        .catch(error => console.error('Error loading status from Spreadsheet:', error));
}
