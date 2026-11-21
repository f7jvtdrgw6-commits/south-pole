#!/usr/bin/env python3
"""South Pole app icons, drawn the same way as North Pole's current icon
(icon-options/ref1/gen.py): hand-authored SVG, rendered with cairosvg,
same navy sky, gold 4-point stars, soft snow mound, glossy flat style.
"""
from pathlib import Path
import cairosvg
from PIL import Image, ImageDraw, ImageFont

OUT = Path('/workspace/southpole/icons')
OUT.mkdir(parents=True, exist_ok=True)
APP = Path('/workspace/southpole/app')
APP.mkdir(parents=True, exist_ok=True)

DEFS = '''
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#1A2440"/>
  <stop offset="1" stop-color="#070B17"/>
</linearGradient>
<radialGradient id="halo" cx=".5" cy=".5" r=".5">
  <stop offset="0" stop-color="#FFE08A" stop-opacity=".85"/>
  <stop offset=".3" stop-color="#FFC04A" stop-opacity=".3"/>
  <stop offset="1" stop-color="#FFB040" stop-opacity="0"/>
</radialGradient>
<linearGradient id="gd" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#FFF7D6"/>
  <stop offset=".55" stop-color="#FFD866"/>
  <stop offset="1" stop-color="#F2B03A"/>
</linearGradient>
<linearGradient id="rd" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#F0313D"/>
  <stop offset="1" stop-color="#C8141F"/>
</linearGradient>
<linearGradient id="sn" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#FFFDF7"/>
  <stop offset="1" stop-color="#E6E0D4"/>
</linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#C8DEFF" stop-opacity=".28"/>
  <stop offset=".45" stop-color="#8EB4E8" stop-opacity=".10"/>
  <stop offset="1" stop-color="#6A90C8" stop-opacity=".18"/>
</linearGradient>
<radialGradient id="globeFill" cx=".42" cy=".32" r=".7">
  <stop offset="0" stop-color="#1E3A5C" stop-opacity=".15"/>
  <stop offset=".55" stop-color="#16304A" stop-opacity=".35"/>
  <stop offset="1" stop-color="#0C1A30" stop-opacity=".55"/>
</radialGradient>
<linearGradient id="snowin" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#FFFDF8"/>
  <stop offset="1" stop-color="#E8E2D4"/>
</linearGradient>
<radialGradient id="body" cx=".38" cy=".32" r=".7">
  <stop offset="0" stop-color="#FFFFFF"/>
  <stop offset=".55" stop-color="#F4EFE6"/>
  <stop offset="1" stop-color="#D9D2C4"/>
</radialGradient>
<linearGradient id="baseg" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#FFF1C2"/>
  <stop offset=".45" stop-color="#FFD866"/>
  <stop offset="1" stop-color="#E0A02A"/>
</linearGradient>
<linearGradient id="baserim" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#FFE9A0"/>
  <stop offset="1" stop-color="#C88818"/>
</linearGradient>
<linearGradient id="cyl" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#3a0a10" stop-opacity=".35"/>
  <stop offset=".3" stop-color="#fff" stop-opacity=".18"/>
  <stop offset=".55" stop-color="#fff" stop-opacity="0"/>
  <stop offset="1" stop-color="#2a0508" stop-opacity=".45"/>
</linearGradient>
<linearGradient id="hat" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#2A303C"/>
  <stop offset="1" stop-color="#12151C"/>
</linearGradient>
'''

def star(cx, cy, rx, ry, f, k=.16):
    a, b = rx * k, ry * k
    return (f'<path d="M{cx},{cy-ry} C{cx+a*.5},{cy-b*1.6} {cx+a*1.6},{cy-b*.5} {cx+rx},{cy} '
            f'C{cx+a*1.6},{cy+b*.5} {cx+a*.5},{cy+b*1.6} {cx},{cy+ry} '
            f'C{cx-a*.5},{cy+b*1.6} {cx-a*1.6},{cy+b*.5} {cx-rx},{cy} '
            f'C{cx-a*1.6},{cy-b*.5} {cx-a*.5},{cy-b*1.6} {cx},{cy-ry}Z" fill="{f}"/>')

def sparkles(bold=False):
    pts = ([(200, 430, 18), (820, 440, 18), (170, 680, 14), (850, 690, 14),
            (300, 300, 8), (730, 290, 8), (260, 820, 8), (760, 830, 8),
            (230, 560, 6), (790, 570, 6)] if not bold else
           [(200, 430, 24), (820, 440, 24), (170, 680, 18), (850, 690, 18),
            (300, 300, 10), (730, 290, 10)])
    return ''.join(star(cx, cy, r, r, '#FFD77A', .22) for cx, cy, r in pts)

