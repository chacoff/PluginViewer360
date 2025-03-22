let viewer, panorama;
let uploadedImage = "";

const dropZone = document.getElementById("dropZone");
const clickToUpload = document.getElementById("clickToUpload");

clickToUpload.addEventListener("click", () => {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none"; // Hide the input

    fileInput.addEventListener("change", (event) => {
        handleFileUpload(event.target.files[0]);
        fileInput.remove(); // Clean up after selection
    });

    document.body.appendChild(fileInput);
    fileInput.click();
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "blue";
    dropZone.style.background = "#e0f7fa";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "#ccc";
    dropZone.style.background = "#f9f9f9";
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#ccc";
    dropZone.style.background = "#f9f9f9";

    let file = e.dataTransfer.files[0];
    handleFileUpload(file);
});

// Handle File Upload
function handleFileUpload(file) {
    if (!file || !file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        return;
    }

    let reader = new FileReader();
    reader.onload = function(event) {
        uploadedImage = event.target.result; // Store Base64 image URL
        openViewer();
    };
    reader.readAsDataURL(file);
}

function openViewer() {

    if (!uploadedImage) {
        alert("No image uploaded. Please drag and drop an image first.");
        return;
    }

    document.getElementById('viewer-container').style.display = 'block';
    document.getElementById('closeButton').style.display = 'block';

    // Hide navbar and sidebar
    let topNav = document.getElementById("navbar-top");
    let sidebar = document.querySelector(".navbar-default.sidebar");

    if (topNav) topNav.style.display = "none";
    if (sidebar) sidebar.style.display = "none";

    document.documentElement.requestFullscreen();

    setTimeout(() => {
        if (typeof PANOLENS === 'undefined' || typeof THREE === 'undefined') {
            document.getElementById('status').textContent = "Error: Libraries not loaded";
            return;
        }
        initPanorama();
        }, 500);
}

function initPanorama() {
    const status = document.getElementById('status');
    status.textContent = "Libraries loaded, setting up panorama...";

    if (!viewer) {
        viewer = new PANOLENS.Viewer({
            container: document.querySelector('#viewer'),
            controlBar: true
        });
    }

    if (panorama) {
        viewer.remove(panorama);
        panorama.dispose(); // Free memory
    }

    viewer.container.addEventListener("wheel", function (event) {
        event.preventDefault();
        viewer.camera.fov += event.deltaY * 0.05; // Invert the zoom direction
        viewer.camera.fov = Math.max(30, Math.min(90, viewer.camera.fov)); // Limit zoom range
        viewer.camera.updateProjectionMatrix();
    });

    panorama = new PANOLENS.ImagePanorama(uploadedImage);

    panorama.addEventListener('progress', function(e) {
        status.textContent = `Loading: ${Math.floor(e.progress * 100)}%`;
    });

    panorama.addEventListener('load', function() {
        status.textContent = "Panorama loaded!";
        setTimeout(() => status.style.opacity = 0, 3000);
    });

    panorama.addEventListener('error', function() {
        status.textContent = "Error loading panorama image";
    });

    viewer.add(panorama);
}

function closeViewer() {
    document.exitFullscreen();  // Exit Fullscreen
    document.getElementById('viewer-container').style.display = 'none';
    document.getElementById('closeButton').style.display = 'none';

    // Show navbar and sidebar again
    let topNav = document.getElementById("navbar-top");
    let sidebar = document.querySelector(".navbar-default.sidebar");

    if (topNav) topNav.style.display = "";
    if (sidebar) sidebar.style.display = "";
    uploadedImage = "";

    if (viewer && panorama) {
        viewer.remove(panorama);
        panorama.dispose();
        panorama = null;
    }
}