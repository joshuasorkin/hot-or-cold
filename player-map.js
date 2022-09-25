const Haversine = require('haversine');
class PlayerMap {
    constructor(){
        this.map = new Map();
    }
    get_map(){
        return this.map;
    }

    create_player(player_id,player_coordinates){
        let properties = {
            coordinates : player_coordinates,
            player_id:player_id
        }
        this.map.set(player_id,properties);
    }

    closest_target_distance(player_id){
        let player_coordinates = this.get_player_coordinates(player_id);
        let closest_target_id;
        //default to negative until a target is found
        let closest_target_distance = -1;
        this.map.forEach((target_properties,target_id)=>{
            if(target_id !== player_id){
                let target_distance = this.get_coordinate_distance(player_coordinates,target_properties.coordinates);
                //initialize closest distance, or update it if we found a closer target
                if (closest_target_distance === -1 || closest_target_distance > target_distance){
                    closest_target_distance = target_distance;
                    closest_target_id = target_id;
                }
            }
        }
    }

    get_coordinate_distance(coordinates_1,coordinates_2){
        return Haversine(coordinates_1,coordinates_2,{unit: meter});
    }

    update_player_coordinates(player_id,coordinates){
        let properties = this.get_player_properties(player_id);
        properties.coordinates = coordinates;
    }
    get_player_coordinates(player_id){
        return this.map.get(player_id).coordinates;
    }

    get_player_properties(player_id){
        return this.map.get(player_id);
    }

    remove_player(player_id){
        this.map.delete(player_id);
    }

    player_exists(player_id){
        return this.map.has(player_id);
    }

}

module.exports = PlayerMap