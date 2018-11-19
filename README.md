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

## LICENSE
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
