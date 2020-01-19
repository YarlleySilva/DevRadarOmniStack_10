module.exports = function stringForArray(stringAsArray) {
    return stringAsArray.split(",").map(tech => tech.trim());
}