var fs = require('fs');
var path = require('path');
var http = require('http');
var argv = require('minimist')(process.argv.slice(2));
var server;
var dirs;

function listDirs(root) {
  var files = fs.readdirSync(root);
  var dirs = [];

  for (var i = 0, l = files.length; i < l; i++) {
    var file = files[i];
    if (file[0] !== '.') {
      var stat = fs.statSync(path.join(root, file));
      if (stat.isDirectory()) {
        dirs.push(file);
      }
    }
  }

  return dirs;
}

function getIndexTemplate() {
  var links = dirs.map(function (dir) {
    var url = '/' + dir;
    return '<li onclick="document.location=\'' + url + '\'"><a href="' + url + '">' + url + '</a></li>';
  });

  return (
    '<!doctype html>' +
    '<html>' +
    '<head>' +
    '<title>axios examples</title>' +
    '<style>' +
    'body {padding:25px;}' +
    'ul {margin:0; padding:0; list-style:none;}' +
    'li {padding:5px 10px;}' +
    'li:hover {background:#eee; cursor:pointer;}' +
    'a {text-decoration:none; color:#0080ff;}' +
    '</style>' +
    '<body>' +
    '<ul>' +
    links.join('') +
    '</ul>'
  );
}

function sendResponse(res, statusCode, body) {
  res.writeHead(statusCode);
  res.write(body);
  res.end();
}

function send200(res, body) {
  sendResponse(res, 200, body || '<h1>OK</h1>');
}

function send404(res, body) {
  sendResponse(res, 404, body || '<h1>Not Found</h1>');
}

function pipeFileToResponse(res, file, type) {
  if (type) {
    res.writeHead(200, {
      'Content-Type': type
    });
  }
  fs.createReadStream(path.join(__dirname, file)).pipe(res);
}


dirs = listDirs(__dirname);

server = http.createServer(function (req, res) {
  var url = req.url;
  // 调试 examples
  console.log(url);
  // Process axios itself
  if (/axios\.min\.js$/.test(url)) {
    // 原来的代码 是 axios.min.js
    // pipeFileToResponse(res, '../dist/axios.min.js', 'text/javascript');
    pipeFileToResponse(res, '../dist/axios.js', 'text/javascript');
    return;
  }
  // 原来的代码 是 axios.min.map
  // if (/axios\.min.map$/.test(url)) {
  if (/axios\.map$/.test(url)) {
    // 原来的代码 是 axios.min.map
    // pipeFileToResponse(res, '../dist/axios.min.map', 'text/javascript');
    pipeFileToResponse(res, '../dist/axios.map', 'text/javascript');
    return;
  }
})

const PORT = argv.p || 3000;

server.listen(PORT);

console.log("Examples running on " + PORT);
