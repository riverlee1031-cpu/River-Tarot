"""Preserve the original cafe scene while cleaning decorations and animating vinyl."""
from pathlib import Path
from math import cos, sin, tau
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
source = Image.open(ROOT / 'assets/river-cat-cafe.gif')
frames = []
durations = []
for step in range(source.n_frames * 2):
    source.seek(step // 2)
    frame = source.convert('RGB')
    draw = ImageDraw.Draw(frame)
    # Extend untouched background scanlines over the lettering and door ornament.
    for left, top, right, bottom, sample_x in [(23, 26, 177, 51, 220), (33, 493, 80, 567, 90), (22, 595, 248, 616, 270)]:
        for y in range(top, bottom + 1):
            draw.line((left, y, right, y), fill=frame.getpixel((sample_x, y)))
    cx, cy, radius = 350, 550, 40
    draw.ellipse((cx-radius, cy-radius, cx+radius, cy+radius), fill='#100e17', outline='#776084', width=1)
    for r in range(15, 39, 3):
        draw.ellipse((cx-r, cy-r, cx+r, cy+r), outline='#2b2436')
    angle = step * tau / (source.n_frames * 2)
    for r in range(18, 38, 3):
        for offset in (0, 180):
            start = angle * 360 / tau + offset
            draw.arc((cx-r, cy-r, cx+r, cy+r), start, start+32, fill='#685371', width=1)
    draw.ellipse((cx-10, cy-10, cx+10, cy+10), fill='#9c5bab', outline='#cc91d3')
    px, py = round(cx+6*cos(angle)), round(cy+6*sin(angle))
    draw.rectangle((px-1, py-1, px+1, py+1), fill='#f0c6eb')
    draw.ellipse((cx-2, cy-2, cx+2, cy+2), fill='#171021')
    frames.append(frame)
    durations.append(50 if step % 2 == 0 else 60)

# One shared palette prevents color flicker across animation frames.
palette = frames[0].quantize(colors=128)
indexed = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
out = ROOT / 'assets/river-cat-vinyl.gif'
indexed[0].save(out, save_all=True, append_images=indexed[1:], duration=durations, loop=0, disposal=1, optimize=True)
with Image.open(out) as check:
    assert check.size == source.size and check.n_frames == len(frames)
    assert check.info['loop'] == 0
print(f'{out.name}: {len(frames)} frames, {sum(durations)} ms, {out.stat().st_size} bytes')
frames[0].save(ROOT / 'cat-preview.png')
