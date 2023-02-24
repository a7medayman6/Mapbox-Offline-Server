const config = 
{
    mapbox: 
    {
        baseUrl: 'https://api.mapbox.com/styles/v1',
        username: 'YOUR_MAPBOX_USERNAME',
        accessToken: 'YOUR_ACCESS_TOKEN',
        
        dockerosmBaseUrl: 'https://tile.openstreetmap.org',

        styles:
        {
            'monochromeblue': 'MONOCHROME_BLUE_PERSONAL_STYLE_STRING',
            'monochromedark': 'MONOCHROME_DARK_PERSONAL_STYLE_STRING',
            'sattelite': 'SATTELITE_PERSONAL_STYLE_STRING',
        }

    },
}


module.exports = Object.freeze(config)