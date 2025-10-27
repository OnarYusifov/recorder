#!/bin/bash

# Start both Discord recorder bots

echo "Starting TRAYB Recorder Bot 1..."
npm run bot1 &
BOT1_PID=$!

echo "Starting TRAYB Recorder Bot 2..."
npm run bot2 &
BOT2_PID=$!

echo ""
echo "Both bots started!"
echo "Bot 1 PID: $BOT1_PID"
echo "Bot 2 PID: $BOT2_PID"
echo ""
echo "To stop both bots, press Ctrl+C"

# Wait for both processes
wait

