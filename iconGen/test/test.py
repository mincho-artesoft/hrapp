#!/usr/bin/env python3

import os
import time
import shutil

SRC = "/Users/aleksandarsvinarov/Desktop/Repo/iconGen/test/icons_dark_example/"
DEST = "/Users/aleksandarsvinarov/Desktop/Repo/hrapp/Calendar/Assets.xcassets/"

# Вземаме списък с всички файлове в SRC
all_files = [f for f in os.listdir(SRC) if os.path.isfile(os.path.join(SRC, f))]

BATCH_SIZE = 10      # Колко файла да копира на група
PAUSE_SECONDS = 10   # Колко да изчаква между групите

for i in range(0, len(all_files), BATCH_SIZE):
    batch = all_files[i:i+BATCH_SIZE]
    
    for f in batch:
        # Копиране на файл
        shutil.copy2(os.path.join(SRC, f), DEST)
        
    print(f"Копирани файлове от {i} до {i+len(batch)-1}. Чакам {PAUSE_SECONDS} сек.")
    time.sleep(PAUSE_SECONDS)
