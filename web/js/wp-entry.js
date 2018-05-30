//const mymodule1 = require("mymodule1");
//
//import mymodule1 from "./mymodule1"
//
// mymodule1.myFunction();

import { square, diag } from '../lib';

console.log(square(11)); // 121
console.log(diag(4, 3)); // 5

window['require'] = function(modules, callback) {
    var modulesToRequire = modules.forEach(function(module) {
        return require(str(module));
    })
    callback.apply(this, modulesToRequire);
}
