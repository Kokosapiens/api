# api

kokos.one api wrapper for node.js

`npm install --save @kokosapiens/api`

```javascript

var config = {email: "",
             token: "",
             secret: ""}
var KokosApi = require("@kokosapiens/api");

var Kokos = KokosApi(config);

function rejectIt(){
         console.log(arguments);
}
```
### Public calls
```javascript
Kokos.assets()
     .then(function(availableAssets){

     }).catch(rejectIt);

Kokos.pairs()
     .then(function(availablePairs){

     }).catch(rejectIt);

Kokos.ticker()
     .then(function(currentTickerInformation){

     }).catch(rejectIt);

Kokos.limits()
     .then(function(currentAcceptedOrderLimits){

     }).catch(rejectIt);

var orderInfo = {pair: "doge_lsk",
                 email: config.email,
                 side: "buy",
                 volume: 540};

Kokos.order.initiate(orderInfo)
     .then(function(initiatedOrder){

     
     Kokos.order.info({uuid: initiatedOrder.uuid})
     .then(function(currentOrderInformation){

                Kokos.order.cancel({uuid: initiatedOrder.uuid})
                .then(function(r){
                 if(r.error){
                 console.log("order could not be cancelled.");
                }else{
                        console.log("order has been mar cancelled");
               }
               }).catch(rejectIt);


     }).catch(rejectIt);

     }).catch(rejectIt);

```

### private calls (requires a valid token/secret , contact support@kokos.one )

```javascript
var pair = "doge_lsk";
Kokos.depth(pair)
.then(function(depth){

}).catch(rejectIt);

```
