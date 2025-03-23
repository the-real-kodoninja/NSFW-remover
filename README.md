# NSFW-remover
Remove NSFW likes and retweets from your X account.

## Structure
- `client-side/remove-nsfw.js`: Browser script for manual NSFW removal.
- `server-side/remove-nsfw.js`: Node.js script for automated removal.
- `server-side/config.json`: Config file for credentials and settings.
- `server-side/cron-job.sh`: Cron script for scheduling.
- `setup.sh`: Installs dependencies and sets up cron.

## Client-Side Usage
1. Open X likes (`https://twitter.com/your-username/likes`) or profile page.
2. Open console (`Ctrl + Shift + J`).
3. Paste `client-side/remove-nsfw.js` and press Enter.

## Server-Side Usage
1. Run `./setup.sh` to install dependencies.
2. Edit `server-side/config.json` with your Twitter API Bearer Token, User ID, and NSFW threshold.
3. Test manually: `cd server-side && node remove-nsfw.js`.
4. Cron runs it daily at midnight (edit `setup.sh` or `crontab -e` to change).

## Requirements
- Node.js
- Twitter API credentials (https://developer.twitter.com)