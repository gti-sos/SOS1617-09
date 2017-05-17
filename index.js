
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var request= require("request");
var cors= require("cors");
var app = express();
var port = (process.env.PORT || 16778);

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());


app.use("/",express.static(path.join(__dirname,"public")));


app.listen(port, ()=> {
    console.log("Magic is happening in port"+port);
}).on("error",(e)=>{
    console.log("Server can noy be started"+e);
    process.exit(1);
});



/***HTML PARA EL BOTÓN DEL TEST DE POSTMAN **/

app.use("/api/v1/tests",express.static(path.join(__dirname,"./public/API/Test.html")));

  app.get("/api/v2/internetandphones-stats/proxy", (req, res) => {
        var url = 'https://sos1617-01.herokuapp.com/api/v2/youthunemploymentstats?apikey=sos161701';
        req.pipe(request(url)).pipe(res);
    });


/**************************API MANUEL*********************************/


var routeManuel = "/api/v1/hiv-stats";

var metodosManuel = require("./public/API/ApiManuel/v1/ApiManuel.js");

app.get(routeManuel + "/loadInitialData",metodosManuel.getCreateStats);
app.get(routeManuel,metodosManuel.getObtainStats);
app.get(routeManuel + "/:name",metodosManuel.getDataName);
app.get(routeManuel + "/:name/:year",metodosManuel.getDataNameYear);

app.post(routeManuel,metodosManuel.postNewData);
app.post(routeManuel + "/:name",metodosManuel.badpost);
app.post(routeManuel + "/:name/:year",metodosManuel.badpost);

app.put(routeManuel , metodosManuel.badPut);
app.put(routeManuel + "/:name", metodosManuel.badPut);
app.put(routeManuel + "/:name/:year", metodosManuel.putTwoData);

app.delete(routeManuel,metodosManuel.deleteCollection);
app.delete(routeManuel + "/:country" , metodosManuel.deleteData);
app.delete(routeManuel + "/:country/:year" , metodosManuel.deleteTwoData);

var routeManuel2 = "/api/v2/hiv-stats";

var metodosManuel2 = require("./public/API/ApiManuel/v2/ApiManu.js");

app.get(routeManuel2 + "/loadInitialData",metodosManuel2.getCreateStats);
app.get(routeManuel2,metodosManuel2.getObtainStats);
app.get(routeManuel2 + "/:name",metodosManuel2.getDataName);
app.get(routeManuel2 + "/:name/:year",metodosManuel2.getDataNameYear);

app.post(routeManuel2,metodosManuel2.postNewData);
app.post(routeManuel2 + "/:name",metodosManuel2.badpost);
app.post(routeManuel2 + "/:name/:year",metodosManuel2.badpost);

app.put(routeManuel2 , metodosManuel2.badPut);
app.put(routeManuel2 + "/:name", metodosManuel2.badPut);
app.put(routeManuel2 + "/:name/:year", metodosManuel2.putTwoData);

app.delete(routeManuel2,metodosManuel2.deleteCollection);
app.delete(routeManuel2 + "/:country" , metodosManuel2.deleteData);
app.delete(routeManuel2 + "/:country/:year" , metodosManuel2.deleteTwoData);





/***API LUIS*****/

var urlDir = "/api/v1/ticsathome-stats";
var funciones = require("./public/ticsathome-manager/v1/ApiLuis.js");

var urlDirv2 = "/api/v2/ticsathome-stats";
var funcionesv2 = require("./public/ticsathome-manager/v2/ApiLuis.js");


app.get(urlDir + "/loadInitialData",funciones.getNewStats);
app.get(urlDir,funciones.getGeneral);
app.get(urlDir+ "/:country",funciones.getOneParam);
app.get(urlDir+ "/:country/:year",funciones.getTwoSpecific);

