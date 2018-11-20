var request = require("./helper/request.js");

var crypto = require("crypto");
var forge = require('node-forge');
var _ = require("lodash");
function buildUrl(){
    return arguments.join("/");
}
function buildPublicUrl(args){
    
    var p = _.clone(args);
    p.splice(1, 0, "0");
    return p.join("/");
}
function buildPrivateUrl(args){
    var p = _.clone(args);
    return p.join("/");
}
function buildUri(args){
    
    var p = _.clone(args);
    return p.join("/");
}

function createNoncer(){
    var nonce = (new Date()).getTime();
    return function(){
        nonce = nonce + 1;
        return nonce;
    }
}
function define(config){
    /*
      config (used for user identification)
      {token: "string",
      secret: "string",
      email: "string"}
    */

    var baseUrl = "https://api.kokos.one/v1";
    var requiredFields = ["pair", "side", "volume", "refund_address", "receive_address", "email"];
    function sign(uri, message, nonce, secret){      
        var md1 = forge.md.sha256.create();
        md1.update(secret);
        var secret256 = md1.digest().toHex();
        var md2 = forge.md.sha256.create();
        md2.update(message+nonce+secret256);
        var hashMessage = md2.digest().toHex();
        var md3 = forge.md.sha512.create();
        md3.update(uri+hashMessage);
        var signature = md3.digest().toHex();
        return signature;
    }
    function getAssets(){
        return new Promise(function(resolve, reject){
            var url = buildPublicUrl([baseUrl, "public", "assets"]);
            request("GET", url, {}, null, true)
                .then(function(r){
                    resolve(r);
                })
                .catch(function(e){
                    console.log(e);
                    reject({error: arguments});
                });
        });
    }
    function getPairs(){
        return new Promise(function(resolve, reject){
            var url = buildPublicUrl([baseUrl, "public", "pairs"]);
            request("GET", url, {}, null, true)
                .then(function(r){
                    resolve(r);
                })
                .catch(function(){
                    console.log(e);
                    reject({error: arguments});
                });
        });
    }
    function getTicker(pair){
        return new Promise(function(resolve, reject){
            var url = buildPublicUrl([baseUrl, "public", "ticker"]);
            var data = {};
            if(typeof(pair) != "undefined"){
                data.pairs = pair;
            }
            request("GET", url, data, null, true)
                .then(function(r){
                    resolve(r);
                })
                .catch(function(){
                    reject({error: arguments});
                });
        });
    }
    function containsAll(info, keys){
        return keys.reduce(function(r, key){
            return r && typeof(info[key]) != "undefined" && info[key] != "";
        }, true);
    }
    function getLimits(){
        return new Promise(function(resolve, reject){
            var url = buildPublicUrl([baseUrl, "public", "limits"]);
            var data = {};
            request("GET", url, data, null, true)
                .then(function(r){
                    resolve(r);
                })
                .catch(function(){
                    reject({error: arguments});
                });
        });
    }

    function initiateOrder(info){

        if(typeof(info.email) == "undefined"){
            info.email = config.email;
        }
        
        if(!containsAll(info, requiredFields)){
            return reject({error: "missing required field",
                           requiredFields: requiredFields});
        }
        
        var url = buildPrivateUrl([baseUrl,config.token ,"order", "initiate"]);
        var uri = buildUri(["/v1", config.token, "order", "initiate"]);
        var theNonce = nonce();
        var data = info;
        data.nonce = theNonce;
        var dataMessage = JSON.stringify(data);
        var signature = sign(uri, dataMessage,
                             theNonce,
                             config.secret);
        return request("POST", url, dataMessage,
                       signature, true, true);
    }
    function cancelOrder(info){
   
        return new Promise(function(resolve, reject){
            if(typeof(info.email) == "undefined"){
                info.email = config.email;
            }
            
            if(!containsAll(info, ["uuid", "email"])){
                return reject({error: "missing required field",
                               requiredFields: ["uuid", "email"]});
            }
            var url = buildPublicUrl([baseUrl, "order", "cancel"]);
            var data = info;
            request("POST", url, data, null, true)
                .then(function(response){
                    resolve(response);
                })
                .catch(function(){
                    reject({error: arguments});
                })

        });
    }
    function getOrderInfo(info){
   
        return new Promise(function(resolve, reject){
            if(!containsAll(info, ["uuid"])){
                return reject({error: "missing required field",
                               requiredFields: ["uuid"]});
            }
            var url = buildPublicUrl([baseUrl, "order", "info"]);
            var data = info;
            request("POST", url, data, null, true)
                .then(function(response){
                    resolve(response);
                })
                .catch(function(){
                    reject({error: arguments});
                })

        });
    }
    var nonce = createNoncer();
    function depth(pair){
        var url = buildPrivateUrl([baseUrl,config.token ,"book", "depth"]);
        var uri = buildUri(["/v1", config.token, "book", "depth"]);
        var theNonce = nonce();
        var data = {pair: pair, nonce: theNonce};
        var dataMessage = JSON.stringify(data);
        var signature = sign(uri, dataMessage,
                            theNonce,
                             config.secret);
        
        return request("POST", url, dataMessage,
                       signature, true, true);
    }    
    return {assets: getAssets,
            pairs: getPairs,
            ticker: getTicker,
            limits: getLimits,
            depth: depth,
            order: {initiate: initiateOrder,
                    info: getOrderInfo,
                    cancel: cancelOrder}};
}

module.exports = define;
