import urllib.request
import re
import json

def fetch_url(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Failed fetching {url}: {e}")
        return None

html = fetch_url('https://devforge-sam.vercel.app/')
if not html:
    exit(1)

js_files = re.findall(r'src=["\']/assets/(index-[a-zA-Z0-9_-]+\.js)["\']', html)
if not js_files:
    print('No main JS found.')
    exit(1)

js_url = f'https://devforge-sam.vercel.app/assets/{js_files[0]}'
print(f'Fetching {js_url}...')

map_url = js_url + '.map'
print(f'Fetching {map_url}...')

map_data = fetch_url(map_url)
if not map_data:
    print('Failed to download source map.')
    exit(1)

try:
    map_json = json.loads(map_data)
    for i, source_path in enumerate(map_json['sources']):
        if 'LocalSupport.tsx' in source_path:
            source_content = map_json['sourcesContent'][i]
            with open('src/components/home/LocalSupport.tsx', 'w', encoding='utf-8') as f:
                f.write(source_content)
            print('Extracted LocalSupport.tsx from source map successfully.')
            exit(0)
    print('LocalSupport.tsx not found in source map.')
except Exception as e:
    print('Failed to parse source map:', e)
