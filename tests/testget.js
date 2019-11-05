var meli = require('../index.js');
var sys = require("sys");
var config = require("../config.js");
var meliObject = new meli.Meli();

var express = require('express');
var app = express();


var getUser = function(){ // función que obtiene la información del usuario, en este cado, Ibushak
    meliObject.get('users/86341263', function (err, res) {
        const datos = {
            id : res.site_id, 
        }; 
    });
};

var getThousand = function(){ // funcion para obtener 1000 resultados de menor a mayor precio y con mayor relevancia
    var secondData= [];
        meliObject.get('sites/MLM/search?category=30059&sort=price_asc&available_sorts=relevance&offset=1000', function(err,res) {
            var allData = res.results; // INgresa al json de results
            // console.log(allData);
            
            for(var a in allData){ // primer ciclo para ingresar a res.results
                // console.log();
                var attr = allData[a].attributes[1];  //atributos en la prosición 1 donde se obtiene el marca
                var attr1 = allData[a].attributes[2]; //atributos en la prosición 2 donde se obtiene localidad
                  
                for(var c  in attr1){ // segundo for para obtyener la localidad
                }
                 for(var b in attr){ // tercer for para obtener las marcas
                    const data = { // construcción del json con todos los atributos requeridos
                        ID: allData[a].seller.id,
                        envio: allData[a].shipping.free_shipping,
                        logistica:allData[a].shipping.logistic_type,
                        Estado: allData[a].address.city_name,
                        Condiciones : attr.value_name,
                        Marca: attr1.value_name,
                        Rango : allData[a].price
                    }
                     console.log(data); 
                 }
            }
        console.log(err);
    });
};


var item = function(){ // función que consulta los celulares de gama alta 
    var title = "celulares%20gama%20alta"; //titulo a busar
    meliObject.get('/sites/'+ config.config.site_id +'/search?q=' + title, function(err,res){
        var allData = res.results; // se ingresa al json results
        for(var a in allData){
           
         }  
        
         var atributos = allData[a].attributes; //se obtienen los atributos para ingresar al arreglo de valores
         for(var b in atributos){ // ciclo para ingresar a los valores de los atributos
            
                var valores = atributos[b].values;
                
                for(var c in valores){ //ciclo para ingresar al nombre de los valores
                    const simpleData = { // construcción del json con todos los atributos requeridos
                        site : allData[a].site_id,
                        titulo: allData[a].title,
                        seller: allData[a].seller.id,
                        sellerName : allData[a].seller.name,
                        precio : allData[a].price,
                        cantidad : allData[a].available_quantity,
                        link : allData[a].permalink,
                        direccion: allData[a].seller_address.country.name +"-"+ allData[a].seller_address.state.name+"-"+ allData[a].seller_address.city.name,
                        envio: allData[a].shipping.free_shipping,
                        logistica: allData[a].shipping.logistic_type,
                        atributo : atributos[b].name,
                        valor :valores[c].name
                }
                console.log(simpleData);
         }
         
        }
        console.log(err);
    });
};


var examples = { // opciones a seleccionar
    1: "Ejercicio 1",
    2: "Ejercicio 2 ",
    3: "Get user data",
};
function printOptions() {
    console.log("Ingrese un numero:");
    for (var i in examples) {
        console.log(i + ": " + examples[i]);

    }
}

printOptions();
var stdin = process.openStdin();
stdin.addListener("data", function (d) { // declaración de las funciones que se ejecutarán 
                                         // dependiendo de la opción seleccionada
    var end = Number(d);
    switch(end){
        case 1: item();
        break;
        case 2: getThousand();
        break;
        case 3: getUser();;
        break;
       
    }
});
