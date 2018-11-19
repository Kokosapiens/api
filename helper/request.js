const request = require( "request" );

module.exports = function(type, url, data, signature, dataJson, dataRequestJson){

    return new Promise(function(resolve, reject){
        var headers = {};
        if(typeof(signature) !== "undefined" && signature != null){
            headers["x-signature"] = signature;
        }
    
        if(!dataJson){
            request({url: url,
                     method: type,
                     timeout: 60*1000,
                     form: data,
                     headers: headers},
                    function(error, response, body){
    
    

                        if(error){
                            console.log(error);
                            return reject(error);
                        }
                        var info = null;
                        var isJson = true;
                        try{
                            info = JSON.parse(body);
                        }catch(e){ info = body;
                                   isJson = false; }
                        //console.log(url);
                        //console.log(info);
                        
                       // console.log(info);
                        resolve(info, isJson);
                    });
        }else{
            headers["Content-Type"] = "application/json";
            var dataX = data;
            var toJson = true;
            if(dataRequestJson){
                toJson = false;
            }else{
                if(typeof(data) == "string"){
                    dataX = JSON.parse(data);
                }
            }
            
            
            request({url: url,
                     method: type,
                     timeout: 60*1000,
                     body: dataX,
                     json: toJson,
                     headers: headers},
                    function(error, response, body){
                        
                        if(error){
                        //    console.log(error);
                            return reject(error);
                        }
                        var info = null;
                        var isJson = true;
                        try{
                            info = JSON.parse(body);
                        }catch(e){
                            info = body;
                            isJson = false;
                        }
                        resolve(info, isJson);
                    });
            
        }
    });
}

