const path = require("path");
const fs = require("fs");

const PUBLIC_PATH = "public";
const PATTERN = {
    INDIVIDUAL: new RegExp("^/api/menuItem/(\\d\\d\\d)$"),
    COLLECTION: new RegExp("^/api/menuItem/?$")
}

function isRouterURL(url) {
    return PATTERN.INDIVIDUAL.test(url) || PATTERN.COLLECTION.test(url);
}

function handleRequest(request, response) {
    console.log("I am the Router, and I am handling the request."); // remove

    // This isn't really what we want to do, but it's just to let the user know we're working on it.
    let thefile = path.join(
        process.cwd(),
        PUBLIC_PATH,
        "underConstruction.html"
    );
    fs.readFile(thefile, "utf8", function (err, data) {
        if (err) {
            throw err;
        }
        response.setHeader("Content-Type", "text/html");
        response.statusCode = 404;
        response.write(data);
        response.end();
    });
}

exports.isRouterURL = isRouterURL;
exports.handleRequest = handleRequest;
exports.PATTERN = PATTERN;