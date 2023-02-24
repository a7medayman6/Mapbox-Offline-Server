#!/bin/sh


while true; do
  echo "Cache Directory Size - "
  du -sh ./tiles/
  echo "Cache Directory Files Count - "
  find ./tiles/ -type f | wc -l
  echo "______"
  sleep 1s
done;