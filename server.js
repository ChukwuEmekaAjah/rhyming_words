const http = require("http");
const port = process.env.PORT || 80;
const qs = require("querystring");
const fs = require("fs");
const parser = require("./utilities/parser.js");

function responder(method, path, handler) {}

let routes_handlers = {};

function add_route_handler(method, path, handler) {
	routes_handlers[`${method}_${path}`] = handler;
}

function index_get_request_handler(req, res) {
	res.setHeader("content-type", "text/html");
	fs.createReadStream(__dirname + "/views/index.html").pipe(res);
}

function index_post_request_handler(req, res) {
	var request_body = "";
	req.on("data", function(chunk) {
		request_body += chunk.toString();
	});
	req.on("end", function() {
		res.writeHead(200, { "Content-Type": "text/plain" });
		let form_data = qs.parse(request_body);
		let matching_words = parser.get_words(
			form_data.characters_position,
			form_data.characters
		);
		console.log(form_data);
		res.write(
			JSON.stringify(parser.arrange_words_by_alphabet(matching_words))
		);
		res.end();
	});
}

add_route_handler("get", "/", index_get_request_handler);
add_route_handler("post", "/", index_post_request_handler);

const server = http.createServer((req, res) => {
	let request_method = req.method.toLowerCase();
	let request_path = req.url;
	if (routes_handlers.hasOwnProperty(`${request_method}_${request_path}`)) {
		routes_handlers[`${request_method}_${request_path}`](req, res);
	} else {
		routes_handlers["get_/"](req, res);
	}
});

server.listen(port);
console.log("Our server has started.");
