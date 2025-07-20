#!/bin/bash

echo "=== YHWH Knowledge Base Azure Startup ==="
echo "Removing any README files that might interfere..."
rm -f README.md readme.md Readme.md

echo "Starting YHWH Knowledge Base server..."
python server.py
