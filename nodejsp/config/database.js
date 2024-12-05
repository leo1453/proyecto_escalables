const mongoose = require("mongoose");

const connectDB = () => {
    mongoose.connect(process.env.CONNECTION_STRING,{
        dbName: process.env.DB_NAME
    }).then(
        () => {
        console.log("Conexion exitosa con la base de datos");
        }
    ).catch(
        (error) => {
        console.log("Error al conectar con la base de datos");
        }
    )
}

module.exports = connectDB;