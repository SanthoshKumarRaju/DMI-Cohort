// Enhanced video player functionality
class VideoPlayer {
    constructor() {
        this.videos = document.querySelectorAll('video');
        this.init();
    }

    init() {
        this.videos.forEach(video => {
            this.addCustomControls(video);
            this.addProgressTracking(video);
            this.addKeyboardControls(video);
        });
    }

    addCustomControls(video) {
        // Create custom controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'custom-video-controls';
        controlsContainer.innerHTML = `
            <div class="controls-bar">
                <button class="control-btn play-pause" title="Play/Pause">
                    <i class="fas fa-play"></i>
                </button>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress"></div>
                    </div>
                </div>
                <div class="time-display">
                    <span class="current-time">0:00</span> / 
                    <span class="duration">0:00</span>
                </div>
                <button class="control-btn volume-btn" title="Volume">
                    <i class="fas fa-volume-up"></i>
                </button>
                <button class="control-btn fullscreen-btn" title="Fullscreen">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        `;

        // Insert controls after video
        video.parentNode.insertBefore(controlsContainer, video.nextSibling);

        // Get control elements
        const playPauseBtn = controlsContainer.querySelector('.play-pause');
        const progressBar = controlsContainer.querySelector('.progress');
        const progressContainer = controlsContainer.querySelector('.progress-container');
        const currentTimeEl = controlsContainer.querySelector('.current-time');
        const durationEl = controlsContainer.querySelector('.duration');
        const volumeBtn = controlsContainer.querySelector('.volume-btn');
        const fullscreenBtn = controlsContainer.querySelector('.fullscreen-btn');

        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        // Update progress bar
        video.addEventListener('timeupdate', () => {
            const percent = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${percent}%`;
            currentTimeEl.textContent = this.formatTime(video.currentTime);
        });

        // Set video duration
        video.addEventListener('loadedmetadata', () => {
            durationEl.textContent = this.formatTime(video.duration);
        });

        // Click on progress bar to seek
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            video.currentTime = percent * video.duration;
        });

        // Volume control
        volumeBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            volumeBtn.innerHTML = video.muted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        });

        // Fullscreen functionality
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                video.parentElement.requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable fullscreen: ${err.message}`);
                });
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            } else {
                document.exitFullscreen();
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            }
        });

        // Update play/pause button when video ends
        video.addEventListener('ended', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
    }

    addProgressTracking(video) {
        let progressData = {
            startTime: null,
            totalTime: 0,
            segments: []
        };

        video.addEventListener('play', () => {
            progressData.startTime = Date.now();
        });

        video.addEventListener('pause', () => {
            if (progressData.startTime) {
                const segmentTime = Date.now() - progressData.startTime;
                progressData.segments.push(segmentTime);
                progressData.totalTime += segmentTime;
                progressData.startTime = null;
            }
        });

        video.addEventListener('ended', () => {
            if (progressData.startTime) {
                const segmentTime = Date.now() - progressData.startTime;
                progressData.segments.push(segmentTime);
                progressData.totalTime += segmentTime;
            }
            
            // Log viewing statistics (could be sent to analytics)
            console.log('Video viewing statistics:', {
                totalViewingTime: progressData.totalTime,
                segments: progressData.segments.length,
                completion: (video.currentTime / video.duration) * 100
            });
        });
    }

    addKeyboardControls(video) {
        document.addEventListener('keydown', (e) => {
            if (document.activeElement !== video && !video.contains(document.activeElement)) {
                return;
            }

            switch(e.key) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    video.paused ? video.play() : video.pause();
                    break;
                case 'f':
                    e.preventDefault();
                    if (!document.fullscreenElement) {
                        video.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                    break;
                case 'm':
                    e.preventDefault();
                    video.muted = !video.muted;
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    video.currentTime = Math.max(0, video.currentTime - 5);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    video.currentTime = Math.min(video.duration, video.currentTime + 5);
                    break;
            }
        });
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize video players when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VideoPlayer();
});

// Add CSS for custom video controls
const videoControlsCSS = `
.custom-video-controls {
    background: rgba(0, 0, 0, 0.8);
    padding: 10px;
    border-radius: 0 0 8px 8px;
}

.controls-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
}

.control-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.control-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.progress-container {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    cursor: pointer;
    position: relative;
}

.progress-bar {
    height: 100%;
    border-radius: 3px;
    overflow: hidden;
}

.progress {
    height: 100%;
    background: #0078d4;
    width: 0%;
    transition: width 0.1s;
}

.time-display {
    font-size: 0.875rem;
    min-width: 80px;
    text-align: center;
}

.video-container video {
    border-radius: 8px 8px 0 0;
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = videoControlsCSS;
document.head.appendChild(styleSheet);