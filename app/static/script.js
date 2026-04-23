document.addEventListener('DOMContentLoaded', () => {
    console.log("AudioFlow Engine Loaded")
})

function getUrl() {
    /** @type {HTMLInputElement} */
    const urlInput = document.getElementById('musicUrl');
    if (!urlInput) return null;

    const val = urlInput.value.trim();
    if (!val) {
        alert("Please paste a URL");
        return null;
    }
    return encodeURIComponent(val);
}

window.onload = () => {
    console.log("AudioFlow Engine: Status OK");
};

function playMusic() {
    const inputEl = document.getElementById('musicUrl');
    if (!inputEl) {
        console.error("Error: Input 'musicUrl' is undefined or not found in HTML.");
        return;
    }

    const rawUrl = inputEl.value.trim();
    if (!rawUrl) {
        alert("Please paste a link first!");
        return;
    }

    const encodedUrl = encodeURIComponent(rawUrl);

    /** @type {HTMLInputElement} */
    const audioPlayer = document.getElementById('audioPlayer');
    const playerContainer = document.getElementById('playerContainer');
    const statusText = document.getElementById('statusText');

    if (!audioPlayer) {
        console.error("Could mot find the audio element in html");
        return;
    }
    
    playerContainer.style.display = 'block';
    statusText.innerText = "Buffering stream...";

    // MUST match your FastAPI route exactly (e.g., /api/stream)
    audioPlayer.src = `/stream?url=${encodedUrl}`;
    console.log("Attempying to load:", audioPlayer.src);
    
    audioPlayer.load();
    
    audioPlayer.play()
        .then(() => {
            statusText.innerText = "Now Playing 🎵";
        })
        .catch(err => {
            statusText.innerText = "Error playing stream. Check URL.";
            console.error(err);
        });
}

function downloadMusic() {
    const inputEl = document.getElementById('musicUrl');
    if (inputEl && inputEl.value){
        const encodedUrl = encodeURIComponent(inputEl.value.trim());
        window.location.href = `/download?url=${encodedUrl}`;
    }

    const btn = document.querySelector('.btn-secondary'); 
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="ph ph-spinner gap-icon"></i> Preparing...';
    btn.disabled = true;

    const encodedUrl = getUrl();
    if (!encodedUrl) {
        window.location.href = `/download?url=${encodedUrl}&filename=AudioFlow_Download.mp3`;
    }

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 3000);
    
    // Create a hidden 'a' element
    const link = document.createElement('a');
    link.href = downloadEndpoint;
    
    // This attribute tells the browser to DOWNLOAD instead of NAVIGATE
    link.setAttribute('download', 'AudioFlow_Download.mp3');
    
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up
}