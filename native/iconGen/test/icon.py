import os
import json
import time
import argparse
import datetime
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from concurrent.futures import ProcessPoolExecutor, as_completed

# --------------------------------------------------------------------------------
# ГЛОБАЛНИ КОНСТАНТИ (стили и настройки)
# --------------------------------------------------------------------------------
WIDTH, HEIGHT = 1024, 1024
BG_COLOR = (22, 102, 175)  # Основен фон
MONTH_COLOR = (255, 248, 229)
DAY_COLOR = (255, 248, 229)
DATE_COLOR = (255, 248, 229)

# Директории
WEATHER_ICONS_DIR = "weather_icons"
OUTPUT_DIR = "icons_merged_example"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Шрифт
FONT_PATH = "SF-Pro-Display-Regular.otf"

# Глобални размери на шрифта (може да ги нагласите при нужда)
FONT_MONTH_SIZE = 160
FONT_DAY_SIZE   = 160
FONT_DATE_SIZE  = 700  # Голямото число в центъра

# --------------------------------------------------------------------------------
# Мапване на weather-тип към PNG файл (трябва да е в weather_icons/)
# --------------------------------------------------------------------------------
weather_icon_map = {
    "cloud.bolt":        "cloud.bolt.png",
    "cloud.fog":         "cloud.fog.png",
    "cloud":             "cloud.png",
    "cloud.snow":        "cloud.snow.png",
    "cloud.sun.rain":    "cloud.sun.rain.png",
    "cloud.bolt.rain":   "cloud.bolt.rain.png",
    "cloud.hail":        "cloud.hail.png",
    "cloud.rain":        "cloud.rain.png",
    "cloud.sun.bolt":    "cloud.sun.bolt.png",
    "snowflake":         "snowflake.png",
    "cloud.drizzle":     "cloud.drizzle.png",
    "cloud.heavyrain":   "cloud.heavyrain.png",
    "cloud.sleet":       "cloud.sleet.png",
    "cloud.sun":         "cloud.sun.png",
    "sun":               "sun.png"
}

# --------------------------------------------------------------------------------
# ГЛОБАЛНИ ПРОМЕНЛИВИ (зареждат се във всеки worker чрез init_worker)
# --------------------------------------------------------------------------------
month_font = None
day_font   = None
date_font  = None
weather_icon_cache = {}

# --------------------------------------------------------------------------------
# ФУНКЦИИ
# --------------------------------------------------------------------------------
def get_font(size):
    """
    Зарежда TrueType шрифт или, при проблем, load_default().
    """
    try:
        return ImageFont.truetype(FONT_PATH, size)
    except:
        return ImageFont.load_default()

def add_shadow(icon, offset=(6, 6), background=(0, 0, 0, 128)):
    """
    Добавя мека сянка към дадено RGBA изображение icon.
    offset – изместване на иконата спрямо сянката
    background – цвят на сянката (с alpha)
    """
    shadow = Image.new("RGBA", (icon.width + 10, icon.height + 10), (0, 0, 0, 0))
    shadow_layer = Image.new("RGBA", icon.size, background)
    shadow.paste(shadow_layer, offset, icon)
    shadow = shadow.filter(ImageFilter.GaussianBlur(8))

    base = Image.new("RGBA", shadow.size, (0, 0, 0, 0))
    base.paste(shadow, (0, 0), shadow)
    base.paste(icon, (0, 0), icon)
    return base

