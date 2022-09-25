class PlayerMap {
    constructor(){
        this.map = new Map();
        this.lat_default = 37.8154
        this.long_default = -122.2550
        this.coordinates_default = {
            latitude:this.lat_default,
            longitude:this.long_default
        }
    }
    get_map(){
        return this.map;
    }

    set_player(player_id,player_coordinates,target_coordinates=this.coordinates_default){
        let properties = {
            coordinates : {
                player:player_coordinates,
                target:target_coordinates
            },
            player_id:player_id
        }
        this.map.set(player_id,properties);
    }

    set_player_coordinates(player_id,coordinates){
        let properties = this.get_player_properties(player_id);
        properties.coordinates.player = coordinates;
    }
    get_player_coordinates(player_id){
        return this.map.get(player_id).coordinates.player;
    }

    get_player_properties(player_id){
        return this.map.get(player_id);
    }

    remove_player(player_id){
        this.map.delete(player_id);
    }

}

module.exports = PlayerMap