def snowman(cx, mid_y, s):
    """Classic little snowman, glossy, with candy-stripe scarf."""
    # s is scale vs 1.0 around mid body
    r3, r2, r1 = 56*s, 42*s, 30*s
    y3 = mid_y + 48*s          # bottom
    y2 = y3 - r3 - r2 + 14*s   # mid
    y1 = y2 - r2 - r1 + 10*s   # head
    # arms
    arms = (f'<path d="M{cx-r2-2},{y2-4*s} Q{cx-r2-36*s},{y2-22*s} {cx-r2-48*s},{y2-8*s}" '
            f'fill="none" stroke="#6A4A2A" stroke-width="{4.2*s}" stroke-linecap="round"/>'
            f'<path d="M{cx+r2+2},{y2-4*s} Q{cx+r2+36*s},{y2-22*s} {cx+r2+50*s},{y2-10*s}" '
            f'fill="none" stroke="#6A4A2A" stroke-width="{4.2*s}" stroke-linecap="round"/>')
    # scarf (red/white) — sits between head and mid
    sy = y1 + r1 - 2*s
    scarf = (f'<path d="M{cx-r1-6*s},{sy} Q{cx},{sy+10*s} {cx+r1+6*s},{sy} '
             f'L{cx+r1+4*s},{sy+12*s} Q{cx},{sy+20*s} {cx-r1-4*s},{sy+12*s}Z" fill="url(#rd)"/>'
             f'<path d="M{cx+10*s},{sy+8*s} L{cx+22*s},{sy+58*s} Q{cx+28*s},{sy+70*s} {cx+14*s},{sy+68*s} '
             f'L{cx+4*s},{sy+14*s}Z" fill="url(#rd)"/>'
             f'<rect x="{cx+10*s}" y="{sy+20*s}" width="{12*s}" height="{6*s}" fill="#FBF7F1" opacity=".9" transform="rotate(18 {cx+16*s} {sy+23*s})"/>'
             f'<rect x="{cx+14*s}" y="{sy+36*s}" width="{12*s}" height="{6*s}" fill="#FBF7F1" opacity=".9" transform="rotate(18 {cx+20*s} {sy+39*s})"/>')
    # hat
    hw, hh, br = 28*s, 22*s, 40*s
    hat = (f'<rect x="{cx-br}" y="{y1-r1+6*s}" width="{br*2}" height="{7*s}" rx="{2*s}" fill="url(#hat)"/>'
           f'<rect x="{cx-hw}" y="{y1-r1-hh+8*s}" width="{hw*2}" height="{hh}" rx="{3*s}" fill="url(#hat)"/>'
           f'<rect x="{cx-hw}" y="{y1-r1+2*s}" width="{hw*2}" height="{4*s}" fill="url(#rd)"/>')
    # face
    eye = 3.1*s
    face = (f'<circle cx="{cx-8*s}" cy="{y1-2*s}" r="{eye}" fill="#1A1C22"/>'
            f'<circle cx="{cx+9*s}" cy="{y1-2*s}" r="{eye}" fill="#1A1C22"/>'
            f'<path d="M{cx+2*s},{y1+6*s} L{cx+20*s},{y1+3*s} L{cx+2*s},{y1+10*s}Z" fill="#E87820"/>'
            f'<path d="M{cx-8*s},{y1+13*s} Q{cx},{y1+18*s} {cx+10*s},{y1+13*s}" fill="none" stroke="#1A1C22" stroke-width="{1.8*s}" stroke-linecap="round"/>')
    buttons = ''.join(
        f'<circle cx="{cx}" cy="{y}" r="{3.4*s}" fill="#1A1C22"/>'
        for y in (y2 - 8*s, y2 + 8*s, y3 - 8*s)
    )
    shine = (f'<ellipse cx="{cx-r3*.28}" cy="{y3-r3*.25}" rx="{r3*.28}" ry="{r3*.18}" fill="#fff" opacity=".45"/>'
             f'<ellipse cx="{cx-r2*.28}" cy="{y2-r2*.28}" rx="{r2*.24}" ry="{r2*.14}" fill="#fff" opacity=".45"/>'
             f'<ellipse cx="{cx-r1*.28}" cy="{y1-r1*.28}" rx="{r1*.22}" ry="{r1*.12}" fill="#fff" opacity=".5"/>')
    return (f'<circle cx="{cx}" cy="{y3}" r="{r3}" fill="url(#body)"/>'
            f'<circle cx="{cx}" cy="{y2}" r="{r2}" fill="url(#body)"/>'
            f'<circle cx="{cx}" cy="{y1}" r="{r1}" fill="url(#body)"/>'
            + shine + arms + scarf + hat + face + buttons)


