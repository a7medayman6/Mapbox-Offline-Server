const express = require('express');

const router = express.Router();

const fs = require("fs");

const utills = require('../../utills/utills');

router.get('/:style_name/:z/:x/:y', async(req, res) =>
{
    /* Get the URL parameters */

    let style_name = req.params.style_name;
    let z = req.params.z;
    let x = req.params.x;
    let y = req.params.y;
    
    if(!GLOBALS.STYLES.has(style_name))
    {   
        TILES_DIR_PATH = `${GLOBALS.ROOT_DIR}/tiles/${style_name}/`;
        if(!fs.existsSync(TILES_DIR_PATH))
            fs.mkdirSync(TILES_DIR_PATH);
        GLOBALS.STYLES.add(style_name)
    }

    console.log(`[LOG] ${req.hostname} requested /api/v1/cache/${style_name}/${z}/${x}/${y}`);


    console.log(`[LOG … ${z}/${x}/${y}] Checking if tile file exists locally ... `);
    
    await utills.isTileExists(z, x, y, GLOBALS.db, style_name)
        .then((tile_file_path) => 
            {
                if(tile_file_path)
                {
                    console.log(`[LOG … ${z}/${x}/${y}] Found tile file exists locally, sending 200 ... `);
                    res.status(200).json({message: `The tile ${style_name}.${z}.${x}.${y} file already cached.`})
                    //res.status(200).sendFile(tile_file_path, { root: GLOBALS.ROOT_DIR });    
                }
                else
                    throw new Error();
            })
        .catch(async(err) => 
            {
                console.log(`[LOG … ${z}/${x}/${y}] Tile file doesn't exists locally, requesting it ... `);

                await utills.requestTile(z, x, y, GLOBALS.db, style_name)
                    .then(async(binaryImage) =>
                        {
                            if(binaryImage)
                            {

                                console.log(`[LOG … ${z}/${x}/${y}] Requested tile successfully, sending it ... `);
                                
                                await utills.writeImg(z, x, y, binaryImage, style_name)
                                    .then((tile_file_path) =>
                                    {
                                        if(tile_file_path)
                                            res.status(201).json({message: "The tile file cached successfully."})
                                        else
                                            throw new Error();
                                        //res.status(201).sendFile(tile_file_path, { root: GLOBALS.ROOT_DIR });
                                    })
                                    .catch(() =>
                                    {
                                        throw new Error("Failed Writing the Image.")
                                    })
                            }
                            else
                                throw new Error("Failed requesting the image.")

                        })
                    .catch((err) => 
                        {
                            if(err) console.log(`[LOG | ERR] ${err}`)

                            res.status(500).json({message: 'Mapbox server error, maybe timedout.', error: err});
                        });
            });
    
})

module.exports = router;