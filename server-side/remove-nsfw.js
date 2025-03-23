const { TwitterApi } = require('twitter-api-v2');
const nsfwjs = require('nsfwjs');
const tf = require('@tensorflow/tfjs-node');
const axios = require('axios');
const fs = require('fs');

(async () => {
    // Load config
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    const { bearerToken, userId, nsfwThreshold } = config;

    // Twitter API client
    const client = new TwitterApi(bearerToken);

    // Load NSFWJS model
    const model = await nsfwjs.load();

    // Function to fetch and analyze media
    async function analyzeAndRemove(type) {
        const endpoint = type === 'likes' ? client.v2.userLikedTweets : client.v2.userTimeline;
        let tweets = await endpoint(userId, { expansions: 'attachments.media_keys', 'media.fields': 'url' });
        let processed = 0;

        while (tweets.data.data.length > 0) {
            for (const tweet of tweets.data.data) {
                if (tweet.attachments?.media_keys) {
                    const media = tweets.data.includes.media.find(m => tweet.attachments.media_keys.includes(m.media_key));
                    if (media?.url) {
                        const response = await axios.get(media.url, { responseType: 'arraybuffer' });
                        const image = await tf.node.decodeImage(response.data, 3);
                        const predictions = await model.classify(image);
                        image.dispose();

                        const isNSFW = predictions.some(p => 
                            (p.className === 'Porn' || p.className === 'Hentai' || p.className === 'Sexy') && p.probability > nsfwThreshold
                        );

                        if (isNSFW) {
                            if (type === 'likes') {
                                await client.v1.post('favorites/destroy.json', { id: tweet.id });
                                console.log(`Unliked NSFW tweet ${tweet.id}`);
                            } else {
                                await client.v1.post('statuses/unretweet.json', { id: tweet.id });
                                console.log(`Unretweeted NSFW tweet ${tweet.id}`);
                            }
                            await new Promise(r => setTimeout(r, 1000));
                        }
                    }
                }
                processed++;
            }
            tweets = await tweets.next();
        }
        console.log(`Processed ${processed} ${type}`);
    }

    await analyzeAndRemove('likes');
    await analyzeAndRemove('retweets');
    console.log('Finished removing all NSFW content!');
})();