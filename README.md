# MapBox Offline Server

MapBox Offline Server is a NodeJS API for caching then serving MapBox tiles for offline use.

## API Main Endpoints

- `/api/v1/cache/{style_name}/{z}/{x}/{y}`:
  - Checks if the requested tile doesn't exists in the database.
  - Requests the tile from MabBox API if it doesn't exist in the database.
  - Stores the requested tile in local storage and saves the request in the database alongside png tile path in the local storage.
  - Returns `200` if the tile already exists in the db.
  - Returns `201` if the tile requested from mapBox API and stored in the local storage, and db.

- `/api/v1/tile/{style_name}/{z}/{x}/{y}`:
  - Checks if the requested tile exists in the database.
  - Returns `200` with the tile png file if the tile exists in the db.
  - Returns `404` if the tile requested doesn't exists in the database.
  - This endpoint works entirely offline, and doesn't request any new tiles online from mapBox API.

### Notes

- The server caches the tiles in `tiles/` as png files.
- The tiles paths are stored in a SQLite database in `tiles.sqlite` file. 
- Replace the `tiles/` directory and `tiles.sqlite` file if you cached new tiles on another pc.

## How to Run

- Clone the repository
  
```bash
git clone https://github.com/a7medayman6/Mapbox-Offline-Server
cd Mapbox-Offline-Server
```
### Using NodeJS

```bash
node server.js
```

### Using Docker Compose

```bash
docker compose up
```

