#!/bin/bash

SRC="/Users/aleksandarsvinarov/Desktop/Repo/iconGen/test/icons_dark_example/"
DEST="/Users/aleksandarsvinarov/Desktop/Repo/hrapp/Calendar/Assets.xcassets/"
COUNT=0

# Създаваме масив с всички файлове от SRC
files=("$SRC"/*)
TOTAL=${#files[@]}

echo "Общо файлове за копиране: $TOTAL"

for file in "${files[@]}"; do
  COUNT=$((COUNT + 1))

  echo "Копирам файл №$COUNT от $TOTAL: $file"
  rsync -av "$file" "$DEST"

  # На всеки 30 файла изчакваме 3 секунди
  if [ $((COUNT % 20)) -eq 0 ]; then
    echo "Копирани са $COUNT файла. Чакам 5 секунди..."
    sleep 5
  fi
done

echo "Всички файлове ($TOTAL) са копирани!"
