const connection = require("../../src/database/connection");

module.exports = async () => {
    await connection("incidents").truncate();
    await connection("ongs").truncate();
};
