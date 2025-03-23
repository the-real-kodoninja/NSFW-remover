#!/bin/bash

echo "Installing Node.js (if not already installed)..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js already installed."
fi

echo "Installing project dependencies..."
cd server-side
npm init -y
npm install twitter-api-v2 nsfwjs @tensorflow/tfjs-node axios

echo "Setting up cron job..."
# Schedule to run daily at midnight (adjust as needed)
(crontab -l 2>/dev/null; echo "0 0 * * * /bin/bash /path/to/NSFW-remover/server-side/cron-job.sh") | crontab -

echo "Setup complete! Edit server-side/config.json with your credentials."