const validator = require("validator");//Libreria para validar
const Articulo = require("../models/Articulo.model");//Importar modelo
const helper = require("../helpers/validar");//Importamos el helper que contiene funciones
const fs = require("fs");
const path = require("path");


//Metodo prueba
const test = (req, res) => {
    return res.status(200).send({
        message: "Ruta de prueba"
    });
}

//Metodo crear
const crear = (req, res) => {

    //Obtener los parametros por POST a guardar
    let parametros = req.body;

    //Validar los datos
    try {
        helper.validarArticulo(parametros);
    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos"
        })
    }

    //Crear objeto a guardar
    const articulo = new Articulo(parametros);

    //Asignar valores a objeto (manual o automatico)
    //articulo.titulo = parametros.titulo;

    //Guardar el articulo en la base de datos
    articulo.save((error, articuloGuardado) => { //Se hace un  callback (error, articuloGuardado) para ejecutar la operación 
        if (error || !articuloGuardado) {
            return res.status(400).send({
                status: "error",
                message: "No se ha guardado el articulo"
            });
        }

        //Devolver resultado
        return res.status(200).send({
            status: "success",
            message: "Articulo creado con exito",
            articulo: articuloGuardado
        });
    });
}

//Metodo obtener articulos
const listarArticulos = (req, res) => {
    let consulta = Articulo.find({}) //Buscar articulos

    if (req.params.ultimos) { //Si llega el parametro por url (opcional)
        consulta.limit(3); //Mostrar una cantidad de articulos
    }

    consulta.sort({ fecha: -1 })//Ordenar 1 orden ascendente y -1 para orden descendente
        .exec((error, articulos) => {
            if (error || !articulos) {
                return res.status(404).send({
                    status: "error",
                    message: "No se han encontrado articulos"
                });
            }

            return res.status(200).send({
                status: "success",
                articulos
            });
        }); //Metodo exec es para ejecutar la consulta
}

const uno = (req, res) => {
    //Obtener id por url
    let articulo_id = req.params.id;

    //Buscar articulo
    Articulo.findById(articulo_id, (error, articulo) => {
        //Si no existe devolver error
        if (error || !articulo) {
            return res.status(404).send({
                status: "error",
                message: "No se han encontrado el articulo"
            });
        }

        //Devolver resultado
        return res.status(200).send({
            status: "success",
            message: "Articulo encontrado",
            articulo
        });

    });
}

const eliminarArticulo = (req, res) => {
    let articulo_id = req.params.id;

    //Eliminar articulo
    Articulo.findOneAndDelete({ _id: articulo_id }, (error, articuloEliminado) => {

        if (error || !articuloEliminado) {
            return res.status(404).send({
                status: "error",
                message: "No se ha podido eliminar el articulo"
            });
        }

        //Devolver resultado
        return res.status(200).send({
            status: "success",
            message: "Articulo eliminado correctamente",
            articuloEliminado
        });
    });
}



const editar = (req, res) => {
    //Obtener id articulo a editar
    let articulo_id = req.params.id;

    //Recoger datos del body
    let parametros = req.body;

    //Validar datos
    try {
        helper.validarArticulo(parametros);
    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos"
        })
    }

    //Buscar y actualizar
    Articulo.findOneAndUpdate({ _id: articulo_id }, req.body, { new: true }, (error, articuloActualizado) => { //{new: true} para obtener el onjeto actualizado
        if (error || !articuloActualizado) {
            return res.status(404).send({
                status: "error",
                message: "No se ha podido actualizar el articulo"
            });
        }
        //Devolver resultado
        return res.status(200).send({
            status: "success",
            message: "Articulo actualizado correctamente",
            articuloActualizado
        });
    });
}

const subir = (req, res) => {

    //Recoger fichero de imagen
    let imagen = req.file;
    if (!imagen && !req.files) {
        return res.status(404).send({
            status: "error",
            message: "Petición invalida"
        });
    }

    //Nombre del archivo
    let nombreArchivo = imagen.originalname;

    //Conseguir la extensión
    let archivo_split = nombreArchivo.split("\.");
    let archivo_extension = archivo_split[1];

    //Comprobar extensión correcta
    if (archivo_extension != "png" && archivo_extension != "jpg" && archivo_extension != "jpeg" && archivo_extension != "gif") {
        //Borrar archivo y dar respuesta
        fs.unlink(imagen.path, (error) => {
            return res.status(400).send({
                status: "error",
                message: "Imagen invalida"
            });
        });
    } else {
        //Actualizar el articulo

        //Obtener id articulo a editar
        let articulo_id = req.params.id;

        //Buscar y actualizar
        Articulo.findOneAndUpdate({ _id: articulo_id }, { imagen: imagen.filename }, { new: true }, (error, articuloActualizado) => { //{new: true} para obtener el onjeto actualizado
            if (error || !articuloActualizado) {
                return res.status(404).send({
                    status: "error",
                    message: "No se ha podido actualizar el articulo"
                });
            }
            //Devolver resultado
            return res.status(200).send({
                status: "success",
                message: "Articulo actualizado correctamente",
                articuloActualizado,
                fichero: req.file
            });
        });
    }
}

const imagen = (req, res) => {
    let fichero = req.params.fichero; //Parametro por url
    let ruta_fisica = "./imagenes/articulos/" + fichero;

    fs.stat(ruta_fisica, (error, existe) => { //stat es para comprobar si un fichero existe
        if (existe) {
            return res.sendFile(path.resolve(ruta_fisica));//Devolver el archivo
        } else {
            return res.status(404).send({
                status: "error",
                message: "La imagen no existe"
            });
        }
    })
}

const buscador = (req, res) => {
    //Obtener string de busqueda (url parametro)
    let busqueda = req.params.busqueda;

    //Find OR
    Articulo.find({
        "$or": [
            { "titulo": { "$regex": busqueda, "$options": "i" } },
            { "contenido": { "$regex": busqueda, "$options": "i" } }
        ]
    })
        //Orden
        .sort({ fecha: -1 })
        //Ejecutar consulta
        .exec((error, articulosEncontrados) => {
            if (error || !articulosEncontrados || articulosEncontrados.length <=0) {
                return res.status(404).send({
                    status: "error"
                });
            }



            //Devolver resultado
            return res.status(200).send({
                status: "success",
                articulosEncontrados
            });
        });
}

module.exports = {
    test,
    crear,
    listarArticulos,
    uno,
    eliminarArticulo,
    editar,
    subir,
    imagen,
    buscador
}