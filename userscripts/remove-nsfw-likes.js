// ==UserScript==
// @name         NSFW Remover - Likes
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove NSFW likes from your X profile
// @author       You
// @match        https://twitter.com/*/likes
// @match        https://x.com/*/likes
// @require      https://unpkg.com/@tensorflow/tfjs@latest/dist/tf.min.js
// @require      https://unpkg.com/nsfwjs@latest/dist/nsfwjs.min.js
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    console.log('Loading NSFWJS model...');
    const model = await nsfwjs.load();
    console.log('Model loaded.');

    async function removeNSFWLikes() {
        const unlikeButtons = document.querySelectorAll('[data-testid="unlike"]');
        console.log(`Found ${unlikeButtons.length} unlike buttons.`);
        for (let button of unlikeButtons) {
            const tweet = button.closest('article');
            const img = tweet?.querySelector('img[src*="media"]');
            if (img) {
                try {
                    const predictions = await model.classify(img);
                    const isNSFW = predictions.some(p => 
                        (p.className === 'Porn' || p.className === 'Hentai' || p.className === 'Sexy') && p.probability > 0.7
                    );
                    if (isNSFW) {
                        button.click();
                        console.log('Unliked NSFW post');
                        await new Promise(r => setTimeout(r, 5000)); // 5s delay
                    }
                } catch (e) {
                    console.error('Error classifying image:', e);
                }
            }
        }
        window.scrollTo(0, document.body.scrollHeight);
        console.log('Scrolled to load more likes...');
    }

    let iterations = 0;
    const maxIterations = 50;
    const interval = setInterval(async () => {
        const hasLikes = document.querySelector('[data-testid="unlike"]');
        if (iterations < maxIterations && hasLikes) {
            await removeNSFWLikes();
            iterations++;
            console.log(`Iteration ${iterations}/${maxIterations}`);
        } else if (!hasLikes) {
            console.log('No more likes found, retrying in 30s...');
            await new Promise(r => setTimeout(r, 30000)); // Wait 30s for rate limit
            if (document.querySelector('[data-testid="unlike"]')) {
                console.log('New likes loaded, continuing...');
                return; // Continue if content loads
            }
            clearInterval(interval);
            console.log('Finished removing NSFW likes!');
        } else {
            clearInterval(interval);
            console.log('Max iterations reached, finished!');
        }
    }, 30000); // 30s interval
})();