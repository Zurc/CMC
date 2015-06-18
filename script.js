var colorApp = angular.module('colorApp', []);
colorApp.controller('ColorCtrl', function($scope) {
  $scope.colors = [
    {
      'name': '@color', 
      'hexcolor': '952684;', 
      'rgbcolor': 'rgb(149,38,132)',
      'cmykcolor': 'cmyk(0,74,11,42)'
    },
  ];

  // to change hex color in a certain percentage
  $scope.shadeHexColor = function(color, percent) {
    var num = parseInt(color,16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
  };

  // to transform hex to rgb color
  $scope.hexToRgb = function(hexcolor) {
    var bigint = parseInt(hexcolor, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return "rgb(" + r + "," + g + "," + b + ")";
  };

  //  to transform hex to cmyk color
  $scope.hexToCMYK = function(hexcolor) {
   var computedC = 0;
   var computedM = 0;
   var computedY = 0;
   var computedK = 0;

   hexcolor = (hexcolor.charAt(0)=="#") ? hexcolor.substring(1,7) : hexcolor;

   var r = parseInt(hexcolor.substring(0,2),16); 
   var g = parseInt(hexcolor.substring(2,4),16); 
   var b = parseInt(hexcolor.substring(4,6),16); 

   // BLACK
   if (r==0 && g==0 && b==0) {
    computedK = 1;
    return "cmyk(0,0,0,1)";
   }

   computedC = 1 - (r/255);
   computedM = 1 - (g/255);
   computedY = 1 - (b/255);

   var minCMY = Math.min(computedC,Math.min(computedM,computedY));

   computedC = Math.round((computedC - minCMY) / (1 - minCMY) * 100) ;
   computedM = Math.round((computedM - minCMY) / (1 - minCMY) * 100) ;
   computedY = Math.round((computedY - minCMY) / (1 - minCMY) * 100) ;
   computedK = Math.round(minCMY * 100);

   return "cmyk(" + computedC + "," + computedM + "," + computedY + "," + computedK + ")";
  }

  $scope.addColor = function() {
    $scope.colors.length = 1;
    $scope.colors[0].name = '@color';
    $scope.colors[0].hexcolor = $scope.enteredColor;
    $scope.colors[0].rgbcolor = $scope.hexToRgb($scope.colors[0].hexcolor);
    $scope.colors[0].cmykcolor = $scope.hexToCMYK($scope.colors[0].hexcolor);
    $scope.posperc = 10;
    $scope.negperc = -10;
  };

  $scope.posperc = 10;
  $scope.negperc = -10;

  $scope.light = function(){
    
    var next = {
                'name': '@color' + '+' + parseInt($scope.posperc), 
                'hexcolor': $scope.shadeHexColor($scope.colors[$scope.colors.length-1].hexcolor, 10), 
                'rgbcolor': $scope.hexToRgb($scope.shadeHexColor($scope.colors[$scope.colors.length-1].hexcolor, 10)),
                'cmykcolor': $scope.hexToCMYK($scope.shadeHexColor($scope.colors[$scope.colors.length-1].hexcolor, 10))
              };
    $scope.colors.push(next);
    $scope.posperc = $scope.posperc + 10;
  };

  $scope.dark = function(){
    var previous = {
                'name': '@color' + parseInt($scope.negperc) , 
                'hexcolor': $scope.shadeHexColor($scope.colors[0].hexcolor, -10),
                'rgbcolor': $scope.hexToRgb($scope.shadeHexColor($scope.colors[0].hexcolor, -10)),
                'cmykcolor': $scope.hexToCMYK($scope.shadeHexColor($scope.colors[0].hexcolor, -10))
              };
    $scope.colors.unshift(previous);
    $scope.negperc -= 10;
  };
});