def globe(option, bold=False, mask=False):
    # option: 'A' classic, 'B' bolder/larger, 'C' candy-stripe base
    if option == 'B' or bold:
        cx, cy, R = 512, 470, 300
        sm_scale, sm_y = 1.22, 508
    else:
        cx, cy, R = 512, 478, 278
        sm_scale, sm_y = 1.14, 512

    clip = f'<clipPath id="gc"><circle cx="{cx}" cy="{cy}" r="{R}"/></clipPath>'
    # inner snowbank — a soft hill sitting in the bottom third of the globe
    inner = (
        f'<g clip-path="url(#gc)">'
        f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#globeFill)"/>'
        f'<path d="M{cx-R},{cy+R*0.22} '
        f'C{cx-R*0.55},{cy+R*0.02} {cx-R*0.2},{cy+R*0.18} {cx},{cy+R*0.08} '
        f'C{cx+R*0.25},{cy-R*0.02} {cx+R*0.6},{cy+R*0.16} {cx+R},{cy+R*0.28} '
        f'L{cx+R},{cy+R+2} L{cx-R},{cy+R+2}Z" fill="url(#snowin)"/>'
        + ''.join(
            f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" opacity=".9"/>'
            for x, y, r in [
                (cx-88, cy-70, 3.0), (cx-36, cy-128, 2.2), (cx+64, cy-100, 2.8),
                (cx+110, cy-36, 2.2), (cx-120, cy-16, 1.8), (cx+24, cy-62, 2.4),
                (cx-8, cy-36, 1.6), (cx+86, cy-148, 2.0),
            ]
        )
        + snowman(cx, sm_y, sm_scale)
        + '</g>'
    )

    glass = (
        f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="#9EC4F0" fill-opacity=".08"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{R-1.5}" fill="none" stroke="#F4F8FF" stroke-width="7" stroke-opacity=".62"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-opacity=".28"/>'
        f'<ellipse cx="{cx-R*0.36}" cy="{cy-R*0.44}" rx="{R*0.26}" ry="{R*0.14}" fill="#fff" opacity=".62"/>'
        f'<ellipse cx="{cx+R*0.38}" cy="{cy+R*0.20}" rx="{R*0.11}" ry="{R*0.055}" fill="#fff" opacity=".20"/>'
    )

    cap_y = cy - R
    cap = (
        f'<ellipse cx="{cx}" cy="{cap_y+2}" rx="22" ry="10" fill="url(#gd)"/>'
        f'<circle cx="{cx}" cy="{cap_y-2}" r="15" fill="url(#gd)"/>'
    )
    star_halo = f'<circle cx="{cx}" cy="{cap_y-68}" r="150" fill="url(#halo)"/>'
    top_star = star(cx, cap_y - 74, 50, 62, 'url(#gd)', .24) + star(cx, cap_y - 74, 17, 21, '#FFF6D8', .2)

    # Pedestal hugs the bottom of the globe, like a real snow-globe stand
    by = cy + R * 0.72
    bw = 360 if option == 'B' else 330
    bh = 118
    ped_path = (
        f'M{cx-bw/2+8},{by} '
        f'C{cx-bw/2-6},{by+22} {cx-bw/2+10},{by+36} {cx-bw/2+28},{by+48} '
        f'L{cx-bw/2+48},{by+bh} '
        f'C{cx-bw/2+56},{by+bh+18} {cx-bw/2+88},{by+bh+22} {cx},{by+bh+22} '
        f'C{cx+bw/2-88},{by+bh+22} {cx+bw/2-56},{by+bh+18} {cx+bw/2-48},{by+bh} '
        f'L{cx+bw/2-28},{by+48} '
        f'C{cx+bw/2-10},{by+36} {cx+bw/2+6},{by+22} {cx+bw/2-8},{by}Z'
    )
    ped = (
        f'<path d="{ped_path}" fill="url(#baseg)"/>'
        f'<ellipse cx="{cx}" cy="{by+8}" rx="{bw/2-18}" ry="14" fill="url(#baserim)"/>'
        f'<path d="M{cx-bw/2+16},{by+2} Q{cx},{by+12} {cx+bw/2-16},{by+2}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3"/>'
    )
    extra_defs = clip
    if option == 'C':
        stripes = ''.join(
            f'<path d="M{x},{by+16} L{x+26},{by+16} L{x+2},{by+bh+22} L{x-24},{by+bh+22}Z" fill="url(#rd)"/>'
            for x in range(int(cx-bw/2+36), int(cx+bw/2-20), 44)
        )
        extra_defs += f'<clipPath id="bc"><path d="{ped_path}"/></clipPath>'
        ped += (
            f'<g clip-path="url(#bc)" opacity=".95">{stripes}'
            f'<rect x="0" y="{by}" width="1024" height="220" fill="url(#cyl)"/></g>'
            f'<ellipse cx="{cx}" cy="{by+8}" rx="{bw/2-18}" ry="14" fill="url(#baserim)"/>'
            f'<path d="M{cx-bw/2+16},{by+2} Q{cx},{by+12} {cx+bw/2-16},{by+2}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>'
        )

    mound = '<path d="M80,1024 C150,900 320,808 512,808 C704,808 874,900 944,1024Z" fill="url(#sn)"/>'
    # Order: sparks, halo, star, globe interior, glass, pedestal (tucked under globe), mound in front of stand's feet
    body = sparkles(bold=(option == 'B')) + star_halo + top_star + cap + inner + glass + ped + mound
    if mask:
        body = f'<g transform="translate(512 512) scale(.74) translate(-512 -512)">{body}</g>'
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">'
        f'<defs>{DEFS}{extra_defs}</defs><rect width="1024" height="1024" fill="url(#bg)"/>{body}</svg>'
    )

