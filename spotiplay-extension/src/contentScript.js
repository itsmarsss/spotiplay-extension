// Example: Listening for messages from the background script
let currVolume = 0.5;

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    const search_area = document.querySelector('[data-testid="now-playing-bar"]');
    if (message.action === 'playpause') {
        // Perform actions in response to the message
        console.log('Received example action from background');
        // You can perform actions on the Spotify page here

        try {
            let playpause = search_area.querySelector('[aria-label="Play"]');
            playpause.click();
            return;
        } catch (err) {

        } finally {
            let playpause2 = search_area.querySelector('[aria-label="Pause"]');
            playpause2.click();
        }
    }
    if (message.action === 'shuffle') {
        try {
            const shuffle = search_area.querySelector('[aria-label="Disable shuffle"]');
            shuffle.click();
            return;
        } catch (err) {

        } finally {
            const shuffle2 = search_area.querySelector('[aria-label="Enable shuffle"]');
            shuffle2.click();
        }
    }
    if (message.action === 'repeat') {
        try {
            const repeat = search_area.querySelector('[aria-label="Enable repeat"]');
            repeat.click();
            return;
        } catch (err) {

        } finally {
            try {
                const repeat2 = search_area.querySelector('[aria-label="Enable repeat one"]');
                repeat2.click();
                return;
            } catch (err) {

            } finally {
                const repeat3 = search_area.querySelector('[aria-label="Disable repeat"]');
                repeat3.click();
            }
        }
    }
    if (message.action === 'mute') {
        try {
            let mute = search_area.querySelector('[aria-label="Mute"]');
            mute.click();
            return;
        } catch (err) {

        } finally {
            let mute2 = search_area.querySelector('[aria-label="Unmute"]');
            mute2.click();
        }
    }
    if (message.action === 'volume') {
        const rect = search_area.querySelectorAll('[data-testid="progress-bar"]')[1].getBoundingClientRect();

        // Calculate the center coordinates
        const centerX = rect.left + rect.width * message.value;
        const centerY = rect.top + rect.height / 2;

        // Create a MouseEvent object for a click event at the center coordinates
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

        console.log(centerX)
        console.log(centerY)

        // Dispatch the click event to the div
        search_area.querySelectorAll('[data-testid="progress-bar"]')[1].dispatchEvent(clickEvent);
        await new Promise((resolve) => setTimeout(resolve, 50));
        search_area.querySelectorAll('[data-testid="progress-bar"]')[1].dispatchEvent(clickEvent2);
        currVolume = message.value;
    }
    if (message.action === 'track') {
        const rect = search_area.querySelectorAll('[data-testid="progress-bar"]')[0].getBoundingClientRect();

        // Calculate the center coordinates
        const centerX = rect.left + rect.width * message.value;
        const centerY = rect.top + rect.height / 2;

        // Create a MouseEvent object for a click event at the center coordinates
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

        console.log(centerX)
        console.log(centerY)

        // Dispatch the click event to the div
        search_area.querySelectorAll('[data-testid="progress-bar"]')[0].dispatchEvent(clickEvent);
        await new Promise((resolve) => setTimeout(resolve, 50));
        search_area.querySelectorAll('[data-testid="progress-bar"]')[0].dispatchEvent(clickEvent2);
        currVolume = message.value;
    }
    if (message.action === 'heart') {
        try {
            let heart = search_area.querySelector('[aria-label="Save to Your Library"]');
            heart.click();
            return;
        } catch (err) {

        } finally {
            let heart2 = search_area.querySelector('[aria-label="Remove from Your Library"]');
            heart2.click();
        }
    }
    if (message.action === 'prev') {
        let prev = search_area.querySelector('[aria-label="Previous"]');
        prev.click();
    }
    if (message.action === 'next') {
        let next = search_area.querySelector('[aria-label="Next"]');
        next.click();
    }
    let responseData = { status: "Bye Felicia!" };
    if (message.action === 'info') {
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

        responseData = {
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
    console.log(responseData);
    sendResponse(responseData);
});
