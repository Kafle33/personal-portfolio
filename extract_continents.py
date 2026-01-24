import json

def extract_coordinates(geojson_path):
    with open(geojson_path, 'r') as f:
        data = json.load(f)
    
    continents = []
    for feature in data['features']:
        geometry = feature['geometry']
        if geometry['type'] == 'Polygon':
            # GeoJSON is [lon, lat], we want [lat, lon]
            polygon = [[round(coord[1], 2), round(coord[0], 2)] for coord in geometry['coordinates'][0]]
            continents.append(polygon)
        elif geometry['type'] == 'MultiPolygon':
            for poly in geometry['coordinates']:
                polygon = [[round(coord[1], 2), round(coord[0], 2)] for coord in poly[0]]
                continents.append(polygon)
    
    return continents

if __name__ == "__main__":
    continents = extract_coordinates('ne_110m_land.geojson')
    print(json.dumps(continents))