def render_svg(svg, path, size=1024, bg='#0B1124'):
    cairosvg.svg2png(bytestring=svg.encode(), write_to=str(path),
                     output_width=size, output_height=size, background_color=bg)

def rounded(im, size):
    t = im.convert('RGB').resize((size, size), Image.LANCZOS)
    m = Image.new('L', (size * 4,) * 2)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size * 4 - 1, size * 4 - 1],
                                        radius=int(size * 4 * .2237), fill=255)
    return t, m.resize((size, size), Image.LANCZOS)

def main():
    options = {
        'A-classic': dict(option='A'),
        'B-bold': dict(option='B', bold=True),
        'C-stripe-base': dict(option='C'),
        'A-maskable': dict(option='A', mask=True),
        'B-maskable': dict(option='B', bold=True, mask=True),
        'C-maskable': dict(option='C', mask=True),
    }
    for name, kw in options.items():
        svg = globe(**kw)
        (OUT / f'option-{name}.svg').write_text(svg)
        render_svg(svg, OUT / f'option-{name}.png')
        print('wrote', name)

    # comparison sheet: North Pole current + 3 South Pole options
    np = Image.open('/workspace/northpole/public/icon-512-v8.png').convert('RGB')
    items = [
        (None, 'North Pole', np),
        ('option-A-classic.png', 'A · Classic', None),
        ('option-B-bold.png', 'B · Bold', None),
        ('option-C-stripe-base.png', 'C · Stripe base', None),
    ]
    W, H = 1480, 620
    bg = Image.new('RGB', (W, H), (14, 18, 30))
    d = ImageDraw.Draw(bg)
    for y in range(H):
        d.line([(0, y), (W, y)], fill=(int(40 + 40 * y / H), int(30 + 20 * y / H), int(70 + 40 * y / H)))
    try:
        F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 24)
        F2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
    except Exception:
        F = F2 = ImageFont.load_default()
    d.text((740, 36), 'Same art family  ·  North Pole  →  South Pole', fill='white', font=F, anchor='mm')
    for i, (p, label, im0) in enumerate(items):
        im = im0 if im0 is not None else Image.open(OUT / p)
        x = 50 + i * 360
        t, m = rounded(im, 280)
        bg.paste(t, (x, 80), m)
        d.text((x + 140, 390), label, fill='white', font=F, anchor='mm')
        t2, m2 = rounded(im, 60)
        bg.paste(t2, (x + 70, 430), m2)
        t3, m3 = rounded(im, 40)
        bg.paste(t3, (x + 170, 440), m3)
        d.text((x + 140, 530), '280  ·  60  ·  40', fill=(180, 180, 200), font=F2, anchor='mm')
    bg.save(OUT / 'comparison.png')
    print('comparison written')

if __name__ == '__main__':
    main()