app.get("/proxy/ticsathome",(req,res)=>{
 var http = require('http');
 
 var options = {
     host:'sos1617-10.herokuapp.com',
     path: "/api/v2/beers-stats/?apikey=jesusguerre"
 };
 
 callback = function(response){
   var str ="";
   response.on('data',function(chunk){
       str+=chunk;
   });
   
   response.on('end',function(){
       res.send(str);
   });
     
 }
 http.request(options,callback).end();
});

app.put(urlDir,funciones.errorInPut);
app.put(urlDir+ "/:country",funciones.putSpecific);
app.put(urlDir+ "/:country/:year",funciones.putTwoSpecific);

app.post(urlDir,funciones.postGeneral);
app.post(urlDir+ "/:country",funciones.errorInPost);
app.post(urlDir+ "/:country/:year",funciones.errorInPost);

app.delete(urlDir,funciones.deleteStats);
app.delete(urlDir+ "/:country",funciones.deleteOne);
app.delete(urlDir+ "/:country/:year",funciones.deleteTwo);


/********V2***********/


app.get(urlDirv2 + "/loadInitialData",funcionesv2.getNewStats);
app.get(urlDirv2,funcionesv2.getGeneral);
app.get(urlDirv2+ "/:country",funcionesv2.getOneParam);
app.get(urlDirv2+ "/:country/:year",funcionesv2.getTwoSpecific);

app.put(urlDirv2,funcionesv2.errorInPut);
app.put(urlDirv2+ "/:country",funcionesv2.putSpecific);
app.put(urlDirv2+ "/:country/:year",funcionesv2.putTwoSpecific);

app.post(urlDirv2,funcionesv2.postGeneral);
app.post(urlDirv2+ "/:country",funcionesv2.errorInPost);
app.post(urlDirv2+ "/:country/:year",funcionesv2.errorInPost);

app.delete(urlDirv2,funcionesv2.deleteStats);
app.delete(urlDirv2+ "/:country",funcionesv2.deleteOne);
app.delete(urlDirv2+ "/:country/:year",funcionesv2.deleteTwo);




/*****************************API VERO*********************************/

var vero = "/api/v1/internetandphones-stats";
var metodosVero = require("./public/internetstats-manager/v1/ApiVero.js");

var vero2 = "/api/v2/internetandphones-stats";
var metodosVero2 = require("./public/internetstats-manager/v2/ApiVero.js");

app.get(vero + "/loadInitialData",metodosVero.getLoadInitial);
app.get(vero,metodosVero.getCollection);
app.get(vero + "/:country",metodosVero.getRecurso);
app.get(vero + "/:country/:year",metodosVero.getRecursoDosParametros);

app.post(vero,metodosVero.postCollection);
app.post(vero +"/:country",metodosVero.postRecurso);

app.put(vero,metodosVero.putCollection);
app.put(vero +"/:country" ,metodosVero.putRecurso);
app.put(vero +"/:country/:year" ,metodosVero.putRecursoDosParametros);

app.delete(vero,metodosVero.deleteCollection);
app.delete(vero+"/:country",metodosVero.deleteRecurso);
app.delete(vero+"/:country/:year",metodosVero.deleteRecursoDosParametros);
      /********************v2****************/
      
app.get(vero2 + "/loadInitialData",metodosVero2.getLoadInitial);
app.get(vero2,metodosVero2.getCollection);
app.get(vero2 + "/:country",metodosVero2.getRecurso);
app.get(vero2 + "/:country/:year",metodosVero2.getRecursoDosParametros);

app.post(vero2,metodosVero2.postCollection);
app.post(vero2 +"/:country",metodosVero2.postRecurso);

app.put(vero2,metodosVero2.putCollection);
app.put(vero2 +"/:country" ,metodosVero2.putRecurso);
app.put(vero2 +"/:country/:year" ,metodosVero2.putRecursoDosParametros);

app.delete(vero2,metodosVero2.deleteCollection);
app.delete(vero2+"/:country",metodosVero2.deleteRecurso);
app.delete(vero2+"/:country/:year",metodosVero2.deleteRecursoDosParametros);










