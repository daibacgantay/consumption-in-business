let rowConverter = function (d) {
   return {
   OrderID : parseInt(d["Order ID"]),
   Date : new Date(d["Order Date"]).getMonth()+1,
   Aging : parseInt(d["Aging"]),
   Product_Category : d["Product Category"],
   Product : d["Product"],
   Revenue : parseFloat(d["Revenue"]),
   Segment: d["Segment"],
   Region: d["Region_country"],
   Profit: parseFloat(d["Profit"]),
   lat: parseFloat(d["latitude"]),
   long: parseFloat(d["longitude"])

}
}; 


function task(){

var groupname = "Bubbles";
var Areachart1  = dc.lineChart(".area1", groupname);
var Areachart2  = dc.lineChart(".area2", groupname);
var rowChart = dc.rowChart(".row",groupname); // , 'myChartGroup');
var pieChart = dc.pieChart(".pie", groupname); //, 'myChartGroup');
var choro = dc_leaflet.bubbleChart(".map", groupname);
var numberDisplay1 = dc.numberDisplay("#salenum", groupname);
var numberDisplay2 = dc.numberDisplay("#profitnum", groupname);
var numberDisplay3 = dc.numberDisplay("#ordervalue", groupname);
var numberDisplay4 = dc.numberDisplay("#marginvalue", groupname);
var numberDisplay5 = dc.numberDisplay("#Avgday", groupname);

d3.csv("https://raw.githubusercontent.com/daibacgantay/consumption-in-business/main/Data/data_use_forcode.csv", rowConverter)
 .then(function(Data) {
   var mycrossfilter = crossfilter(Data);

   //Map chart 
  dataP = [];
       var pos = {};
       Data.forEach(function(d) {
           pos[d.Region] = [d.lat, d.long];
                                       
       });
       console.log(pos); 
       for(var i = 0; i < Data.length; i++) {
           dataP.push({'Region':Data[i].Region,'value':Data[i].Revenue});

       }
       console.log(dataP);

       
       var facilities = mycrossfilter.dimension(function(d) { return d.Region; });
       facilitiesGroup = facilities.group().reduceSum(function(d) { return d.Revenue;});

       choro
       .dimension(facilities)
       .group(facilitiesGroup)
       .width(660)
       .height(300)
       .center([20,-5])
       .renderPopup(true)
       .margins({top: 20, right: 0, bottom: 0, left: 0})
       
       .colors(colorbrewer.Reds[5])
       .colorDomain([
           d3.min(facilitiesGroup.all(), dc.pluck('value')),
           d3.max(facilitiesGroup.all(), dc.pluck('value'))
       ])
       .colorAccessor(function(d,i) {
          
           return d.value;
       })
       .popup(d => d.key)
       .zoom(1)
       .locationAccessor(d => pos[d.key])
       .r(d3.scaleLog().domain([1, 100000000000]).range([0,20]))
       .legend(dc_leaflet.legend().position('bottomleft').legendTitle("Bubble"));

   //Area chart
   // Area chart1
   var MonthDimension= mycrossfilter.dimension(function(d) {return d.Date;});
   var Electronic_Revenue=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Electronic") {return d.Revenue;}else{return 0;}});
   var Fashion_Revenue=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Fashion") {return d.Revenue;}else{return 0;}});
   var Auto_Revenue=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Auto & Accessories") {return d.Revenue;}else{return 0;}});
   var Home_Revenue=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Home & Furniture") {return d.Revenue;}else{return 0;}});
   
   Areachart1.width(650)
   .height(280)
   .x(d3.scaleLinear().domain([1,12]))
    .dimension(MonthDimension)
    .group(Electronic_Revenue,"Electronic")
    .stack(Auto_Revenue, "Auto & Accessories")
    .stack(Home_Revenue, "Home & Furniture")
    .stack(Fashion_Revenue, "Fashion")
    .renderArea(true)
    .margins({top: 50, right: 10, bottom: 40, left: 80})
    //.elasticY(true)
    .brushOn(true) // Sửa từ false -> true 
    .legend(dc.legend().legendText(function(d) {
      return d.name;
  }).itemHeight(13).gap(5).horizontal(true).legendWidth(300).itemWidth(140).x(280).y(10))
    .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef'])
    .yAxisLabel("Revenue")
    .xAxisLabel("Month")
      .on('renderlet', function(Areachart) {
         Areachart.selectAll('rect').on('click', function(d) {
         });
     });


// Area Chart 2

  var Electronic_profit=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Electronic") {return d.Revenue;}else{return 0;}});
   var Fashion_profit=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Fashion") {return d.Revenue;}else{return 0;}});
   var Auto_profit=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Auto & Accessories") {return d.Revenue;}else{return 0;}});
   var Home_profit=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Home & Furniture") {return d.Revenue;}else{return 0;}});

   

   Areachart2.width(650)
   .height(280)
   .x(d3.scaleLinear().domain([1,12]))
    .dimension(MonthDimension)
    .group(Electronic_profit,"Electronic")
    .stack(Auto_profit, "Auto & Accessories")
    .stack(Home_profit, "Home & Furniture")
    .stack(Fashion_profit, "Fashion")
  //   .elasticX(true)
  //   .elasticY(true)
    .renderArea(true)
    .margins({top: 50, right: 10, bottom: 40, left: 80})
    .brushOn(true)
    .legend(dc.legend().legendText(function(d) {
      return d.name;
  }).itemHeight(13).gap(5).horizontal(true).legendWidth(300).itemWidth(140).x(280).y(0))
    .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef'])
    .yAxisLabel("Profit")
    .xAxisLabel("Month")
    .on('renderlet', function(Areachart) {
      Areachart.selectAll('rect').on('click', function(d) {
      });
  });
     
  // Pie Chart
  var genderDimension = mycrossfilter.dimension(function(Data) { 
     return Data.Segment; 
  });
  var genderGroup = genderDimension.group().reduceCount();

  
pieChart
  .width(450)
  .height(250)
  .dimension(genderDimension)
  .group(genderGroup)
  
  
  
  
  
  
  //  .on('renderlet', function(chart) {
  //     // Add onClick event to the pie slices
  //     chart.selectAll('path').on('click', function(d) {
  //     });
  //   });
  

  var categoryDimension = mycrossfilter.dimension(function(d) {
     return d.Product_Category;
   });
  var valueGroup2 = categoryDimension.group().reduceSum(function(d) {
     return d.Revenue;
   })

   
rowChart
  .width(650)
  .height(270)
  .dimension(categoryDimension)
  .group(valueGroup2)
  .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef'])
  .renderLabel(null)
  .ordering(function(d) { return -d.value; }) // Order by value in descending order
  .cap(4)
   .on('renderlet', function(chart) {
   // Add onClick event to the rows
    chart.selectAll('g.row').on('click', function(d) {
      // Access the data of the clicked row
     // Add your custom onClick logic here
           console.log('Clicked:', d);
    });
  });
 
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


