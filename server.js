const express = require('express');
const axios = require('axios');

const path = require('path')
const sqlite3 = require('sqlite3').verbose();
const utills = require('./utills/utills');

const cacheRouter = require('./routes/v1/cache')
const tileRouter = require('./routes/v1/tile')

const app = express();
app.use(express.urlencoded({extended:false}));

const PORT = 3000;

//const style = 'clde6x6d3000101s0p3av4cud'


const db_name = 'tiles.sqlite'
let styles = new Set();

const db = new sqlite3.Database(db_name, function(err) 
{
    if (err) throw err;
        console.log('[LOG] Connected to the tiles database.');

    db.run(`CREATE TABLE IF NOT EXISTS tiles (
        zoom_level INTEGER,
        tile_column INTEGER,
        tile_row INTEGER,
        tile_style_name STRING,
        tile_style STRING,
        tile_file_path STRING)`, function(err) 
        {
            if (err) throw err;
            console.log("[LOG] Created the tiles table if it didn't exist.")
        });
    
    db.all(`SELECT DISTINCT tile_style_name FROM tiles`, (err, rows) =>
    {   
        if(!err)
            rows.forEach((row)=>
            {
                styles.add(row.tile_style_name);
            });
    });
    
    
});

global.GLOBALS = {db: db, ROOT_DIR: path.resolve(__dirname), STYLES: styles};


app.use('/api/v1/cache/', cacheRouter);
app.use('/api/v1/tile/', tileRouter);


app.listen(PORT, function() 
{
  console.log(`[LOG] Server listening on port ${PORT} ...`);
  
});


/*
Sattelite : https://api.mapbox.com/styles/v1/dgo20/clde6pi23004401lfgsaokmil/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGdvMjAiLCJhIjoiY2xjMXRidm9nMTlpNDNwbW5qczlsNDh1diJ9.WbbBmKc-y5XplzCCyIAtBQ

Monochrome blue : https://api.mapbox.com/styles/v1/dgo20/clde6x6d3000101s0p3av4cud/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGdvMjAiLCJhIjoiY2xjMXRidm9nMTlpNDNwbW5qczlsNDh1diJ9.WbbBmKc-y5XplzCCyIAtBQ

Monochrome dark : https://api.mapbox.com/styles/v1/dgo20/clde6swxi000801mvm9pww2wg/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGdvMjAiLCJhIjoiY2xjMXRidm9nMTlpNDNwbW5qczlsNDh1diJ9.WbbBmKc-y5XplzCCyIAtBQ
*/