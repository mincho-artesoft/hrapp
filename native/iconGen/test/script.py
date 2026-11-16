import os
import json
import time
import argparse
import datetime
from PIL import Image, ImageDraw, ImageFont
from concurrent.futures import ProcessPoolExecutor, as_completed

# --------------------------------------------------------------------------------
# ГЛОБАЛНИ КОНСТАНТИ
# --------------------------------------------------------------------------------
ICON_SIZE = 1024

CAL_BG_COLOR = (255, 255, 255)
DAY_TEXT_COLOR_NORMAL = (70, 70, 70)
LINE_COLOR_NORMAL = (100, 100, 100)

TOP_BAR_COLOR = (50, 120, 220)
PIN_COLOR = (70, 70, 70)
MONTH_TEXT_COLOR = (255, 255, 255)
WEEKDAY_TEXT_COLOR = (50, 120, 220)

# Тук ползваме само Regular версия на Arial (защото нямаме bold TTF).
FONT_PATH = "SF-Pro-Display-Regular.otf"
MONTH_FONT_SIZE = 200     
WEEKDAY_FONT_SIZE = 150   
DAY_FONT_SIZE = 550       

# Линията (под деня) я правим по-дебела
LINE_WIDTH = 12

WEATHER_ICONS_DIR = "weather_icons"
os.makedirs(WEATHER_ICONS_DIR, exist_ok=True)

OUTPUT_DIR = "icons_dark_example"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Типове време -> локални PNG файлове (ако липсват, няма да се нарисуват)
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

# Имената на месеците и дните от седмицата
weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

# --------------------------------------------------------------------------------
# ГЛОБАЛНИ (зареждат се във всеки worker чрез init_worker)
# --------------------------------------------------------------------------------
base_image = None
month_font = None
weekday_font = None
day_font = None
weather_icon_cache = {}

# --------------------------------------------------------------------------------
# ПОМОЩНИ ФУНКЦИИ
# --------------------------------------------------------------------------------
def draw_bold_text(draw, xy, text, font, fill, offset=1):
    """
    'Фалшиво' bold рисуване:
    Рисува текста няколко пъти с офсет (ляво, дясно, горе, долу),
    и накрая го рисува центрирано отгоре.

    offset=1 дава леко удебеляване.
    Ако искате по-силно, offset=2, 3 и т.н. или добавете още офсети.
    """
    x, y = xy
    # Може да променяте/добавяте офсети за „по-дебел“ ефект
    # Тук рисуваме 4 екземпляра около централната точка
    for dx, dy in [(-offset, 0), (offset, 0), (0, -offset), (0, offset)]:
        draw.text((x + dx, y + dy), text, font=font, fill=fill)
    # Накрая рисуваме точния текст „централно“
    draw.text((x, y), text, font=font, fill=fill)

def get_text_size(draw, text, font):
    """
    Връща (width, height) на даден текст с конкретен шрифт.
    (полезно за изчисляване на координати)
    """
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]

def draw_top_rounded_rectangle(draw, xy, radius, fill):
    """
    Рисува горната част със закръглени ъгли, а долните ъгли ги прави прави.
    """
    (left, top), (right, bottom) = xy
    draw.rounded_rectangle([left, top, right, bottom], radius=radius, fill=fill)
    # Изправяме долните ъгли
    draw.rectangle([left, bottom - radius, right, bottom], fill=fill)

def get_local_icon(weather_type: str):
    """
    Връща PIL.Image или None, ако няма подходящ локален файл.
    """
    local_filename = weather_icon_map.get(weather_type)
    if not local_filename:
        return None  # Няма мапване за този тип
    local_path = os.path.join(WEATHER_ICONS_DIR, local_filename)
    if not os.path.exists(local_path):
        return None  # Файлът липсва
    try:
        return Image.open(local_path).convert("RGBA")
    except:
        return None

