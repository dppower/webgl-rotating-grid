var express = require("express");
var http = require("http");
var path = require("path");
var morgan = require("morgan");
var fs = require("fs");

var app = express();

//app.use(morgan("dev"));

app.use("/scripts", express.static(path.join(__dirname, "node_modules")));
app.use("/app", express.static(path.join(__dirname, "build", "app")));
app.use("/css", express.static(path.join(__dirname, "docs", "css")));
app.use("/js", express.static(path.join(__dirname, "docs", "js")));
app.use("/mesh", express.static(path.join(__dirname, "docs", "mesh")));

app.set("port", process.env.PORT || 3000);

app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "docs", "./html/index.html"));
});

var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Example app is listening on port ' + app.get('port'));
});