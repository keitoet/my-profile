function loadStatusFromJson() {
    fetch('status.json')
        .then(response => response.json())
        .then(data => {
            const avatarContainer = document.getElementById('avatarContainer');
            const statusBadge = document.getElementById('statusBadge');
            const tagsContainer = document.getElementById('tagsContainer');
            const emergencyAlert = document.getElementById('emergencyAlert');

            if (data.isOnline) {
                avatarContainer.className = "avatar-container online";
                statusBadge.innerHTML = '<span class="dot"></span>はなせる';
            } else {
                avatarContainer.className = "avatar-container offline";
                statusBadge.innerHTML = '<span class="dot"></span>ねてる';
            }

            if (data.tags) {
                tagsContainer.innerHTML = data.tags.map(tag => `<span class="status-tag">#${tag}</span>`).join('');
            }
            
            if (emergencyAlert) {
                if (data.alert && data.alert.trim() !== "") {
                    emergencyAlert.innerText = data.alert;
                    emergencyAlert.style.display = "block";
                } else {
                    emergencyAlert.style.display = "none";
                }
            }
            
            if (avatarContainer) {
                avatarContainer.style.opacity = "1";
            }
        })
        .catch(error => console.error('Error loading status:', error));
}

function loadNewsFromJson() {
    fetch('news.json')
        .then(response => response.json())
        .then(data => {
            const newsList = document.getElementById('newsList');
            if (newsList && data) {
                newsList.innerHTML = data.map(item => `
                    <li>
                        <span class="notice-date">${item.date}</span>
                        <span class="notice-text">${item.text}</span>
                    </li>
                `).join('');
            }
        })
        .catch(error => console.error('Error loading news:', error));
}

window.addEventListener('DOMContentLoaded', () => {
    loadStatusFromJson();
    loadNewsFromJson();
});

function openQrModal() {
    document.getElementById('qrModal').style.display = 'flex';
}
function closeQrModal() {
    document.getElementById('qrModal').style.display = 'none';
}
