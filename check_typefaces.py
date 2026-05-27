"""Check typeface attributes in generated PPTX slide XML."""
import zipfile, re, sys

path = sys.argv[1] if len(sys.argv) > 1 else "quiniela-mundial-2026.pptx"

with zipfile.ZipFile(path) as z:
    for f in sorted(z.namelist()):
        if not (f.startswith('ppt/slides/slide') and f.endswith('.xml')):
            continue
        xml = z.read(f).decode('utf-8')
        latins = re.findall(r'a:latin="([^"]+)"', xml)
        eas = re.findall(r'a:ea="([^"]+)"', xml)
        has_calibri = 'Calibri' in xml
        has_jheng = 'JhengHei' in xml
        sn = f.replace('ppt/slides/slide', '').replace('.xml', '')
        print("Slide {}: latin={} runs, ea={} runs, calibri={}, jhenghei={}".format(
            sn, len(latins), len(eas), has_calibri, has_jheng))
        if latins:
            unique = set(latins)
            print("  latin: {}".format(unique))
        if eas:
            unique = set(eas)
            print("  ea: {}".format(unique))
