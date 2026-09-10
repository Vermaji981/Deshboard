const app = require("../../api/index.js");

module.exports = (req, res) => {
    return app(req, res);
};
