import os
import json
import time
from PIL import Image, ImageDraw, ImageFont
from concurrent.futures import ProcessPoolExecutor, as_completed

# --------------------------------------------------------------------------------
# ГЛОБАЛНИ КОНСТАНТИ
# --------------------------------------------------------------------------------
ICON_SIZE = 1024

CAL_BG_COLOR = (255, 255, 255)
DAY_TEXT_COLOR_NORMAL = (70, 70, 70)
LINE_COLOR_NORMAL = (100, 100, 100)

CAL_BG_COLOR_DARK = (70, 70, 70)
DAY_TEXT_COLOR_DARK = (255, 255, 255)
LINE_COLOR_DARK = (255, 255, 255)

TOP_BAR_COLOR = (50, 120, 220)
PIN_COLOR = (70, 70, 70)
MONTH_TEXT_COLOR = (255, 255, 255)
WEEKDAY_TEXT_COLOR = (50, 120, 220)

FONT_PATH = "Arial.ttf"
MONTH_FONT_SIZE = 150
WEEKDAY_FONT_SIZE = 120
DAY_FONT_SIZE = 500

OUTPUT_DIR = "icons_no_weather"
os.makedirs(OUTPUT_DIR, exist_ok=True)

days = list(range(1, 32))  # 1..31
weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

# --------------------------------------------------------------------------------
# ГЛОБАЛНИ (за всеки worker), инициализират се в init_worker()
# --------------------------------------------------------------------------------
base_image_normal = None
base_image_dark = None
month_font = None
weekday_font = None
day_font = None

# --------------------------------------------------------------------------------
# ПОМОЩНИ ФУНКЦИИ
# --------------------------------------------------------------------------------
def get_text_size(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]

def draw_top_rounded_rectangle(draw, xy, radius, fill):
    (left, top), (right, bottom) = xy
    draw.rounded_rectangle([left, top, right, bottom], radius=radius, fill=fill)
    # Долните ъгли да са изправени
    draw.rectangle([left, bottom - radius, right, bottom], fill=fill)

