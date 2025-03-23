# NSFW-remover
Remove NSFW likes, retweets, and shares from your X account using browser-based scripts.

## Structure
- `client-side/remove-nsfw-likes.js`: Removes NSFW likes.
- `client-side/remove-nsfw-retweets.js`: Removes NSFW retweets.
- `client-side/remove-nsfw-shares.js`: Deletes your NSFW tweets.

## Usage
1. Log in to X in your browser.
2. Navigate to:
   - Likes: `https://twitter.com/your-username/likes`
   - Retweets/Shares: `https://twitter.com/your-username`
3. Open the console (`Ctrl + Shift + J` or right-click > Inspect > Console).
4. Copy and paste the relevant script:
   - For likes: `remove-nsfw-likes.js`
   - For retweets: `remove-nsfw-retweets.js`
   - For shares (your tweets): `remove-nsfw-shares.js`
5. Press Enter and let it run. It will scroll and remove NSFW content.

## Notes
- No API or server setup required—runs entirely in your browser.
- Adjust `maxIterations` or delays (e.g., 2000ms) if X throttles actions.
- NSFW threshold is set to 0.7; edit the script to change it (0.0–1.0).
.gitignore (Optional)
text

Collapse

Wrap

Copy
*.log
How to Update Your Project
Delete Old Files:
rm -rf server-side/ setup.sh package.json
Create New Structure:
mkdir -p client-side
Save each .js file in client-side/ as shown above.
Update README.md with the new content.
Test Each Script:
Log in to X.
Open the console on the appropriate page (likes, profile).
Paste and run each script one at a time.