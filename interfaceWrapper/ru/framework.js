// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

var callbackNum = 0;

function cloneInterface(origin) {
  var clone = {};
  for (var key in origin) {
    clone[key] = wrapFunction(key, origin[key]);
  }
  return clone;
}

function wrapFunction(fnName, fn) {
  return function () {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    console.log("Call: " + fnName);
    //console.dir(args);
    if (typeof(args[args.length - 1]) == 'function') {
      var saved = args[args.length - 1];
      args[args.length - 1] = function() {
        //console.log("Callback is calling with " + Array.prototype.join.call(arguments));
        console.log("Callback is calling with " + arguments.length + " arguments");
        saved.apply(undefined , arguments);
        callbackNum++;
      }
    }
    return fn.apply(undefined, args);
  }
}

setInterval(function() {
  console.log('\tNumber of callback calls in last 2 sec: ' + callbackNum);
  callbackNum = 0;
}, 3000);

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  setTimeout: setTimeout,
  // Помещаем ссылку на fs API в песочницу
  fs: cloneInterface(fs)
};

// Преобразовываем хеш в контекст
context.global = context;
var sandbox = vm.createContext(context);
// Читаем исходный код приложения из файла
var fileName = './application.js'

fs.readFile(fileName, function(err, src) {
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});