def create_base_image(bg_color):
    """
    Рисува (1) заобления фон, (2) синята лента, (3) „щипките“.
    """
    img = Image.new("RGBA", (ICON_SIZE, ICON_SIZE), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    corner_radius = 60
    # Фон
    draw.rounded_rectangle(
        [(0, 0), (ICON_SIZE, ICON_SIZE)],
        radius=corner_radius,
        fill=bg_color
    )
    # Син бар
    top_bar_height = int(ICON_SIZE * 0.35)
    draw_top_rounded_rectangle(
        draw,
        [(0, 0), (ICON_SIZE, top_bar_height)],
        radius=corner_radius,
        fill=TOP_BAR_COLOR
    )
    # „Щипки“
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

def make_tinted_version(img):
    tinted = img.copy()
    # Създаваме синкав overlay
    overlay = Image.new("RGBA", tinted.size, (100, 200, 200, 80))
    tinted.alpha_composite(overlay)
    return tinted

def generate_contents_json(appiconset_dir):
    data = {
        "images": [
            {
                "filename": "icon_normal.png",
                "idiom": "universal",
                "platform": "ios",
                "size": "1024x1024"
            },
            {
                "filename": "icon_dark.png",
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
                "filename": "icon_tinted.png",
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
# ИНИЦИАЛИЗАЦИЯ ВЪВ ВСЕКИ WORKER
# --------------------------------------------------------------------------------
def init_worker():
    global base_image_normal
    global base_image_dark
    global month_font
    global weekday_font
    global day_font

    from PIL import ImageFont

    # Зареждаме шрифтове
    month_font = ImageFont.truetype(FONT_PATH, MONTH_FONT_SIZE)
    weekday_font = ImageFont.truetype(FONT_PATH, WEEKDAY_FONT_SIZE)
    day_font = ImageFont.truetype(FONT_PATH, DAY_FONT_SIZE)

    # Базови изображения
    base_image_normal = create_base_image(CAL_BG_COLOR)
    base_image_dark   = create_base_image(CAL_BG_COLOR_DARK)

# --------------------------------------------------------------------------------
# WORKER ФУНКЦИЯ: Генерира една .appiconset (без иконка за времето)
# --------------------------------------------------------------------------------
def generate_one_appiconset(m, w, d):
    global base_image_normal
    global base_image_dark
    global month_font
    global weekday_font
    global day_font

    from PIL import ImageDraw

    # Normal
    normal_img = base_image_normal.copy()
    draw = ImageDraw.Draw(normal_img)
    
    # Пишем месеца
    month_w, month_h = get_text_size(draw, m, month_font)
    top_bar_height = int(ICON_SIZE * 0.35)
    month_x = (ICON_SIZE - month_w) / 2
    month_y = (top_bar_height - month_h) / 2
    draw.text((month_x, month_y), m, font=month_font, fill=MONTH_TEXT_COLOR)

    # Ден
    day_str = str(d)
    d_w, d_h = get_text_size(draw, day_str, day_font)
    day_y = top_bar_height - 40
    day_x = (ICON_SIZE - d_w) / 2
    draw.text((day_x, day_y), day_str, font=day_font, fill=DAY_TEXT_COLOR_NORMAL)

    # Линия
    line_y = day_y + d_h + 150
    pin_left_x = int(ICON_SIZE * 0.2)
    pin_right_x = ICON_SIZE - pin_left_x - int(ICON_SIZE * 0.15)
    line_x1 = pin_left_x - 100
    line_x2 = pin_right_x + int(ICON_SIZE * 0.15) + 100
    draw.line([(line_x1, line_y), (line_x2, line_y)], fill=LINE_COLOR_NORMAL, width=5)

    # Weekday
    w_w, w_h = get_text_size(draw, w, weekday_font)
    w_x = (ICON_SIZE - w_w) / 2
    w_y = line_y + 20
    draw.text((w_x, w_y), w, font=weekday_font, fill=WEEKDAY_TEXT_COLOR)

    # Dark
    dark_img = base_image_dark.copy()
    draw_dark = ImageDraw.Draw(dark_img)
    draw_dark.text((month_x, month_y), m, font=month_font, fill=MONTH_TEXT_COLOR)
    draw_dark.text((day_x, day_y), day_str, font=day_font, fill=DAY_TEXT_COLOR_DARK)
    draw_dark.line([(line_x1, line_y), (line_x2, line_y)], fill=LINE_COLOR_DARK, width=5)
    draw_dark.text((w_x, w_y), w, font=weekday_font, fill=WEEKDAY_TEXT_COLOR)

    # Tinted
    tinted_img = make_tinted_version(normal_img)

    # Запис в .appiconset
    appiconset_name = f"icon_{m}_{w}_{d}.appiconset"
    appiconset_path = os.path.join(OUTPUT_DIR, appiconset_name)
    os.makedirs(appiconset_path, exist_ok=True)

    normal_png = os.path.join(appiconset_path, "icon_normal.png")
    dark_png   = os.path.join(appiconset_path, "icon_dark.png")
    tinted_png = os.path.join(appiconset_path, "icon_tinted.png")

    normal_img.save(normal_png, "PNG", optimize=True, compress_level=9)
    dark_img.save(dark_png, "PNG", optimize=True, compress_level=9)
    tinted_img.save(tinted_png, "PNG", optimize=True, compress_level=9)

    generate_contents_json(appiconset_path)

# --------------------------------------------------------------------------------
# MAIN
# --------------------------------------------------------------------------------
def main():
    overall_start = time.time()

    # Обхождаме месеците
    for m in months:
        month_start = time.time()

        # Брой задачи за даден месец (вече без weather)
        month_task_count = len(days) * len(weekdays)

        tasks = []
        with ProcessPoolExecutor(initializer=init_worker) as executor:
            for d in days:
                for w in weekdays:
                    fut = executor.submit(generate_one_appiconset, m, w, d)
                    tasks.append(fut)

            # Отчитаме прогрес
            finished = 0
            for fut in as_completed(tasks):
                finished += 1
                try:
                    fut.result()
                except Exception as e:
                    print(f"Грешка в задача: {e}")

                pct = 100.0 * finished / month_task_count
                print(f"\rОбработка на {m}: {finished}/{month_task_count} ({pct:.1f}%)",
                      end="")

        print()  # нов ред
        month_end = time.time()
        elapsed_month = month_end - month_start
        print(f"Месец {m} е приключен за {elapsed_month:.2f} сек.\n")

    # Финална проверка
    expected_count = len(months) * len(days) * len(weekdays)
    actual_count = 0
    for item in os.listdir(OUTPUT_DIR):
        if item.endswith(".appiconset"):
            actual_count += 1

    if actual_count == expected_count:
        print(f"Успех! Генерирани са {actual_count} .appiconset, колкото се очакваше.")
    else:
        print(f"ВНИМАНИЕ: Генерирани са {actual_count}, а очаквани са {expected_count}.")

    overall_end = time.time()
    elapsed_total = overall_end - overall_start
    print(f"Общо време: {elapsed_total:.2f} сек.")

if __name__ == "__main__":
    main()
