var spotiplay = (function () {
    let currVolume = 0.5;
    let covering = false;
    let search_area;

    chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
        if (!covering) {
            const cover = document.createElement("div");

            cover.innerHTML = `This&nbsp;<span style="color: #1ed760;">Spotify</span>&nbsp;webpage is currently being managed by&nbsp;<a style="color: #1ed760;">SpotiPlay</span>.`;
            cover.style = `
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: 10;
            background: blue;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            font-weight: bold;
            color: #fff;
            background: #181818;
            `;

            document.body.appendChild(cover);
            covering = true;
        }
        search_area = document.querySelector('[data-testid="now-playing-bar"]');

        let responseData = { status: "Bye Felicia!" };

        switch (message.action) {
            case 'heart':
                heart();
                break;
            case 'shuffle':
                shuffle();
                break;
            case 'prev':
                prev();
                break;
            case 'playpause':
                playpause();
                break;
            case 'next':
                next();
                break;
            case 'repeat':
                repeat();
                break;
            case 'mute':
                mute();
                break;
            case 'volume':
                volume(message.value);
                break;
            case 'track':
                track(message.value);
                break;
            case 'info':
                responseData = info();
                break;
        }
        sendResponse(responseData);
    });

    function heart() {
        const heart = search_area.querySelector('[aria-label="Save to Your Library"]');
        if (heart) {
            heart.click();
        } else {
            const heart2 = search_area.querySelector('[aria-label="Remove from Your Library"]');
            heart2.click();
        }
    }

    function shuffle() {
        const shuffle = search_area.querySelector('[aria-label="Disable shuffle"]');
        if (shuffle) {
            shuffle.click();
        } else {
            const shuffle2 = search_area.querySelector('[aria-label="Enable shuffle"]');
            shuffle2.click();
        }
    }
    function prev() {
        const prev = search_area.querySelector('[aria-label="Previous"]');
        prev.click();
    }
    function playpause() {
        const playpause = search_area.querySelector('[aria-label="Play"]');
        if (playpause) {
            playpause.click();
        } else {
            const playpause2 = search_area.querySelector('[aria-label="Pause"]');
            playpause2.click();
        }
    }
    function next() {
        const next = search_area.querySelector('[aria-label="Next"]');
        next.click();
    }
    function repeat() {
        const repeat = search_area.querySelector('[aria-label="Enable repeat"]');
        if (repeat) {
            repeat.click();
        } else {
            const repeat2 = search_area.querySelector('[aria-label="Enable repeat one"]');
            if (repeat2) {
                repeat2.click();
            } else {
                const repeat3 = search_area.querySelector('[aria-label="Disable repeat"]');
                repeat3.click();
            }
        }
    }
    function mute() {
        const mute = search_area.querySelector('[aria-label="Mute"]');
        if (mute) {
            mute.click();
        } else {
            const mute2 = search_area.querySelector('[aria-label="Unmute"]');
            mute2.click();
        }
    }
    async function volume(value) {
        const rect = search_area.querySelectorAll('[data-testid="progress-bar"]')[1].getBoundingClientRect();

        const centerX = rect.left + rect.width * value;
        const centerY = rect.top + rect.height / 2;

        const clickEvent = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: false,
            clientX: centerX,
            clientY: centerY
        });
        const clickEvent2 = new MouseEvent('mouseup', {
            view: window,
            bubbles: true,
            cancelable: false,
            clientX: centerX,
            clientY: centerY
        });

        search_area.querySelectorAll('[data-testid="progress-bar"]')[1].dispatchEvent(clickEvent);
        await new Promise((resolve) => setTimeout(resolve, 50));
        search_area.querySelectorAll('[data-testid="progress-bar"]')[1].dispatchEvent(clickEvent2);
        currVolume = value;
    }
    async function track(value) {
        const rect = search_area.querySelectorAll('[data-testid="progress-bar"]')[0].getBoundingClientRect();

        const centerX = rect.left + rect.width * value;
        const centerY = rect.top + rect.height / 2;

        const clickEvent = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: false,
            clientX: centerX,
            clientY: centerY
        });
        const clickEvent2 = new MouseEvent('mouseup', {
            view: window,
            bubbles: true,
            cancelable: false,
            clientX: centerX,
            clientY: centerY
        });

        search_area.querySelectorAll('[data-testid="progress-bar"]')[0].dispatchEvent(clickEvent);
        await new Promise((resolve) => setTimeout(resolve, 50));
        search_area.querySelectorAll('[data-testid="progress-bar"]')[0].dispatchEvent(clickEvent2);
        currVolume = message.value;
    }
    function info() {
        const titleEl = search_area.querySelector('[data-testid="context-item-link"]');
        const authorEl = search_area.querySelector('[data-testid="context-item-info-artist"]');

        let ishearted = false;
        let heart = search_area.querySelector('[aria-label="Remove from Your Library"]');
        if (heart) {
            ishearted = true;
        }

        let isShuffled = false;
        const shuffle = search_area.querySelector('[aria-label="Disable shuffle"]');
        if (shuffle) {
            isShuffled = true;
        }

        let isPaused = false;
        const play = search_area.querySelector('[aria-label="Play"]');
        if (play) {
            isPaused = true;
        }

        let repeatMode = 'one';
        const repeat = search_area.querySelector('[aria-label="Enable repeat"]');
        if (repeat) {
            repeatMode = 'off';
        } else {
            const repeat2 = search_area.querySelector('[aria-label="Enable repeat one"]');
            if (repeat2) {
                repeatMode = 'on';
            }
        }

        let isMuted = false;
        const mute = search_area.querySelector('[aria-label="Unmute"]');
        if (mute) {
            isMuted = true;
        }

        let currPosition = "0:00";
        const position = search_area.querySelector('[data-testid="playback-position"]');
        if (position) {
            currPosition = position.textContent;
        }

        let currDuration = "0:00";
        const duration = search_area.querySelector('[data-testid="playback-duration"]');
        if (duration) {
            currDuration = duration.textContent;
        }

        return {
            url: search_area.querySelector('[data-testid="cover-art-image"]').src,
            titleURL: titleEl.href,
            authorURL: authorEl.href,
            title: titleEl.textContent,
            author: authorEl.textContent,
            hearted: ishearted,
            shuffled: isShuffled,
            paused: isPaused,
            repeated: repeatMode,
            muted: isMuted,
            volume: currVolume,
            position: currPosition,
            duration: currDuration,
        }
    }
});

spotiplay();