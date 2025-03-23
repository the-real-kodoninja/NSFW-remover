// ==UserScript==
// @name         NSFW Remover - Shares
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Delete NSFW tweets you’ve shared from your X profile
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @require      https://unpkg.com/@tensorflow/tfjs@latest/dist/tf.min.js
// @require      https://unpkg.com/nsfwjs@latest/dist/nsfwjs.min.js
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    const model = await nsfwjs.load();

    async function removeNSFWShares() {
        const tweets = document.querySelectorAll('article');
        for (let tweet of tweets) {
            const deleteButton = tweet.querySelector('[data-testid="caret"]');
            const img = tweet.querySelector('img[src*="media"]');
            if (img && deleteButton) {
                const predictions = await model.classify(img);
                const isNSFW = predictions.some(p => 
                    (p.className === 'Porn' || p.className === 'Hentai' || p.className === 'Sexy') && p.probability > 0.7
                );
                if (isNSFW) {
                    deleteButton.click();
                    setTimeout(() => {
                        const confirmDelete = document.querySelector('[data-testid="confirmationSheetConfirm"]');
                        if (confirmDelete) confirmDelete.click();
                        console.log('Deleted NSFW share');
                    }, 500);
                    await new Promise(r => setTimeout(r, 3000));
                }
            }
        }
        window.scrollTo(0, document.body.scrollHeight);
        console.log('Scrolled to load more shares...');
    }

    let iterations = 0;
    const maxIterations = 50;
    const interval = setInterval(async () => {
        const hasTweets = document.querySelector('article');
        if (iterations < maxIterations && hasTweets) {
            await removeNSFWShares();
            iterations++;
        } else {
            clearInterval(interval);
            console.log('Finished removing NSFW shares!');
        }
    }, 20000);
})();