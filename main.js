var app = angular.module('500lines', []);

app.controller('Spreadsheet', ['$scope', function($scope) {
    // Define your rows and columns
    $scope.Cols = ['A', 'B', 'C', 'D', 'E'];
    $scope.Rows = [1, 2, 3, 4, 5];

    // Define a sheet to hold data
    $scope.sheet = {};

    // Reset function to clear the spreadsheet
    $scope.reset = function() {
        $scope.sheet = {};
    };

    // Calculate function placeholder
    $scope.calc = function() {
        // Add calculation logic here if needed
    };
}]);
