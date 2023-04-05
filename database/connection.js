const mongoose = require("mongoose"); //Obtener objeto de mongoose

const connection = async() => {

    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect("mongodb://127.0.0.1:27017/mi_blog"); //Hacer la conexión  await para esperar a que haga la conexión
        console.log("Conectado correctamente a la base de datos mi_blog");
    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}

module.exports = {connection} //Para exportar la conexión y asi utilizarla en otros metodos