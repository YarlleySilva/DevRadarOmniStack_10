const Dev = require("../models/Dev");
const stringForArry = require("../utils/stringForArray");

module.exports = {
    async index (request, response){
        const { longitude, latitude, techs} = request.query;

        const techsArray = stringForArry(techs);

        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            },
        });

        return response.json({ devs });
    }
}