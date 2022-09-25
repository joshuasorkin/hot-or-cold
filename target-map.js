class PlayerMap {
    constructor(){
        this.map = new Map();
        this.lat_default = 37.8154
        this.long_default = -122.2550
        this.coordinates_default = {
            latitude:lat_default,
            longitude:long_default
        }
    }

    set(player_id,player_coordinates,target_coordinates=this.coordinates_default){
        let properties = {
            coordinates : {
                player:player_coordinates,
                target:target_coordinates
            }
        }
        this.map.set(playerId,properties);
    }

    get_player_coordinates(playerId){
        return this.map.get(playerId).player_coordinates;
    }

}