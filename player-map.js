const Haversine = require('haversine');
class PlayerMap {
    constructor(){
        this.map = new Map();
        this.make_default_player();
    }
    get_map(){
        return this.map;
    }

    make_default_player(){
        let coordinates = {
            latitude:process.env.LATITUDE_DEFAULT,
            longitude:process.env.LONGITUDE_DEFAULT
        }
        this.create_player(process.env.PLAYER_ID_DEFAULT,coordinates);
    }

    create_player(player_id,player_coordinates){
        console.log(`creating new player ${player_id}`);
        let properties = {
            coordinates : player_coordinates,
            player_id:player_id
        }
        this.map.set(player_id,properties);
        properties.closest_target = this.closest_target(player_id)
    }

    closest_target(player_id){
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
        });
        return {
            distance:closest_target_distance,
            id:closest_target_id
        }
    }

    get_rounded_coordinates(coordinates){
        let lat_round = coordinates.latitude.toFixed(4);
        let long_round = coordinates.longitude.toFixed(4);
        return {
            latitude:lat_round,
            longitude:long_round
        }
    }

    //using rounded coordinates to smooth out GPS fluctuation
    get_coordinate_distance(coordinates_1,coordinates_2){
        return Haversine(this.get_rounded_coordinates(coordinates_1),
                            this.get_rounded_coordinates(coordinates_2),{unit: 'meter'});
    }

    update_player_coordinates(player_id,coordinates){
        //get the player's current properties
        let properties = this.get_player_properties(player_id);
        //update position with the player's new coordinates
        properties.coordinates = coordinates;
        //find the new closest target
        let new_closest_target = this.closest_target(player_id);
        console.log({new_closest_target});
        //get the difference between new closest target distance and previous closest target distance
        let closest_target_difference = new_closest_target.distance - properties.closest_target.distance
        //todo: need to deal with edge cases:
        //-there are no other players (new closest target distance = -1)
        properties.closest_target = new_closest_target;
        return closest_target_difference;
    }
    get_player_coordinates(player_id){
        console.log({player_id});
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