var axios = require("axios").default;
var express = require("express");
var app = express();
var path = require('path');
const request = require("request");
const port = process.env.PORT || 4000;
app.set('view engine', 'jade');

app.listen(port,()=>{
    console.log("App started successfully!!");
});

const http = require("http");
url = "http://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&redirects=1&format=json&titles=";

app.get("/",(req,res)=>{
    res.render("home")
});
app.get("/distance",(req,res)=>{
    var start = req.query.start;
    var end = req.query.end;
    console.log(start,end)
    var fcid = "";
    var ecid = "";
    request(url+start, (err, res1, body) => {
        if (err) { return console.log("error royyyy"); }
        const obj = JSON.parse(body)
        const str = JSON.stringify(obj.query.pages)
        const arr = str.split("{")
        const fin = JSON.parse("{"+arr[3].split("}")[0]+"}")
        fcid = fin.wikibase_item;
        //console.log(fcid)
        request(url+end, (err, res2, body) => {
            if (err) { return console.log(err); }
            const obj = JSON.parse(body)
            const str = JSON.stringify(obj.query.pages)
            const arr = str.split("{")
            const fin = JSON.parse("{"+arr[3].split("}")[0]+"}")
            ecid = fin.wikibase_item;
            //console.log(ecid)

            var options = {
                method: 'GET',
                url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities/'+fcid+'/distance',
                params: {fromCityId: ecid, distanceUnit: 'KM'},
                headers: {
                    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
                    'x-rapidapi-key': 'd2b7bb04d0msh3ac44eac3517612p143f74jsn7e1fbafd6c07'
                }
                };
            
                axios.request(options).then(function (response) {
                    console.log(response.data.data);
                    res.render("home",{"distance":response.data.data})
                }).catch(function (error) {
                    console.log("errror hereee")
                }); 
        });
    });
    
  
    
   
    
})


