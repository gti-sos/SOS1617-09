
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var helmet = require("helmet");


var app = express();
var port = (process.env.PORT || 16778);


app.use(bodyParser.json());
app.use(helmet());


app.use("/",express.static(path.join(__dirname,"public")));


app.listen(port, ()=> {
    console.log("Magic is happening in port"+port);
}).on("error",(e)=>{
    console.log("Server can noy be started"+e);
    process.exit(1);
});


/**************************API MANUEL*********************************/

var routeManuel = "/api/v1/hiv-stats";

var metodosManuel = require("./public/API/ApiManuel.js");

app.get(routeManuel + "/loadInitialData",metodosManuel.getCreateStats);
app.get(routeManuel,metodosManuel.getObtainStats);
app.get(routeManuel + "/:name",metodosManuel.getDataName);
app.get(routeManuel + "/:name/:year",metodosManuel.getDataNameYear);
app.use("/api/v1/test",express("./public/API/ManuelTest.html"));
app.post(routeManuel,metodosManuel.postNewData);
app.post(routeManuel + "/:name",metodosManuel.badpost);
app.post(routeManuel + "/:name/:year",metodosManuel.badpost);

app.put(routeManuel , metodosManuel.badPut);
app.put(routeManuel + "/:name", metodosManuel.putData);
app.put(routeManuel + "/:name/:year", metodosManuel.putTwoData);

app.delete(routeManuel,metodosManuel.deleteCollection);
app.delete(routeManuel + "/:country" , metodosManuel.deleteData);
app.delete(routeManuel + "/:country/:year" , metodosManuel.deleteTwoData);



/***API LUIS*****/

var bd2 = "/api/v1/ticsathome-stats";
var funciones = require("./public/API/ApiLuis.js");


app.get(bd2 + "/loadInitialData",funciones.getNewStats);
app.get(bd2,funciones.getStats);
app.get(bd2+ "/:name",funciones.getData);


app.post(path,funciones.errorInPost);
app.post(path+ "/:name",funciones.putInsertData);

app.post(path,funciones.postNewStat);
app.post(path+ "/:name",funciones.errorInPost);

app.delete(path,funciones.deleteStats);
app.delete(path+ "/:name",funciones.deleteData);






/**************************API VERO*********************************/


var mongoClient = require ('mongodb').MongoClient;
var url = 'mongodb://kkdekiki:232323@ds137360.mlab.com:37360/internetandphones-stats';

var db1;


var vero = "/api/v1/internetandphones-stats";

// Base GET
app.get(vero + "/loadInitialData" ,(request, response)=>{
    mongoClient.connect(url,{native_parser:true},(error,database)=>{
        if(error){
            console.log("can't use db");
            process.exit();
        }
         db1=database.collection("internetandphones-stats");
        db1.find({}).toArray(function(error, stats1){
      if (error) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if(stats1.length==0){
                db1.insert([{"country": "austria" , "year": "2010" , "usageinternet": "75.2", "usagephoneline": "40"},
                    {"country": "belgium" , "year": "2010" , "usageinternet": "75" , "usagephoneline": "42"},
                    {"country": "denmark" , "year": "2010" , "usageinternet": "88.7" , "usagephoneline": "47"}]);
                console.log("OK");
               response.sendStatus(201);
            }else{
                response.sendStatus(409);
            }
        }
    });
        
        
    });
});

 
//POST a un recurso
app.post(vero +"/:country",(request, response)=>{
    response.sendStatus(405);
});

   

// GET a collection
app.get(vero,(request, response)=> {
    
    console.log("INFO: New resquest to /internetandphones-stats");
    db1.find({}).toArray(function(error, stats1){
      if (error) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending stats");
            response.send(stats1);
        }
    });
});

//GET a un recurso
app.get(vero + "/:country",(request, response) =>{
    var country = request.params.country;
    if(!country){
        console.log("WARMING: There are noy any country");
        response.sendStatus(400);//bad request
    }else{
        console.log("INFO: New GET");
        db1.find({country:country}).toArray(function(error,stats1){
            if(error){
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }else{
                var filteredCountry = stats1.filter((s)=>{
                    return (s.country.localeCompare(country,"en",{"sensitiviry":"base"})===0);
                });
                if(filteredCountry.length>0){
                    var c = filteredCountry[0];
                    console.log("INFO: Sending country");
                    response.send(c);
                    
                }else{
                    console.log("WARMING: There are not any country with country" + country);
                    response.sendStatus(404);//not found
                }
            }
        });
    }
});

//POST a collection
app.post(vero,(request, response)=> {
    var country = request.params.country;
    var newInternetandphones= request.body;
    if(!newInternetandphones){
        console.log("WARMING: New POST without Internetandphones");
        response.sendStatus(400);//bad request
    }else{
        console.log("INFO: New PORT with correct body");
        if(!newInternetandphones.country || !newInternetandphones.year || !newInternetandphones.usageinternet  || !newInternetandphones.usagephoneline){
            console.log("WARMING: New POST incorrect");
            response.sendStatus(422);//incorrecto
        }else{
            db1.find({}).toArray(function(error,stats1){
                if(error){
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }else{
                     var internetandphonesBeforeInsertion=  stats1.filter((i)=>{
                        return (i.country.localeCompare(country,"en",{"sensitiviry":"base"})===0);
                     });
                    if(internetandphonesBeforeInsertion.length>0){
                        console.log("WARMING: This data already exists");
                        response.sendStatus(409);
                    }else{
                        console.log("INFO: adding Internetandphones");
                        db1.insert(newInternetandphones);
                        response.sendStatus(201);
                    }
                }
            });
        }
    }
});

//PUT a un recurso
app.put(vero +"/:country" ,(request, response) =>{ 
    var updateStat= request.body;
    if (!updateStat) {
        console.log("WARNING: New PUT");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT");
        if(!updateStat.country || !updateStat.year || !updateStat.usageinternet  || !updateStat.usagephoneline){
            console.log("WARMING: New PUT incorrect");
            response.sendStatus(422);//incorrecto
        } else {
            db1.update({country:updateStat.country},
            {
                country:updateStat.country, 
                year:updateStat.year,
                usageinternet: updateStat.usageinternet,
                usagephoneline: updateStat.usagephoneline
                
            });
        
        }
    }
});
//DELETE a un recurso
app.delete(vero+"/:country",(request, response) =>{
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New DELETE");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE");
        db1.remove({country: country}, {}, function (error, stats1) {
            if (error) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Stats remove");
                if ( stats1 === 1) {
                    console.log("INFO: The stats is removed");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no stats to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});
//DELETE a collection
app.delete(vero,(request, response)=>{
    console.log("INFO: New DELETE");
    db1.remove({}, {multi: true}, function (error, stats1) {
        if (error) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (stats1 > 0) {
                console.log("INFO: All stats are removed");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no stats to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});



//PUT a collection
app.put(vero,(request, response) =>{
    response.sendStatus(405);
    
});



