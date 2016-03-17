
var fileName = './README.md';
console.log('Application going to read ' + fileName);
fs.readFile(fileName, function(err, src) {
  console.log('File ' + fileName + ' size ' + src.length);
});

var dir = './';

var dirCallback = function(arr, files) {
  console.log('In dir \'' + dir + '\' ' + files.length + ' files');
};

setTimeout(function() {
  fs.readdir(dir, dirCallback);
}, 3000);
