function loadStatusFromJson() {
    fetch('/my-profile/status.json')
        .then(response => response.json())
        .then(data => {
            const avatarContainer = document.getElementById('avatarContainer');
            const statusBadge = document.getElementById('statusBadge');
            const tagsContainer = document.getElementById('tagsContainer');
            const emergencyAlert = document.getElementById('emergencyAlert');

            if (avatarContainer && statusBadge) {
                if (data.isOnline) {
                    avatarContainer.className = "avatar-container online";
                    statusBadge.innerHTML = '<span class="dot"></span>話せます';
                } else {
                    avatarContainer.className = "avatar-container offline";
                    statusBadge.innerHTML = '<span class="dot"></span>話せない';
                }
                avatarContainer.style.opacity = "1";
            }

            if (tagsContainer && data.tags) {
                tagsContainer.innerHTML = data.tags.map(tag => `<span class="status-tag">#${tag}</span>`).join('');
            }
            
            if (emergencyAlert) {
                if (data.alert && data.alert.trim() !== "") {
                    if (data.alertUrl) {
                        emergencyAlert.innerHTML = `<a href="${data.alertUrl}" style="color: inherit; text-decoration: none; display: block; width: 100%; height: 100%;">${data.alert}</a>`;
                    } else {
                        emergencyAlert.innerText = data.alert;
                    }
                    emergencyAlert.style.display = "block";
                } else {
                    emergencyAlert.style.display = "none";
                }
            }
        })
        .catch(error => console.error('Error loading status:', error));
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
    loadStatusFromJson();
    loadNewsFromJson();
});

function openQrModal() {
    document.getElementById('qrModal').style.display = 'flex';
}
function closeQrModal() {
    document.getElementById('qrModal').style.display = 'none';
}


function loadStatusFromMicroCMS() { // ※関数名は何でも大丈夫です
    const avatarContainer = document.getElementById('avatarContainer');
    const statusBadge = document.getElementById('statusBadge');
    const tagsContainer = document.getElementById('tagsContainer');
    const emergencyAlert = document.getElementById('emergencyAlert');

    // 🌟【ここがポイント！】入力フォーム（edit.html）で変更されたデータがあるかチェックする
    const localData = localStorage.getItem('my_web_status');
    
    if (localData) {
        // 入力フォームで変更されていたら、そのデータをそのまま画面に使う（即反映！）
        const data = JSON.parse(localData);
        applyStatusToHtml(data);
    } else {
        // まだ一度も入力フォームで変更されていなければ、元のstatus.jsonを読み込む
        fetch('./status.json')
            .then(response => response.json())
            .then(data => {
                applyStatusToHtml(data);
            })
            .catch(error => console.error('Error loading status:', error));
    }

    // HTMLにデータを流し込む共通の処理
    function applyStatusToHtml(data) {
        if (avatarContainer && statusBadge) {
            if (data.isOnline) {
                avatarContainer.className = "avatar-container online";
                statusBadge.innerHTML = '<span class="dot"></span>話せます';
            } else {
                avatarContainer.className = "avatar-container offline";
                statusBadge.innerHTML = '<span class="dot"></span>話せない';
            }
            avatarContainer.style.opacity = "1";
        }

        if (tagsContainer && data.tags) {
            tagsContainer.innerHTML = data.tags.map(tag => `<span class="status-tag">#${tag}</span>`).join('');
        }
        
        if (emergencyAlert) {
            if (data.alert && data.alert.trim() !== "") {
                if (data.alertUrl) {
                    emergencyAlert.innerHTML = `<a href="${data.alertUrl}" style="color: inherit; text-decoration: none; display: block; width: 100%; height: 100%;">${data.alert}</a>`;
                } else {
                    emergencyAlert.innerText = data.alert;
                }
                emergencyAlert.style.display = "block";
            } else {
                emergencyAlert.style.display = "none";
            }
        }
    }
}
