const express = require('express');

const router = express.Router();

const sqlite3 = require('sqlite3').verbose();

const utills = require('../../utills/utills');


router.get('/:style_name/:z/:x/:y', async(req, res) =>
{
    let style_name = req.params.style_name;
    let z = req.params.z;
    let x = req.params.x;
    let y = req.params.y;

    console.log(`[LOG] ${req.hostname} requested /api/v1/tile/${style_name}/${z}/${x}/${y}`);

    await utills.isTileExists(z, x, y, GLOBALS.db, style_name)
    .then((tile_file_path) => 
        {
            if(tile_file_path)
            {
                console.log(`[LOG … ${z}/${x}/${y}] Checking if tile file exists locally ... `);
                console.log(`[LOG … ${z}/${x}/${y}] Found tile file exists locally, sending it ... `);
                
                res.status(200).sendFile(tile_file_path, { root: GLOBALS.ROOT_DIR });
            }
            else    
                throw new Error()

        })
    .catch(() => 
        {
            console.log(`[LOG … ${z}/${x}/${y}] Tile file doesn't exists locally, this tile is outside the cached range. `);

            res.status(404).json({message: 'The requested tile is outside the cached range area.'});
        });;
   
})


module.exports = router;