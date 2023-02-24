-- SQLite
-- SELECT tile_file_path FROM tiles WHERE zoom_level = 8 AND tile_column = 153 AND tile_row = 115 AND tile_style = 'clde6pi23004401lfgsaokmil';


-- SQLite
-- SELECT * FROM tiles WHERE zoom_level = 15 AND tile_column = 10 AND tile_row = 104 AND tile_style = 'clde6pi23004401lfgsaokmil';

SELECT * FROM tiles ;


-- SELECT DISTINCT tile_style_name FROM tiles;


-- SELECT tile_style_name,
--   REPLACE( tile_file_path, 'clde6swxi000801mvm9pww2wg', 'monochromedark' ) as new_tile_file_path
-- FROM tiles;

UPDATE tiles
SET tile_file_path = REPLACE (tile_file_path, 'clde6x6d3000101s0p3av4cud', 'monochromeblue')
WHERE tile_style_name = 'monochromeblue';
