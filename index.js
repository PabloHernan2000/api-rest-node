const connection = require("./database/connection");
const express = require("express");//Para el servidor de Node
const cors = require("cors");

//Inicializar
console.log("App de node funcionando")

//Conectar a la base de datos
connection.connection();

//Crear servidor Node
const app = express();
const puerto = 3900;

//Configurar cors
app.use(cors()); //Un middleware se ejecuta antes de cualquier cosa

//Convertir body a objeto js
app.use(express.json());//Recibir datos con content-type app/json
app.use(express.urlencoded({extended: true})); //form-urlencoded

//Rutas
const rutasArticulo = require("./routes/articulo.route");

//Cargar rutas
app.use("/api", rutasArticulo);


//Rutas prueba
app.get("/prueba", (req, res) => {
    console.log("EndPoint prueba");

    return res.status(200).send({message: "Ruta de prueba"});
});

//Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor ejecutandose en el puerto " + puerto);
});



/* Arquitectura MVC
    Model para interactuar con la DB y los datos
    View la vista con la que el usuario va a interactuar (por ahora no es necesaria)
    Controller recibira las peticiones http y procesar esa informacion con acciones y rutas
*/