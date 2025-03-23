(async function() {
    const tfScript = document.createElement('script');
    tfScript.src = 'https://unpkg.com/@tensorflow/tfjs@latest/dist/tf.min.js';
    document.head.appendChild(tfScript);

    const nsfwScript = document.createElement('script');
    nsfwScript.src = 'https://unpkg.com/nsfwjs@latest/dist/nsfwjs.min.js';
    document.head.appendChild(nsfwScript);

    await new Promise(resolve => nsfwScript.onload = resolve);
    const model = await nsfwjs.load();

    async function removeNSFWRetweets() {
        const unretweetButtons = document.querySelectorAll('[data-testid="unretweet"]');
        for (let button of unretweetButtons) {
            const tweet = button.closest('article');
            const img = tweet?.querySelector('img[src*="media"]');
            if (img) {
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
                    }, 500);
                    await new Promise(r => setTimeout(r, 2000));
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
        } else {
            clearInterval(interval);
            console.log('Finished removing NSFW retweets!');
        }
    }, 15000);
})();