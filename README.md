# NSFW-remover

Remove NSFW likes, retweets, and shares from your X account using Tampermonkey userscripts.

## Structure

-   `userscripts/nsfw-remover-likes.user.js`: Removes NSFW likes.
-   `userscripts/nsfw-remover-retweets.user.js`: Removes NSFW retweets.
-   `userscripts/nsfw-remover-shares.user.js`: Deletes your NSFW tweets.

## Setup

1.  Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2.  Open Tampermonkey’s dashboard (icon > "Dashboard").
3.  Add each script:
    -   Click "+ New Script."
    -   Paste the contents of each `.user.js` file.
    -   Save (Ctrl+S).

## Usage

1.  Log in to X.
2.  Navigate to:
    -   Likes: `https://twitter.com/your-username/likes`
    -   Retweets/Shares: `https://twitter.com/your-username`
3.  The script auto-runs, scanning and removing NSFW content while scrolling.

## Notes

-   No API required—uses your browser session.
-   Delays: 5s per action, 30s per scroll to avoid rate limits.
-   If "429 Too Many Requests" errors appear in console (from X’s API), wait 15-30 minutes, then refresh and resume.
-   NSFW threshold is 0.7; edit the script to adjust (0.0–1.0).
-   Check console (F12 > Console) for progress logs.

## Changes Made

-   **Longer Delays:**
    -   5s (5000ms) between actions (e.g., unliking, unretweeting).
    -   30s (30000ms) between scroll iterations to give X time to load content without hitting rate limits.
-   **Retry Logic:**
    -   If no content is found (e.g., due to rate limiting), it waits 30s and checks again before stopping.
-   **Better Logging:**
    -   Logs the number of items found, iteration progress, and errors for debugging.
-   **Error Handling:**
    -   Wraps image classification in a try-catch to prevent script crashes.

## Handling the 429 Errors

The 429 errors are from X’s fleets/v1 endpoints, not our script. They suggest the page is requesting avatar or Spaces data too quickly as you scroll. To mitigate:

-   **Run Slower:** The 30s interval should help, but if errors persist, increase to 60s (60000ms in the `setInterval`).
-   **Pause and Resume:** If you see many 429s, disable the script in Tampermonkey, wait 15-30 minutes, refresh the page, and re-enable it.
-   **Smaller Batches:** Reduce `maxIterations` to 10 or 20, run it, then repeat as needed.

## How to Test

1.  **Update Tampermonkey:**
    -   Open Tampermonkey Dashboard.
    -   Replace each script’s content with the updated versions above.
    -   Save each one.
2.  **Run:**
    -   Go to `https://twitter.com/your-username/likes` for likes.
    -   Go to `https://twitter.com/your-username` for retweets or shares.
    -   Open console (F12 > Console) to watch progress.
3.  **Monitor:**
    -   Look for logs like “Found X unlike buttons” or “Unliked NSFW post.”
    -   If it stops prematurely, check for errors and adjust delays.