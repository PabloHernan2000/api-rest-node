const express = require("express");
const multer = require("multer");//Middleware

const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "./imagenes/articulos/")//Ruta en donde se guardaran las imagenes
    },
    filename: function (req, file, cb){
        cb(null, "articulo" + Date.now() + file.originalname);
    }
});

const subidas = multer({storage: almacenamiento});//Middleware para las imagenes

const articuloController = require("../controllers/articulo.controller");

//Rutas de prueba
router.get("/test", articuloController.test);

//Rutas utiles
router.post("/crear", articuloController.crear);
router.get("/articulos/:ultimos?", articuloController.listarArticulos); // :ultimos? es un parametro ? significa que es opcional
router.get("/articulo/:id", articuloController.uno);
router.delete("/articulo/:id", articuloController.eliminarArticulo);
router.put("/articulo/:id", articuloController.editar);
router.post("/subir-imagen/:id", [subidas.single("file0")] ,articuloController.subir); //Un middleware es un metodo que se ejecuta antes de la acción del controlador
router.get("/imagen/:fichero", articuloController.imagen);
router.get("/buscar/:busqueda", articuloController.buscador);




//Exportar rutas
module.exports = router;