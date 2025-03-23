// ==UserScript==
// @name         NSFW Remover - Retweets
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove NSFW retweets from your X profile
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @require      https://unpkg.com/@tensorflow/tfjs@latest/dist/tf.min.js
// @require      https://unpkg.com/nsfwjs@latest/dist/nsfwjs.min.js
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    console.log('Loading NSFWJS model...');
    const model = await nsfwjs.load();
    console.log('Model loaded.');

    async function removeNSFWRetweets() {
        const unretweetButtons = document.querySelectorAll('[data-testid="unretweet"]');
        console.log(`Found ${unretweetButtons.length} unretweet buttons.`);
        for (let button of unretweetButtons) {
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
                        setTimeout(() => {
                            const confirm = document.querySelector('[data-testid="unretweetConfirm"]');
                            if (confirm) confirm.click();
                            console.log('Unretweeted NSFW post');
                        }, 1000); // 1s for dialog
                        await new Promise(r => setTimeout(r, 5000));
                    }
                } catch (e) {
                    console.error('Error classifying image:', e);
                }
            }
        }
        window.scrollTo(0, document.body.scrollHeight);
        console.log('Scrolled to load more retweets...');
    }

    let iterations = 0;
    const maxIterations = 50;
    const interval = setInterval(async () => {
        const hasRetweets = document.querySelector('[data-testid="unretweet"]');
        if (iterations < maxIterations && hasRetweets) {
            await removeNSFWRetweets();
            iterations++;
            console.log(`Iteration ${iterations}/${maxIterations}`);
        } else if (!hasRetweets) {
            console.log('No more retweets found, retrying in 30s...');
            await new Promise(r => setTimeout(r, 30000));
            if (document.querySelector('[data-testid="unretweet"]')) {
                console.log('New retweets loaded, continuing...');
                return;
            }
            clearInterval(interval);
            console.log('Finished removing NSFW retweets!');
        } else {
            clearInterval(interval);
            console.log('Max iterations reached, finished!');
        }
    }, 30000);
})();