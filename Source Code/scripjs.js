let rowConverter = function (d) {
    //let parseTime = d3.timeParse("%m/%d/%y")
    return {

    OrderID : parseInt(d["Order ID"]),
    Date : new Date(d["Order Date"]).getMonth()+1,
    Aging : parseInt(d["Aging"]),
    Product_Category : d["Product Category"],
    Product : d["Product"],
    Revenue : parseFloat(d["Revenue"]),
    Segment: d["Segment"],
    Region: d["Region_country"]

}
}; 



function task(){

var Areachart1  = dc.lineChart('.area1');
var Areachart2  = dc.lineChart('.area2');
var rowChart = dc.rowChart('.row'); // , 'myChartGroup');
var pieChart = dc.pieChart('.pie'); //, 'myChartGroup');
var countChart = dc.dataCount("#mystats");
var pieproduct = dc.pieChart('.pie_product');

d3.csv("https://raw.githubusercontent.com/daibacgantay/consumption-in-business/main/Data/Clean_Data.csv",rowConverter, function (error, Data) {
if (error) {
 console.log(error);
 
} else {
    var mycrossfilter = crossfilter(Data);



    //Area chart


    // Area chart1
    var MonthDimension= mycrossfilter.dimension(function(d) {return d.Date;});
    var Electronic_Revenue=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Electronic") {return d.Revenue;}else{return 0;}});
    var Fashion_Revenue=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Fashion") {return d.Revenue;}else{return 0;}});
    var Auto_Revenue=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Auto & Accessories") {return d.Revenue;}else{return 0;}});
    var Home_Revenue=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Home & Furniture") {return d.Revenue;}else{return 0;}});

    Areachart1.width(500)
    .height(280)
    .x(d3.scale.linear().domain([1,12]))
     .dimension(MonthDimension)
     .group(Electronic_Revenue,"Electronic")
     .stack(Auto_Revenue, "Auto & Accessories")
     .stack(Home_Revenue, "Home & Furniture")
     .stack(Fashion_Revenue, "Fashion")
     .renderArea(true)
     .margins({top: 100, right: 50, bottom: 30, left: 60})
   //   .elasticX(true)
     .brushOn(false)
     .legend(dc.legend().x(80).y(20).itemHeight(7).gap(12))
     .ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00"])
     .yAxisLabel("Revenue")
     .xAxisLabel("Month")
      .on('renderlet', function(Areachart) {
         Areachart.selectAll('rect').on('click', function(d) {
            console.log('click!', d);
         });
      });

 
// Area Chart 2

   var Electronic_profit=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Electronic") {return d.Revenue;}else{return 0;}});
    var Fashion_profit=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Fashion") {return d.Revenue;}else{return 0;}});
    var Auto_profit=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Auto & Accessories") {return d.Revenue;}else{return 0;}});
    var Home_profit=MonthDimension.group().reduceSum(function(d) {if (d.Product_Category === "Home & Furniture") {return d.Revenue;}else{return 0;}});

    Areachart2.width(500)
    .height(280)
    .x(d3.scale.linear().domain([1,12]))
     .dimension(MonthDimension)
     .group(Electronic_profit,"Electronic")
     .stack(Auto_profit, "Auto & Accessories")
     .stack(Home_profit, "Home & Furniture")
     .stack(Fashion_profit, "Fashion")
   //   .elasticX(true)
   //   .elasticY(true)
     .renderArea(true)
     .margins({top: 100, right: 50, bottom: 30, left: 60})
     .brushOn(false)
     .legend(dc.legend().x(80).y(20).itemHeight(7).gap(12))
     .ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00"])
     .yAxisLabel("Profit")
     .xAxisLabel("Month")
      .on('renderlet', function(Areachart2) {
         Areachart2.selectAll('rect').on('click', function(d) {
            console.log('click!', d);
         });
      });

      
   // Pie Chart
   var genderDimension = mycrossfilter.dimension(function(Data) { 
      return Data.Segment; 
   });
   var genderGroup = genderDimension.group().reduceCount();

   
pieChart
   .width(500)
   .height(250)
   .dimension(genderDimension)
   .group(genderGroup);

// Pie Product. pieproduct

var productCategoryDimenson =  mycrossfilter.dimension(function(Data) { 
   return Data.Product_Category; 
}); 
var productCategoryDimensonGroup = productCategoryDimenson.group().reduceSum(function(d) {
   return d.Revenue;
 })
 

 pieproduct
   .width(500)
   .height(250)
   .dimension(productCategoryDimenson)
   .group(productCategoryDimensonGroup)
   .label(function(d) {
      // Customize the label format as needed
      return d.key ;
    })
   .on('renderlet', function(chart) {
      chart.selectAll('rect').on('click', function(d) {
         console.log('click!', d);
      });
   });

   //Horizontal Bar Chart
   

   var categoryDimension = mycrossfilter.dimension(function(d) {
      return d.Region;
    });
   var valueGroup = categoryDimension.group().reduceSum(function(d) {
      return d.Revenue;
    })

    
  

    
rowChart
   .width(510)
   .height(270)
   .dimension(categoryDimension)
   .group(valueGroup)
   //.elasticX(true)
   .ordering(function(d) { return -d.Revenue; }) // Order by value in descending order
  .cap(3);
  
   //count charrt
countChart
   .dimension(mycrossfilter)
   .group(mycrossfilter.groupAll());



   // Card



   Areachart1.render();
Areachart2.render();
rowChart.render();
pieChart.render();
pieproduct.render();
countChart.render();

}
});
}

