"use strict";

const get = async (req, res) => {
    return res.send({ response: "I am alive" }).status(200);
};

module.exports = {
    get
};