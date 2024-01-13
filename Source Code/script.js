let rowConverter = function (d) {
   return {
   OrderID : parseInt(d["Order ID"]),
   Date : new Date(d["Order Date"]).getMonth()+1,
   Aging : parseInt(d["Aging"]),
   Product_Category : d["Product Category"],
   Product : d["Product"],
   Revenue : parseFloat(d["Revenue"]),
   Segment: d["Segment"],
   Country: d["Country"],
   Region: d["Region_country"],
   Profit: parseFloat(d["Profit"]),
   lat: parseFloat(d["latitude"]),
   long: parseFloat(d["longitude"]),
  geo: d["geo"]
}
}; 


function task(){

var groupname = "marker-select";
var Areachart1  = dc.lineChart(".area1", groupname);
var Areachart2  = dc.lineChart(".area2", groupname);
//var rowChart = dc.rowChart(".row",groupname); // , 'myChartGroup');
var rowChart2 = dc.rowChart(".row2",groupname); // , 'myChartGroup');
var pieChart = dc.pieChart("#pie", groupname); //, 'myChartGroup');
var marker = dc_leaflet.markerChart(".map",groupname)
var numberDisplay1 = dc.numberDisplay("#salenum", groupname);
var numberDisplay2 = dc.numberDisplay("#profitnum", groupname);
var numberDisplay3 = dc.numberDisplay("#ordervalue", groupname);
var numberDisplay4 = dc.numberDisplay("#marginvalue", groupname);
var numberDisplay5 = dc.numberDisplay("#Avgday", groupname);
var bubbleChart = dc.bubbleChart(".row", groupname);
var Areachart1copy  = dc.lineChart(".coppyarea1", groupname);
var Areachart2copy  = dc.lineChart(".coppyarea2", groupname);
// var rowChartcoppy = dc.rowChart(".coppyrow",groupname);
var rowChart2coppy = dc.rowChart(".coppyrow2",groupname);
var pieChartcoppy = dc.pieChart("#coppypie", groupname);
var markercoppy = dc_leaflet.markerChart(".mmap",groupname)

var clusterMap = L.map('cluster-map', {
  center: [42.69,25.42],
  zoom: 18
}); 
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(clusterMap);


      var clusterMapcoppy = L.map('clluster-map', {
        center: [42.69,25.42],
        zoom: 3
      }); 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(clusterMapcoppy);

d3.csv("https://raw.githubusercontent.com/daibacgantay/consumption-in-business/main/Data/data_use_for_webcode.csv", rowConverter)
 .then(function(Data) {
   var mycrossfilter = crossfilter(Data);
   const numberFormat = d3.format('.1f');
   // marker map chart 

        var facilities = mycrossfilter.dimension(function(d) { return d["geo"]; });
        var facilitiesGroup = facilities.group().reduceSum(function(d) {
            return d.Revenue;
          })
          var pos = {};
          Data.forEach(function(d) {
            pos[d.geo] = d.Country;
                                        
        });
        console.log(pos);
        marker
        .dimension(facilities)
        .group(facilitiesGroup)
        .map(clusterMap)
        .showMarkerTitle(false)
        .fitOnRender(true)
        .fitOnRedraw(true)
        .popup(d => pos[d.key] + ": "+ changenum(d.value))
        .cluster(true)


        markercoppy
        .dimension(facilities)
  .group(facilitiesGroup)
  .map(clusterMapcoppy)
  .showMarkerTitle(false)
  .fitOnRender(true)
  .fitOnRedraw(true)
  .popup(d => pos[d.key] + ": "+ changenum(d.value))
  .cluster(true)
        

   //Area chart
   // Area chart1
   var MonthDimension= mycrossfilter.dimension(function(d) {return d.Date;});
   var Electronic_Revenue=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Electronic") {return d.Revenue;}else{return 0;}});
   var Fashion_Revenue=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Fashion") {return d.Revenue;}else{return 0;}});
   var Auto_Revenue=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Auto & Accessories") {return d.Revenue;}else{return 0;}});
   var Home_Revenue=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Home & Furniture") {return d.Revenue;}else{return 0;}});
   
   Areachart1.width(700)
   .height(280)
   .x(d3.scaleLinear().domain([1,12]))
    .dimension(MonthDimension)
    .group(Electronic_Revenue,"Electronic")
    .stack(Auto_Revenue, "Auto & Accessories")
    .stack(Home_Revenue, "Home & Furniture")
    .stack(Fashion_Revenue, "Fashion")
    .renderArea(true)
    .margins({top: 50, right: 10, bottom: 30, left: 80})
    .elasticY(true)
    .brushOn(true) // Sửa từ false -> true 
  
    .ordinalColors(['#573504', '#D14A1F','#205EC9', '#D9B600'])
    .yAxisLabel("Revenue")
    .xAxisLabel("Month")
      .on('renderlet', function(Areachart) {
         Areachart.selectAll('rect').on('click', function(d) {
         });
     });



     Areachart1copy.width(650)
     .height(280)
     .x(d3.scaleLinear().domain([1,12]))
      .dimension(MonthDimension)
      .group(Electronic_Revenue,"Electronic")
      .stack(Auto_Revenue, "Auto & Accessories")
      .stack(Home_Revenue, "Home & Furniture")
      .stack(Fashion_Revenue, "Fashion")
      .renderArea(true)
      .margins({top: 50, right: 10, bottom: 30, left: 80})
      .elasticY(true)
      .brushOn(true) // Sửa từ false -> true 
    
      .ordinalColors(['#573504', '#D14A1F','#205EC9', '#D9B600'])
      .yAxisLabel("Revenue")
      .xAxisLabel("Month")
        .on('renderlet', function(Areachart) {
           Areachart.selectAll('rect').on('click', function(d) {
           });
       });
  


// Area Chart 2

  var Electronic_profit=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Electronic") {return d.Profit;}else{return 0;}});
   var Fashion_profit=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Fashion") {return d.Profit;}else{return 0;}});
   var Auto_profit=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Auto & Accessories") {return d.Profit;}else{return 0;}});
   var Home_profit=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Home & Furniture") {return d.Profit;}else{return 0;}});

   

   Areachart2.width(650)
   .height(280)
   .x(d3.scaleLinear().domain([1,12]))
    .dimension(MonthDimension)
    .group(Electronic_profit,"Electronic")
    .stack(Auto_profit, "Auto & Accessories")
    .stack(Home_profit, "Home & Furniture")
    .stack(Fashion_profit, "Fashion")
  //   .elasticX(true)
     .elasticY(true)
    .renderArea(true)
    .margins({top: 50, right: 10, bottom: 30, left: 80})
    .brushOn(true)
    .ordinalColors(['#573504', '#D14A1F','#205EC9', '#D9B600'])
    .yAxisLabel("Profit")
    .xAxisLabel("Month")

    Areachart2copy.width(650)
    .height(280)
    .x(d3.scaleLinear().domain([1,12]))
     .dimension(MonthDimension)
     .group(Electronic_profit,"Electronic")
     .stack(Auto_profit, "Auto & Accessories")
     .stack(Home_profit, "Home & Furniture")
     .stack(Fashion_profit, "Fashion")
   //   .elasticX(true)
      .elasticY(true)
     .renderArea(true)
     .margins({top: 50, right: 10, bottom: 30, left: 80})
     .brushOn(true)
     .ordinalColors(['#573504', '#D14A1F','#205EC9', '#D9B600'])
     .yAxisLabel("Profit")
     .xAxisLabel("Month")

  // Pie Chart
  

  var categoryDimension = mycrossfilter.dimension(function(d) {
    return d.Product_Category;
  });
 var valueGroup2 = categoryDimension.group().reduceSum(function(d) {
    return d.Revenue;
  })
  var total = sumrevenue_S(Data, Data.length);

pieChart
  .width(630)
  .height(330)
  .dimension(categoryDimension)
  .group(valueGroup2)
  .legend(dc.legend().x(500).y(100).gap(5))
  .ordinalColors(['#D9B600', '#205EC9', '#D14A1F', '#573504'])
  .label(function(d) {
    return null; // Set the label to null
})
  .title(function(d) {
    return 'Category: ' + d.key + '\nRevenue: $' + changenum(d.value);
});
  

  pieChartcoppy
  .width(630)
  .height(330)
  .dimension(categoryDimension)
  .group(valueGroup2)
  .legend(dc.legend().x(500).y(200).gap(5))
  .ordinalColors(['#D9B600', '#205EC9', '#D14A1F', '#573504'])
  .label(function(d) {
    return null; // Set the label to null
})
  .title(function(d) {
    return 'Category: ' + d.key + '\nRevenue: $' + changenum(d.value);
});


 // Row Chart - Customer Segmentation Chart
//  var genderDimension = mycrossfilter.dimension(function(Data) { 
//   return Data.Segment; 
// });
// var genderGroup = genderDimension.group().reduceSum(function(d) {
//   return d.Revenue;
// });

var customerTypeDimension = mycrossfilter.dimension(function (d) { return d.Segment; });


   var ordersGroup = customerTypeDimension.group().reduceCount();
   var averageOrderValueGroup = customerTypeDimension.group().reduce(
       function (p, v) {
           p.count++;
           p.total += +v.Revenue;
           p.average = p.total / p.count;
           return p;
       },
       function (p, v) {
           p.count--;
           if (p.count === 0) {
               p.total = 0;
               p.average = 0;
           } else {
               p.total -= +v.Revenue;
               p.average = p.total / p.count;
           }
           return p;
       },
       function () {
           return { count: 0, total: 0, average: 0 };
       }
   );

   var totalRevenueGroup = customerTypeDimension.group().reduceSum(function (d) { return +d.Revenue; });



   bubbleChart
   .dimension(customerTypeDimension)
   .group(averageOrderValueGroup)
   .width(800)
   .height(280)
   .margins({ top: 30, right: 50, bottom: 40, left: 50 })
   .legend(dc.legend().x(400).y(200).itemHeight(13).gap(5))
   .x(d3.scaleLinear().domain([0,30000]))
    .y(d3.scaleLinear().domain([250,400]))
    // .label(p => p.key)
    .yAxisPadding(50)
    .xAxisPadding(1000)
   .yAxisLabel('Average Order Value')
   .xAxisLabel('Count of Order')
   .keyAccessor(function (p) { return p.value.count; })
   .valueAccessor(function (p) { return p.value.average; })
   .radiusValueAccessor(function (p) { return p.value.total; })
   .maxBubbleRelativeSize(0.05)
   .renderHorizontalGridLines(true)
   .renderVerticalGridLines(true)
   .renderLabel(false)
   .renderTitle(true)
   .elasticX(true)
   .elasticY(true)
   .elasticRadius(true)
   .brushOn(false)
   .transitionDuration(1000)
   .colorAccessor(p => p.key)
   .ordinalColors(['#ac2525', '#1B8043', '#FF14D8'])
    // .colors(d3.scaleOrdinal(d3.schemeCategory10))
    .title(p => [
          p.key,
          `Count: ${numberFormat(p.value.count)}`,
          `Average: ${numberFormat(p.value.average)}`,
          `Total Revenue: ${numberFormat(p.value.total)}`
      ].join('\n'))
    // Create the legend
  // var legend = dc.legend().x(10).y(10).itemHeight(13).gap(5);

  // Add the legend to the chart
  // bubbleChart.legend(legend);
// rowChart
//   .width(680)
//   .height(300)
//   .dimension(genderDimension)
//   .group(genderGroup)
//   .margins({top: 30, right: 10, bottom: 40, left:20})
//   .ordinalColors(['#0E5E9C'])
//   // .renderLabel(null)
//   // .label(d => d.key.split('.')[1])
//   .ordering(function(d) { return -d.value; }) // Order by value in descending order
//   .cap(3)
//   .elasticX(true)
//   .xAxis().ticks(4);
//   //  .on('renderlet', function(chart) {
//   //  // Add onClick event to the rows
//   //   chart.selectAll('g.row').on('click', function(d) {
//   //     // Access the data of the clicked row
//   //    // Add your custom onClick logic here
//   //          console.log('Clicked:', d);
//   //   });
//   // });


  // rowChartcoppy
  // .width(680)
  // .height(300)
  // .dimension(genderDimension)
  // .group(genderGroup)
  // .margins({top: 30, right: 10, bottom: 40, left:20})
  // .ordinalColors(['#0E5E9C'])
  // .ordering(function(d) { return -d.value; }) // Order by value in descending order
  // .cap(3)
  // .elasticX(true)
  // .xAxis().ticks(4);

 // Row chart - Geographic Analysis 
 var RegionDimension = mycrossfilter.dimension(function(d) { 
  return d.Region; 
});
var RegionValue = RegionDimension.group().reduceSum(function(d) {
  return d.Revenue;
});

rowChart2
  .width(680)
  .height(300)
  .dimension(RegionDimension)
  .group(RegionValue)
  .margins({top: 10, right: 10, bottom: 40, left:20})
  .ordinalColors(['#0E5E9C'])
  // .renderLabel(null)
  // .label(d => d.key.split('.')[1])
  .ordering(function(d) { return -d.value; }) // Order by value in descending order
  .cap(7)
  .elasticX(true)
  .xAxis().ticks(6);
   
  rowChart2coppy
  .width(680)
  .height(300)
  .dimension(RegionDimension)
  .group(RegionValue)
  .margins({top: 10, right: 10, bottom: 40, left:20})
  .ordinalColors(['#0E5E9C'])
  .ordering(function(d) { return -d.value; }) // Order by value in descending order
  .cap(7)
  .elasticX(true)
  .xAxis().ticks(6);
 
// Number display - Total Revenue

var valueGroup = mycrossfilter.groupAll().reduceSum(function(d) {
  return d.Revenue;
});
numberDisplay1
   .group(valueGroup)
   .valueAccessor(function(d) {
     return d; // Use the entire group value as the displayed number
   })
   .formatNumber(function(d){
     return changenum(d);
   }) // Format the number with commas for thousands
   .render();

   // Number display - Total profit
   var profitGroup = mycrossfilter.groupAll().reduceSum(function(d) {
     return d.Profit;
   });
   numberDisplay2
      .group(profitGroup)
      .valueAccessor(function(d) {
        return d; // Use the entire group value as the displayed number
      })
      .formatNumber(function(d){
        return changenum(d);
      }) // Format the number with commas for thousands
      .render();

      // Number display - Total profit
   var orderGroup = mycrossfilter.groupAll().reduceCount();
   numberDisplay3
      .group(orderGroup)
      .valueAccessor(function(d) {
        return d; // Use the entire group value as the displayed number
      })
      .formatNumber(function(d){
        return changenum(d);
      }) // Format the number with commas for thousands
      .render();

      
      var functionGroup = mycrossfilter.groupAll().reduce(
        function(p, v) {
          p.Profitsum += v.Profit;
          p.Revenuesum += v.Revenue;
          return p;
        },
        function(p, v) {
           p.Profitsum -= v.Profit;
           p.Revenuesum -= v.Revenue;
          return p;
        },
        function() {
          return { Profitsum: 0, Revenuesum: 0 };
        }
      );
      numberDisplay4
   .group(functionGroup)
   .valueAccessor(function(d) {
     // Calculate and display the result of the function a/b
     return d.Revenuesum !== 0 ? (d.Profitsum / d.Revenuesum)*100 : 0;
   })
   .formatNumber(d3.format(".2f")) // Format the number to two decimal places
   .render();

   var AvgGroup = mycrossfilter.groupAll().reduce(
     function(p, v) {
       p.sum += v.Aging;
       p.count += 1;
       return p;
     },
     function(p, v) {
        p.sum -= v.Aging;
        p.count -= 1;
       return p;
     },
     function() {
       return { sum: 0, count: 0 };
     }
   );


   numberDisplay5
   .group(AvgGroup)
   .valueAccessor(function(d) {
     // Calculate and display the result of the function a/b
     return d.count !== 0 ? d.sum / d.count : 0;
   })
   .formatNumber(d3.format(".0f")) // Format the number to two decimal places
   .render();
   
dc.renderAll(groupname);

var button = document.getElementById("reset");
button.addEventListener("click", function() {
  dc.filterAll(groupname);
  dc.renderAll(groupname);
  
 });

  //  return {choro: choro, pie: pieChart, pie_product: pieproduct, row: rowChart, area1: Areachart1, area2: Areachart2, number: numberDisplay1, number:numberDisplay2, number:numberDisplay3, number:numberDisplay4, number:numberDisplay5};
})
.catch(function(error) {
   // Handle any errors that might occur during loading
   console.log(error);
 });
}

function changenum(number){
  var options = {
     notation: "compact",
  };
  var USformat = new Intl.NumberFormat("en-US",options);
  var USformatnumer = USformat.format(number);
  return USformatnumer;
}
function sumrevenue_S(Data, n){
  var count = 0;
  for(var i =0; i<n; i++){
        var revenue = Data[i].Revenue;
        count= count+revenue;     
     
  }
  total = Math.round(count);
  return total;     
}


//zoom

