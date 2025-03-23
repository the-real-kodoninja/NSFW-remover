(async function() {
    const tfScript = document.createElement('script');
    tfScript.src = 'https://unpkg.com/@tensorflow/tfjs@latest/dist/tf.min.js';
    document.head.appendChild(tfScript);

    const nsfwScript = document.createElement('script');
    nsfwScript.src = 'https://unpkg.com/nsfwjs@latest/dist/nsfwjs.min.js';
    document.head.appendChild(nsfwScript);

    await new Promise(resolve => nsfwScript.onload = resolve);
    const model = await nsfwjs.load();

    async function removeNSFWShares() {
        const tweets = document.querySelectorAll('article');
        for (let tweet of tweets) {
            const deleteButton = tweet.querySelector('[data-testid="caret"]');
            const img = tweet.querySelector('img[src*="media"]');
            if (img && deleteButton) { // Ensure it’s your tweet (has delete option)
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
                    await new Promise(r => setTimeout(r, 2000));
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
    }, 15000);
})();