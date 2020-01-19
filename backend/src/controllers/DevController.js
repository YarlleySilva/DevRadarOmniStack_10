const axios = require("axios");
const Dev = require("../models/Dev");
const stringForArry = require("../utils/stringForArray");
const { findConnections, sendMessage } = require("../websocket");

//index, show, store, update, destroy (todos os métodos do Controller)

module.exports = {

    //Retorna uma lista de todos os Devs
    async index (request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },


    //Cadastra um novo Dev
    async store (request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
    
        let dev = await Dev.findOne({github_username});

        if(!dev){

            const ApiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const {name = login, avatar_url, bio } = ApiResponse.data;
    
            const techsArray = stringForArry(techs);
    
            const location = {
                type: "Point",
                coordinates: [longitude, latitude],
            };
    
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })

            const sendSocketMessageTo = findConnections({ latitude, longitude}, techsArray);

            sendMessage(sendSocketMessageTo, "new-dev", dev);
            
        }

    
        return response.json(dev);
    }
};