def create_base_image():
    """
    Рисува фона, синята лента и 'щипките' отгоре. 
    Цветът е бял (CAL_BG_COLOR).
    """
    img = Image.new("RGBA", (ICON_SIZE, ICON_SIZE), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    corner_radius = 60
    # Основен фон (бял)
    draw.rounded_rectangle(
        [(0, 0), (ICON_SIZE, ICON_SIZE)],
        radius=corner_radius,
        fill=CAL_BG_COLOR
    )
    # Син бар
    top_bar_height = int(ICON_SIZE * 0.35)
    draw_top_rounded_rectangle(
        draw,
        [(0, 0), (ICON_SIZE, top_bar_height)],
        radius=corner_radius,
        fill=TOP_BAR_COLOR
    )
    # „Щипки“ (тъмни правоъгълници)
    pin_width = int(ICON_SIZE * 0.15)
    pin_height = 40
    pin_left_x = int(ICON_SIZE * 0.2)
    pin_top_y = 5
    draw.rounded_rectangle(
        [(pin_left_x, pin_top_y), (pin_left_x + pin_width, pin_top_y + pin_height)],
        radius=pin_height // 2,
        fill=PIN_COLOR
    )
    pin_right_x = ICON_SIZE - pin_left_x - pin_width
    draw.rounded_rectangle(
        [(pin_right_x, pin_top_y), (pin_right_x + pin_width, pin_top_y + pin_height)],
        radius=pin_height // 2,
        fill=PIN_COLOR
    )
    return img

def generate_contents_json(appiconset_dir):
    """
    Генерира Contents.json, където посочваме същия icon_normal.png
    и за нормален, и за dark, и за tinted режим.
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

# --------------------------------------------------------------------------------
# ИНИЦИАЛИЗАЦИЯ ЗА ВСЕКИ WORKER
# --------------------------------------------------------------------------------
def init_worker():
    """
    Зарежда редовния (не-bold) шрифт и създава един базов фон (бял) + син бар.
    """
    global base_image
    global month_font
    global weekday_font
    global day_font
    global weather_icon_cache

    from PIL import ImageFont

    # Зареждаме нормалния шрифт, но after that we'll draw it "bold" with offsets
    month_font = ImageFont.truetype(FONT_PATH, MONTH_FONT_SIZE)
    weekday_font = ImageFont.truetype(FONT_PATH, WEEKDAY_FONT_SIZE)
    day_font = ImageFont.truetype(FONT_PATH, DAY_FONT_SIZE)

    # Базово изображение
    base_image = create_base_image()

    # Кеширане на weather иконките (за да не четем от диск всеки път)
    weather_icon_cache = {}
    for wt in weather_icon_map.keys():
        im = get_local_icon(wt)
        if im:
            w, h = im.size
            max_dim = 150
            # Скалираме, за да пасва около текста (не повече от 150 px)
            scale = min(max_dim / w, max_dim / h)
            new_w = int(w * scale)
            new_h = int(h * scale)
            im = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
            weather_icon_cache[wt] = im
        else:
            weather_icon_cache[wt] = None

# --------------------------------------------------------------------------------
# ФУНКЦИЯ: Генерира една .appiconset (само 1 изображение icon_normal.png)
# --------------------------------------------------------------------------------
def generate_one_appiconset(m, w, d, wt):
    """
    m = име на месеца (напр. "Jan")
    w = делник (напр. "Mon")
    d = число за деня (int)
    wt = weather type (ключ от weather_icon_map)
    """
    global base_image
    global month_font
    global weekday_font
    global day_font
    global weather_icon_cache

    from PIL import ImageDraw

    # Копираме "базата"
    normal_img = base_image.copy()
    draw = ImageDraw.Draw(normal_img)

    # 1) Месец (горе, в синята лента) - "фалшив" bold
    month_w, month_h = get_text_size(draw, m, month_font)
    top_bar_height = int(ICON_SIZE * 0.35)
    month_x = (ICON_SIZE - month_w) / 2
    month_y = (top_bar_height - month_h) / 2 - 25
    draw_bold_text(draw, (month_x, month_y), m, month_font, MONTH_TEXT_COLOR, offset=1)

    # 2) Иконка за времето (ако има) – вдясно от месеца
    icon_img = weather_icon_cache.get(wt)
    if icon_img:
        iw, ih = icon_img.size
        icon_x = month_x + month_w + 80
        icon_y = month_y + (month_h - ih) / 2 + 50
        normal_img.alpha_composite(icon_img, (int(icon_x), int(icon_y)))

    # 3) Голямото число за деня (под синята лента) - "фалшив" bold
    day_str = str(d)
    d_w, d_h = get_text_size(draw, day_str, day_font)
    day_y = top_bar_height - 40 - 30
    day_x = (ICON_SIZE - d_w) / 2
    draw_bold_text(draw, (day_x, day_y), day_str, day_font, DAY_TEXT_COLOR_NORMAL, offset=1)

    # 4) Дебела хоризонтална линия
    line_y = day_y + d_h + 180
    pin_left_x = int(ICON_SIZE * 0.2)
    pin_right_x = ICON_SIZE - pin_left_x - int(ICON_SIZE * 0.15)
    line_x1 = pin_left_x - 100
    line_x2 = pin_right_x + int(ICON_SIZE * 0.15) + 100
    draw.line([(line_x1, line_y), (line_x2, line_y)], fill=LINE_COLOR_NORMAL, width=LINE_WIDTH)

    # 5) Ден от седмицата (под линията) - "фалшив" bold
    w_w, w_h = get_text_size(draw, w, weekday_font)
    w_x = (ICON_SIZE - w_w) / 2
    w_y = line_y + 10
    draw_bold_text(draw, (w_x, w_y), w, weekday_font, WEEKDAY_TEXT_COLOR, offset=1)

    # Запис в .appiconset
    appiconset_name = f"icon_{m}_{w}_{d}_{wt}.appiconset"
    appiconset_path = os.path.join(OUTPUT_DIR, appiconset_name)
    os.makedirs(appiconset_path, exist_ok=True)

    # Само 1 PNG файл
    normal_png = os.path.join(appiconset_path, "icon_normal.png")
    normal_img.save(normal_png, "PNG", optimize=True, compress_level=9)

    generate_contents_json(appiconset_path)

# --------------------------------------------------------------------------------
# MAIN
# --------------------------------------------------------------------------------
def main():
    """
    Примерно стартиране:
        python script.py 01/12/2015 01/12/2016
    Това ще генерира .appiconset за всички дати в диапазона [01/12/2015 .. 01/12/2016].
    """
    parser = argparse.ArgumentParser(description="Генерира иконки за подаден период.")
    parser.add_argument("start_date", help="Начална дата във формат DD/MM/YYYY")
    parser.add_argument("end_date", help="Крайна дата във формат DD/MM/YYYY")
    args = parser.parse_args()

    # Парсираме подадените дати
    start_dt = datetime.datetime.strptime(args.start_date, "%d/%m/%Y").date()
    end_dt   = datetime.datetime.strptime(args.end_date, "%d/%m/%Y").date()

    if end_dt < start_dt:
        print("Грешка: Крайната дата е преди началната!")
        return

    overall_start = time.time()

    # Подготвяме списък от всички дати в диапазона
    all_dates = []
    current_date = start_dt
    while current_date <= end_dt:
        all_dates.append(current_date)
        current_date += datetime.timedelta(days=1)

    # Общо задачи = брой дни * брой weather типове
    total_task_count = len(all_dates) * len(weather_icon_map)
    tasks = []

    # Пул от процеси + инициализация
    with ProcessPoolExecutor(initializer=init_worker) as executor:
        for dt in all_dates:
            # Определяме съответните текстове:
            m = months[dt.month - 1]     # "Jan", "Feb", ...
            d = dt.day
            w = weekdays[dt.weekday()]  # "Mon"=0, "Tue"=1, ...

            # За всеки weather_type (wt) пускаме задача
            for wt in weather_icon_map:
                fut = executor.submit(generate_one_appiconset, m, w, d, wt)
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

if __name__ == "__main__":
    main()
