// 音乐播放器状态管理
let currentTrack = null;
let isPlaying = false;
let currentPlaylist = [];

// 模拟音乐数据
const mockTracks = [
    {
        id: 1,
        title: 'My Stress',
        artist: 'NF Real music',
        duration: '3:22',
        cover: 'https://placehold.co/40x40',
        liked: true
    },
    {
        id: 2,
        title: 'Mirage',
        artist: 'Else Twin',
        duration: '4:23',
        cover: 'https://placehold.co/40',
        liked: false
    },
    {
        id: 3,
        title: 'The Hills',
        artist: 'The Weekend',
        duration: '5:33',
        cover: 'https://placehold.co/40',
        liked: false
    }
];

// 初始化播放列表
currentPlaylist = mockTracks;

// 播放控制功能
function togglePlay() {
    if (!currentTrack) {
        currentTrack = currentPlaylist[0];
    }
    isPlaying = !isPlaying;
    updatePlayButton();
    updateNowPlaying();
}

function playNext() {
    if (!currentTrack) return;
    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.length;
    currentTrack = currentPlaylist[nextIndex];
    updateNowPlaying();
}

function playPrevious() {
    if (!currentTrack) return;
    const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
    const previousIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    currentTrack = currentPlaylist[previousIndex];
    updateNowPlaying();
}

// UI更新函数
function updatePlayButton() {
    const playButton = document.querySelector('.player-controls button:nth-child(2)');
    if (playButton) {
        playButton.innerHTML = isPlaying 
            ? '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>'
            : '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>';
    }
}

function updateNowPlaying() {
    if (!currentTrack) return;

    const nowPlayingContainer = document.querySelector('.player-controls');
    if (nowPlayingContainer) {
        const titleElement = nowPlayingContainer.querySelector('h4');
        const artistElement = nowPlayingContainer.querySelector('p');
        const coverElement = nowPlayingContainer.querySelector('img');

        if (titleElement) titleElement.textContent = currentTrack.title;
        if (artistElement) artistElement.textContent = currentTrack.artist;
        if (coverElement) coverElement.src = currentTrack.cover;
    }
}

// 事件监听器设置
document.addEventListener('DOMContentLoaded', () => {
    // 播放控制按钮
    const playButton = document.querySelector('.player-controls button:nth-child(2)');
    const prevButton = document.querySelector('.player-controls button:nth-child(1)');
    const nextButton = document.querySelector('.player-controls button:nth-child(3)');

    if (playButton) playButton.addEventListener('click', togglePlay);
    if (prevButton) prevButton.addEventListener('click', playPrevious);
    if (nextButton) nextButton.addEventListener('click', playNext);

    // 初始化播放列表
    renderPlaylist();
});

// 渲染播放列表
function renderPlaylist() {
    const playlistContainer = document.querySelector('.space-y-4');
    if (!playlistContainer) return;

    playlistContainer.innerHTML = currentPlaylist.map((track, index) => `
        <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div class="flex items-center">
                <span class="text-gray-500 mr-4">${String(index + 1).padStart(2, '0')}</span>
                <img src="${track.cover}" alt="${track.title}" class="w-10 h-10 rounded mr-4">
                <div>
                    <h4 class="font-semibold">${track.title}</h4>
                    <p class="text-sm text-gray-500">${track.artist}</p>
                </div>
            </div>
            <div class="flex items-center">
                <span class="text-gray-500 mr-4">${track.duration}</span>
                <button class="text-${track.liked ? 'red' : 'gray'}-500">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');

    // 为播放列表项添加点击事件
    const playlistItems = playlistContainer.querySelectorAll('.flex.items-center.justify-between');
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentTrack = currentPlaylist[index];
            isPlaying = true;
            updatePlayButton();
            updateNowPlaying();
        });
    });
}