// Example: Listening for messages from the background script


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
});
