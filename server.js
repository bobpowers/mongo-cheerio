var bodyParser = require('body-parser');
var path = require("path");
var express = require('express');
var methodOverride = require("method-override");
var exphbs = require("express-handlebars");


var app = express();
var db = require("./models");


var PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/public')));

// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require("./controllers/index.js");
app.use("/", routes)


app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
