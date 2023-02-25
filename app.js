const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/schedule", {useNewUrlParser: true});
const apiSchema = new mongoose.Schema({
    schedule_time : String,
    slot: String,
    item_date: String

  });
  
const api = mongoose.model("api",apiSchema);

app.get("/" , function (req,res) {

      res.render("home", {holder: {}, keys: [], counter: []})
})

app.post("/", function (req,res) {
    var input = req.body.date;
    var counter = [];
    var delivery_date = input.split(" ")[0];
    console.log(delivery_date);
    api.aggregate(
        [
          {
            $match: {
                item_date: delivery_date
            }
          },

          {
            $group: {
              _id: { 
                $dateToString : {
                    
                       format: "%Y-%m-%d", date: { $dateFromString: { format: "%Y-%m-%d %H:%M:%S", dateString: "$schedule_time"}}
                    
                }
            },
              count:{ $sum: 1},
            }
          }
        ],
    
        function(err, result) {
        
          if (err) {
            console.log("Idher error");
          } else {
            
            result.forEach(function (item) {
                //console.log(item);
                if(item._id <= input.split(" ")[0]){
                    counter.push(item);
                }
            })
            counter.sort((a,b) => (a._id > b._id) ? 1:-1);
            console.log("counter = ",counter);
          }
        }
      );

      api.aggregate(
        [
            {
                $match: {
                    item_date: delivery_date
                }
              },
          
          {
            $group: {
                _id: { 
                    $dateToString : {
                        
                           format: "%Y-%m-%d %H", date: { $dateFromString: { format: "%Y-%m-%d %H:%M:%S", dateString: "$schedule_time"}}
                        
                    }
                },
              count:{ $sum: 1}
            }
          }
        ],
        function(err, result) {
            var storage = [];
          if (err) {
            console.log("nahi idher");
            //res.send(err);
          } else {

            
            result.forEach(function (item) {
                var date = (item._id).split(" ");
                if(date[0] <= input.split(" ")[0]){
                    storage.push(item)
                }
            });
            storage.sort((a,b) => (a._id > b._id) ? 1:-1);
            //console.log(storage);
            var holder = {};
            storage.forEach(function (item) {
                var date_of = item._id.split(" ")[0];
                var hour = item._id.split(" ")[1];
                if(holder[date_of] != undefined){
                    if(hour<3 && hour>=0){
                        if(holder[date_of]["0-3"] != undefined){
                            holder[date_of]["0-3"] += item.count;
                        }
                        else{
                            holder[date_of]["0-3"] = item.count;
                        }
                    }

                    else if(hour<6 && hour>=3){
                        if(holder[date_of]["3-6"] != undefined){
                            holder[date_of]["3-6"] += item.count;
                        }
                        else{
                            holder[date_of]["3-6"] = item.count;
                        }
                    }

                    else if(hour<9 && hour>=6){
                        if(holder[date_of]["6-9"] != undefined){
                            holder[date_of]["6-9"] += item.count;
                        }
                        else{
                            holder[date_of]["6-9"] = item.count;
                        }
                    }

                    else if(hour<12 && hour>=9){
                        if(holder[date_of]["9-12"] != undefined){
                            holder[date_of]["9-12"] += item.count;
                        }
                        else{
                            holder[date_of]["9-12"] = item.count;
                        }
                    }

                    else if(hour<15 && hour>=12){
                        if(holder[date_of]["12-15"] != undefined){
                            holder[date_of]["12-15"] += item.count;
                        }
                        else{
                            holder[date_of]["12-15"] = item.count;
                        }
                    }

                    else if(hour<18 && hour>=15){
                        if(holder[date_of]["15-18"] != undefined){
                            holder[date_of]["15-18"] += item.count;
                        }
                        else{
                            holder[date_of]["15-18"] = item.count;
                        }
                    }

                    else if(hour<21 && hour>=18){
                        if(holder[date_of]["18-21"] != undefined){
                            holder[date_of]["18-21"] += item.count;
                        }
                        else{
                            holder[date_of]["18-21"] = item.count;
                        }
                    }

                    else if(hour<24 && hour>=21){
                        if(holder[date_of]["21-24"] != undefined){
                            holder[date_of]["21-24"] += item.count;
                        }
                        else{
                            holder[date_of]["21-24"] = item.count;
                        }
                    }

                }


                else{
                    holder[date_of] = {};
                    if(hour<3 && hour>=0){
                        holder[date_of]["0-3"] = item.count;
                    }
                    else if(hour<6 && hour>=3){
                        holder[date_of]["3-6"] = item.count;
                    }
                    else if(hour<9 && hour>=6){
                        holder[date_of]["6-9"] = item.count;
                    }

                    else if(hour<12 && hour>=9){
                        holder[date_of]["9-12"] = item.count;
                    }

                    else if(hour<15 && hour>=12){
                        holder[date_of]["12-15"] = item.count;
                    }

                    else if(hour<18 && hour>=15){
                        holder[date_of]["15-18"] = item.count;
                    }

                    else if(hour<21 && hour>=18){
                        holder[date_of]["18-21"] = item.count;
                    }

                    else if(hour<24 && hour>=21){
                        holder[date_of]["21-24"] = item.count;
                    }
                }

            });
            console.log(holder);
            var keys = Object.keys(holder);
            console.log("key length = ",keys.length);
            setTimeout(function() {
                res.render("home", {holder: holder, keys: keys, counter: counter});}, 2000);
                }
            });
        });


app.listen(port, function() {
  console.log("Server started on port ",port);
});

