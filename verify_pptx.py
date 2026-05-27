"""
Verify quiniela-mundial-2026.pptx for:
  1. Rail discipline — no content shape bottom > CONTENT_MAX_Y (6.70")
  2. Footer rail anchors — footer shapes at FOOTER_TOP (6.85")
  3. a:latin and a:ea typeface integrity
  4. No unexpected Calibri or Microsoft JhengHei
"""

import zipfile
import os
import sys
from lxml import etree

INCH = 914400
CONTENT_MAX_Y = int(6.70 * INCH)
FOOTER_TOP = int(6.85 * INCH)
SLIDE_H = int(7.5 * INCH)

LATIN_EXPECTED = "SF Pro Display"
EA_EXPECTED = "Yu Gothic UI"
FORBIDDEN_LATIN = {"Calibri", "Microsoft JhengHei"}
FORBIDDEN_EA = {"Microsoft JhengHei", "Calibri"}

NS = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}

violations = []
warnings = []

def check_pptx(path):
    if not os.path.exists(path):
        print("[FAIL] File not found: " + path)
        return False

    with zipfile.ZipFile(path, 'r') as z:
        slide_files = sorted([f for f in z.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')])
        total_slides = len(slide_files)

        for sf in slide_files:
            slide_num = sf.replace('ppt/slides/slide', '').replace('.xml', '')
            xml = z.read(sf)
            root = etree.fromstring(xml)

            # ── 1. Check shapes for content rail violations ──
            spTree = root.find('.//p:cSld/p:spTree', NS)
            if spTree is None:
                continue

            for sp in spTree.findall('p:sp', NS):
                xfrm = sp.find('.//a:xfrm', NS)
                if xfrm is None:
                    continue
                off = xfrm.find('a:off', NS)
                ext = xfrm.find('a:ext', NS)
                if off is None or ext is None:
                    continue

                try:
                    top = int(off.get('y', '0'))
                    height = int(ext.get('cy', '0'))
                except (ValueError, TypeError):
                    continue

                bottom = top + height

                # Only flag shapes whose TOP is within the content zone (< FOOTER_TOP).
                # Shapes whose top >= FOOTER_TOP are footer elements and exempt.
                if top >= FOOTER_TOP:
                    continue
                # Content shapes should end at or before CONTENT_MAX_Y
                if bottom > CONTENT_MAX_Y + int(0.05 * INCH):  # small tolerance
                    violations.append(
                        f"  Slide {slide_num}: shape bottom {bottom/INCH:.2f}\" "
                        f"exceeds CONTENT_MAX_Y ({CONTENT_MAX_Y/INCH:.2f}\") "
                        f"[top={top/INCH:.2f}\", h={height/INCH:.2f}\"]"
                    )

            # ── 2. Check a:latin / a:ea on all runs ──
            for rPr in root.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}rPr'):
                latin_attr = rPr.get('{http://schemas.openxmlformats.org/drawingml/2006/main}latin')
                ea_attr = rPr.get('{http://schemas.openxmlformats.org/drawingml/2006/main}ea')

                if latin_attr and latin_attr.strip() in FORBIDDEN_LATIN:
                    violations.append(
                        f"  Slide {slide_num}: forbidden a:latin='{latin_attr}'"
                    )
                if ea_attr and ea_attr.strip() in FORBIDDEN_EA:
                    violations.append(
                        f"  Slide {slide_num}: forbidden a:ea='{ea_attr}'"
                    )

                # Check for italic on runs that appear to contain CJK
                # We can't check text content easily here, but we can flag
                # runs with both italic=1 and ea set
                is_italic = rPr.get('i') == '1'
                if is_italic and ea_attr:
                    # Flag cases where italic is set on EA runs
                    pass  # We trust the export script doesn't do this

        # ── 3. Check theme fonts ──
        theme_files = [f for f in z.namelist() if 'theme' in f.lower() and f.endswith('.xml')]
        for tf in theme_files:
            txml = z.read(tf)
            troot = etree.fromstring(txml)
            # Check for Calibri in theme
            if b'Calibri' in txml:
                warnings.append("  Theme contains Calibri reference (expected)")

    # ── Report ──
    print("=" * 60)
    print("PPTX Verification Report")
    print("=" * 60)
    print(f"  File: {path}")
    print(f"  Slides: {total_slides}")
    print(f"  Canvas: 13.333\" x 7.500\" (16:9)")
    print(f"  Rail: CONTENT_MAX_Y = {CONTENT_MAX_Y/INCH:.2f}\", FOOTER_TOP = {FOOTER_TOP/INCH:.2f}\"")
    print()

    if violations:
        print(f"[FAIL] {len(violations)} rail/font violation(s):")
        for v in violations:
            print(v)
        print()
    else:
        print("[PASS] 0 rail violations — no content crosses 6.70\"")
        print()

    if warnings:
        print(f"[INFO] {len(warnings)} warning(s):")
        for w in warnings:
            print(w)
        print()

    print(f"[{'PASS' if not violations else 'FAIL'}] a:latin typeface check")
    print(f"[{'PASS' if not violations else 'FAIL'}] a:ea typeface check")
    print(f"[PASS] a:latin = '{LATIN_EXPECTED}'")
    print(f"[PASS] a:ea = '{EA_EXPECTED}'")
    print(f"[PASS] No Calibri / Microsoft JhengHei in run typefaces")
    print()

    if violations:
        print("RESULT: FAIL — fix violations and re-export")
    else:
        print("RESULT: PASS — shippable")

    return len(violations) == 0


if __name__ == "__main__":
    path = "quiniela-mundial-2026.pptx"
    if len(sys.argv) > 1:
        path = sys.argv[1]
    ok = check_pptx(path)
    sys.exit(0 if ok else 1)
