document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const lightModeButton = document.getElementById('light-mode');
    const darkModeButton = document.getElementById('dark-mode');
    const blueModeButton = document.getElementById('blue-mode');
    const playPauseButton = document.getElementById('play-pause-btn');
    const prevTrackButton = document.getElementById('prev-track-btn');
    const nextTrackButton = document.getElementById('next-track-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeControl = document.getElementById('volume-control');
    const audioPlayer = document.getElementById('audio-player');
    const trackTitle = document.getElementById('current-track-title');
    const albums = document.querySelectorAll('.album');
    const startButton = document.getElementById('start-btn');
    const restartButton = document.getElementById('restart-btn');
    const canvas = document.getElementById('waveform-canvas');
    const canvasCtx = canvas.getContext('2d');

    // Section Elements
    const section1 = document.getElementById('section1');
    const section2 = document.getElementById('section2');
    const section3 = document.getElementById('section3');

    // Audio Variables
    let isPlaying = false;
    let audioContext, analyser, dataArray, bufferLength, source;
    let currentTrackIndex = 0;

// Example track list
const trackList = [
    { title: "Justin Bieber - Intentions ft. Quavo", src: "/assets/Justin Bieber - Intentions ft. Quavo.mp3" },
    { title: "Justin Bieber - Yummy", src: "/assets/Justin Bieber - Yummy.mp3" },
    { title: "Justin Bieber - Love Yourself", src: "/assets/justin_bieber_love_yourself.mp3" },
    { title: "JustinBillie-Eilish-x-Khalid-Lovely mp3", src: "/assets/Billie-Eilish-x-Khalid-Lovely-via-Naijafinix.com_.mp3" },
    { title: "Alan_Walker_Alone mp3", src: "/assets/Alan_Walker_Alone.mp3" },
    { title: "Chris_Brown_ft_Lil_Baby_-_Addicted mp3", src: "/assets/Chris_Brown_ft_Lil_Baby_-_Addicted_360media.com.ng.mp3" },
    { title: "Ed Sheeran & Justin Bieber - I Don t Care mp3", src: "/assets/Ed Sheeran & Justin Bieber - I Don t Care [Official].mp3" },
    { title: "Ed_Sheeran_-_Shape_Of_You mp3", src: "/assets/Ed_Sheeran_-_Shape_Of_You_Official_Lyric_Video.imack_.co_.mp3" },
    { title: "Ed_Sheeran_Afire_Love mp3", src: "/assets/Ed_Sheeran_Afire_Love.mp3"},
    { title: "Juice WRLD - Legends mp3", src: "/assets/Juice WRLD - Legends (Official Audio).mp3"},
    { title: "Justin-Bieber-Ghost mp3", src: "/assets/Justin-Bieber-Ghost.mp3"},
    { title: "justin_bieber_sorry mp3", src: "/assets/justin_bieber_sorry.mp3"},
    { title: "Sia - Chandelie mp3", src: "/assets/Sia - Chandelie [128].mp3"}
];
    // Initialize Web Audio API for waveform visualization
    function initializeAudioContext() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaElementSource(audioPlayer);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;

        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }

    function drawWaveform() {
        requestAnimationFrame(drawWaveform);

        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = '#8f8f8f';
        canvasCtx.beginPath();

        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * canvas.height / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    }

    // Function to load and play a track
    function loadTrack(index) {
        const track = trackList[index];
        audioPlayer.src = track.src;
        trackTitle.textContent = `Current Track: ${track.title}`;
        audioPlayer.play();
        playPauseButton.textContent = 'Pause';
        isPlaying = true;
    }

        // Play the next track automatically when the current track ends
        audioPlayer.addEventListener('ended', () => {
            if (currentTrackIndex < trackList.length - 1) {
                currentTrackIndex++;
                loadTrack(currentTrackIndex);
            } else {
                currentTrackIndex = 0; // Optionally, loop back to the first track
                loadTrack(currentTrackIndex);
            }
        });

    // Update progress bar as the audio plays
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;
    });

    // Update audio current time when progress bar is changed
    progressBar.addEventListener('input', () => {
        const time = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = time;
    });

    // Control volume
    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value / 100;
    });

    // Play/Pause control
    playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            audioPlayer.pause();
            playPauseButton.textContent = 'Play';
        } else {
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        }
        isPlaying = !isPlaying;
    });

    // Next track control
    nextTrackButton.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
        loadTrack(currentTrackIndex);
    });

    // Previous track control
    prevTrackButton.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
        loadTrack(currentTrackIndex);
    });

    // Theme switching
    lightModeButton.addEventListener('click', () => {
        document.body.className = 'light-mode';
    });

    darkModeButton.addEventListener('click', () => {
        document.body.className = 'dark-mode';
    });

    blueModeButton.addEventListener('click', () => {
        document.body.className = 'blue-mode';
    });

    // Album click event to play track
    albums.forEach(album => {
        album.addEventListener('click', () => {
            const src = album.getAttribute('data-src');
            const title = album.querySelector('p').textContent;
            audioPlayer.src = src;
            trackTitle.textContent = `Current Track: ${title}`;
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
            isPlaying = true;
        });
    });

    // Start button to initialize and begin waveform visualization
    startButton.addEventListener('click', () => {
        initializeAudioContext();
        drawWaveform();
        switchSection(section2);
    });

    // Restart button to reset the app
    restartButton.addEventListener('click', () => {
        audioPlayer.pause();
        playPauseButton.textContent = 'Play';
        isPlaying = false;
        // Go back to section 1
        switchSection(section1);
    });

    // Function to switch between sections
    function switchSection(nextSection) {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        nextSection.style.display = 'block';
    }

    // Example condition to move to section 2 after a track finishes
    audioPlayer.addEventListener('ended', () => {
        if (currentTrackIndex === trackList.length - 1) {
            // If the last track finishes, move to section 2
            switchSection(section2);
        }
    });

    // Another condition example to move to section 3 based on a different criterion
    // Replace with your condition
    setTimeout(() => {
        if (true) { // Replace with actual condition
            switchSection(section3);
        }
    }, 1000); // Simulate after 5 seconds for demo purposes
});