def generate_contents_json(appiconset_dir):
    """
    Генерира минимален Contents.json, където посочваме еднакъв filename
    за normal/dark/tinted (за iOS).
    """
    data = {
        "images": [
            {
                "filename": "icon_normal.png",
                "idiom": "universal",
                "platform": "ios",
                "size": "1024x1024"
            },
            {
                "filename": "icon_normal.png",
                "idiom": "universal",
                "platform": "ios",
                "size": "1024x1024",
                "appearances": [
                    {
                        "appearance": "luminosity",
                        "value": "dark"
                    }
                ]
            },
            {
                "filename": "icon_normal.png",
                "idiom": "universal",
                "platform": "ios",
                "size": "1024x1024",
                "appearances": [
                    {
                        "appearance": "luminosity",
                        "value": "tinted"
                    }
                ]
            }
        ],
        "info": {
            "author": "xcode",
            "version": 1
        }
    }
    contents_path = os.path.join(appiconset_dir, "Contents.json")
    with open(contents_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def render_icon(date_obj, weather_key):
    """
    Рендира едно 1024x1024 изображение (стилизация):
      - Син фон (rounded rectangle)
      - Месец и ден от седмицата горе вляво
      - Огромна дата по средата
      - Икона за времето горе вдясно, със сянка
    """
    # Създаваме основно RGB изображение с BG_COLOR
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Закръгляме ъглите (при желание).
    corner_radius = 180
    draw.rounded_rectangle(
        (0, 0, WIDTH, HEIGHT),
        radius=corner_radius,
        fill=BG_COLOR
    )

    # Извличаме текстовете за дата
    month   = date_obj.strftime("%b").upper()  # "APR", "MAY"...
    weekday = date_obj.strftime("%a").upper()  # "SUN", "MON"...
    day_num = str(date_obj.day)

    # Рисуваме месец и делничен ден (по-горе, вляво)
    draw.text((80, 50),  month,   font=month_font, fill=MONTH_COLOR)
    draw.text((80, 190), weekday, font=day_font,   fill=DAY_COLOR)

    # Голямата дата в центъра (по вертикала ~ средата)
    bbox = draw.textbbox((0, 0), day_num, font=date_font)
    text_width  = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    y_date = (HEIGHT - text_height) / 2 
    x_date = (WIDTH - text_width) / 2
    draw.text((x_date, y_date), day_num, fill=DATE_COLOR, font=date_font)

    # Иконка за времето (горе вдясно)
    icon = weather_icon_cache.get(weather_key)
    if icon:
        icon_with_shadow = add_shadow(icon)
        iw, ih = icon_with_shadow.size
        x_icon = WIDTH  - iw - 60
        y_icon = 90
        img.paste(icon_with_shadow, (x_icon, y_icon), icon_with_shadow)

    return img

def generate_one_appiconset(date_obj, weather_key):
    """
    Генерира .appiconset папка, в която записва icon_normal.png (1024x1024)
    и Contents.json, следвайки стила на render_icon().
    """
    # Рендираме изображението
    final_img = render_icon(date_obj, weather_key)

    # Подготвяме компоненти за името на изходната директория
    month_str   = date_obj.strftime("%b")   # "Apr"
    weekday_str = date_obj.strftime("%a")   # "Sun"
    day_num     = date_obj.day             # 27
    safe_wt     = weather_key.replace(".", "-")  # "cloud-drizzle"

    # Пример: "icon_Apr_Sun_27_cloud-drizzle.appiconset"
    appiconset_name = f"icon_{month_str}_{weekday_str}_{day_num}_{safe_wt}.appiconset"
    appiconset_path = os.path.join(OUTPUT_DIR, appiconset_name)
    os.makedirs(appiconset_path, exist_ok=True)

    # Записваме PNG
    normal_png_path = os.path.join(appiconset_path, "icon_normal.png")
    final_img.save(normal_png_path, "PNG", optimize=True, compress_level=9)

    # Генерираме Contents.json
    generate_contents_json(appiconset_path)

def get_local_icon(weather_key: str):
    """
    Зарежда иконата от диска (ако я има) и я конвертира в RGBA.
    """
    icon_filename = weather_icon_map.get(weather_key)
    if not icon_filename:
        return None
    icon_path = os.path.join(WEATHER_ICONS_DIR, icon_filename)
    if not os.path.exists(icon_path):
        return None
    try:
        return Image.open(icon_path).convert("RGBA")
    except:
        return None

def init_worker():
    """
    Инициализация за всеки worker в процесния пул:
      1) Зареждаме шрифтовете
      2) Зареждаме/скалираме/кешираме иконите за времето
    """
    global month_font
    global day_font
    global date_font
    global weather_icon_cache

    # Зареждаме шрифтовете
    month_font = get_font(FONT_MONTH_SIZE)
    day_font   = get_font(FONT_DAY_SIZE)
    date_font  = get_font(FONT_DATE_SIZE)

    # Зареждаме всички weather иконки + скалиране
    weather_icon_cache = {}
    for key in weather_icon_map:
        im = get_local_icon(key)
        if im:
            w, h = im.size
            # Примерно мащабираме иконата да не превишава ~220px височина/ширина
            scale = 1.2 * min(220 / w, 220 / h)
            new_w = int(w * scale)
            new_h = int(h * scale)
            im = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
            weather_icon_cache[key] = im
        else:
            weather_icon_cache[key] = None

# --------------------------------------------------------------------------------
# MAIN
# --------------------------------------------------------------------------------
def main():
    """
    Стартиране:
      python icon.py 28/04/2025 1/07/2025
    Генерира иконки (.appiconset) за всяка дата в диапазона [start_date .. end_date]
    и за всеки weather-тип от weather_icon_map.
    """
    parser = argparse.ArgumentParser(description="Генерира календарни икони с .appiconset структура (стилизиран вид).")
    parser.add_argument("start_date", help="Начална дата във формат DD/MM/YYYY")
    parser.add_argument("end_date",   help="Крайна дата във формат DD/MM/YYYY")
    args = parser.parse_args()

    # Парсираме подадените дати
    start_dt = datetime.datetime.strptime(args.start_date, "%d/%m/%Y").date()
    end_dt   = datetime.datetime.strptime(args.end_date,   "%d/%m/%Y").date()

    if end_dt < start_dt:
        print("Грешка: Крайната дата е преди началната!")
        return

    overall_start = time.time()

    # Генерираме списък от всички дати в зададения диапазон
    all_dates = []
    current_date = start_dt
    while current_date <= end_dt:
        all_dates.append(current_date)
        current_date += datetime.timedelta(days=1)

    # Общо задачи = брой дни * брой weather типове
    total_task_count = len(all_dates) * len(weather_icon_map)
    tasks = []

    # Ползваме ProcessPoolExecutor за успоредна обработка
    with ProcessPoolExecutor(initializer=init_worker) as executor:
        for dt in all_dates:
            # За всяка дата, за всеки weather-тип -> пускаме задача
            for wt in weather_icon_map:
                fut = executor.submit(generate_one_appiconset, dt, wt)
                tasks.append(fut)

        # Изчакваме всички задачи, следим прогреса
        finished = 0
        for fut in as_completed(tasks):
            finished += 1
            try:
                fut.result()
            except Exception as e:
                print(f"Грешка в задача: {e}")
            pct = 100.0 * finished / total_task_count
            print(f"\rОбработка: {finished}/{total_task_count} ({pct:.1f}%)", end="")

    print()  # Нов ред
    overall_end = time.time()
    elapsed_total = overall_end - overall_start
    print(f"Генерирани са {total_task_count} .appiconset за периода {start_dt} - {end_dt}.")
    print(f"Общо време: {elapsed_total:.2f} сек.")

# Стартираме, ако е изпълнен като скрипт
if __name__ == "__main__":
    main()
