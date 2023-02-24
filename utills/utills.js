const axios = require('axios');
const fs = require("fs");
path = require('path')
config = require('../config/default')

let TILES_DIR_PATH = ''


function isTileExists(z, x, y, db, style_name)
{
    TILES_DIR_PATH = `tiles/${style_name}/`;
    let GET_TILE_PATH_QUERY = `SELECT tile_file_path FROM tiles WHERE zoom_level = ${z} AND tile_column = ${x} AND tile_row = ${y} AND tile_style_name = ?`;
 
    return new Promise((resolve, reject) => 
    {   
        db.get(GET_TILE_PATH_QUERY, style_name, function(err, row) 
        { 
            if (err) 
                reject(err);
            else
            {
                if (row) 
                {
                    let tile_file_path = row.tile_file_path;
                    resolve(tile_file_path);
                } 
                else
                    resolve(null);
            }
            
        });
    })

}
function requestTile(z, x, y, db, style_name)
{

    let style = '';
    if(config.mapbox.styles.hasOwnProperty(style_name))
        style = config.mapbox.styles[style_name];
    else if(style_name != 'dockerosm')
        return -1;  
    
    
    let dockerosm_url = `${config.mapbox.dockerosmBaseUrl}/${z}/${x}/${y}.png`
    
    let url = dockerosm_url;

    if(style_name != 'dockerosm')
    {
        let url = `${config.mapbox.baseUrl}/${config.mapbox.username}/${style}/tiles/256/${z}/${x}/${y}@2x?access_token=${config.mapbox.accessToken}`;
    }

    let INSER_TILE_DATA_QUERY = `INSERT INTO tiles (zoom_level, tile_column, tile_row, tile_style_name, tile_style, tile_file_path) VALUES (${z}, ${x}, ${y}, ?, ?, ?)`
    
    TILES_DIR_PATH = `tiles/${style_name}/`;    
    
    return new Promise((resolve, reject) => 
    {
        axios.get(url, { responseType: 'arraybuffer' })
            .then((response) =>
            {   
                let FILE_NAME = `mapboxtile.${style_name}.${z}.${x}.${y}.png`
                let FILE_PATH = TILES_DIR_PATH + FILE_NAME;

                db.run(INSER_TILE_DATA_QUERY, style_name, style, FILE_PATH, function(err) 
                {
                    if (err) 
                        throw err;
                });

                resolve(response.data)
            })
            .catch((error) => 
            {
                console.log(`[LOG | ERROR | requestTile]`)
                reject(error)
                
            });
    });
}

 
function writeImg(z, x, y, img, style_name)
{
    TILES_DIR_PATH = `tiles/${style_name}/`;    
    
    let FILE_NAME = `mapboxtile.${style_name}.${z}.${x}.${y}.png`
    let FILE_PATH = TILES_DIR_PATH + FILE_NAME;
    return new Promise((resolve, reject) => 
    {
        fs.writeFile(FILE_PATH, img, 'binary', (err) =>
        {
            if (err) 
            {
                console.log(`[LOG | ERROR | writeImg]`)
                reject(err);
            }
            resolve(FILE_PATH);
        });

    });
}



module.exports = { isTileExists, requestTile, writeImg }