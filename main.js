angular.module("500lines", []).controller("Spreadsheet", function($scope, $timeout) {
        $scope.Cols = [], $scope.Rows = [];
        for (col of range("A", "H")) {$scope.Cols.push(col);}
        for (row of range(1, 20)) {$scope.Rows.push(row);}

        // UP(38) and DOWN(40)/ENTER(13) move focus to the row above (-1) and below (+1).
        $scope.keydown = ({which}, col, row) => {
            switch (which) {
                case 38:
                case 40:
                case 13:
                    $timeout(()=> {
                        const direction = (which === 38) ? -1 : 1;
                        const cell = document.querySelector(`#${col}${row + direction}`);
                        if (cell) {
                            cell.focus();
                        }
                    })
            }
        };

        // Default sheet content, with some data cells and one formula cell
        $scope.reset = () => {
            $scope.sheet = {A1: 1874, B1: "+", C1: 2046, D1: "->", E1: "=A1+C1"};
        }

        // Define the intializer and immediately call it
        ($scope.init = () => {
            // Restore the previous sheet. Reset to default if it's not the first run
            $scope.sheet = angular.fromJson(localStorage.getItem(""));
            if (!$scope.sheet) {$scope.reset();}
            $scope.worker = new Worker("worker.js");
        }).call()

        // Formula cells may produce errors in .errs. Normal cell contents are in .vals
        $scope.errs = {}, $scope.vals = {};

        // define the calculation handler. Not defining it yet
        $scope.calc = ()=> {
            const json = angular.toJson($scope.sheet);
            const promise = $timeout(() => {
                // If the worker has not return in 99 milliseconds, terminate it
                $scope.worker.terminate();

                // Back up to the previous state and create a new worker
                $scope.init();

                // Redo the calculation using the last known state
                $scope.calc();
            }, 99);

            // When the worker returns, apply its effect on the scope
            $scope.worker.onmessage = ({data}) => {
                $timeout.cancel(promise);
                localStorage.setItem("", json);
                $timeout(() => {
                    [$scope.errs, $scope.vals] = data;})
            }

            // Post the current sheet content for the worker to process
            $scope.worker.postMessage($scope.sheet);

            // Start calculation when worker is ready
            $scope.worker.onmessage = $scope.calc;
            $scope.worker.postMessage(null);
        }
    }
)

function* range(cur, end) {
    while(cur <= end) {
        yield cur;
        // If it’s a number, increase it by one; otherwise move to next letter
        cur = (isNaN(cur) ? String.fromCodePoint(cur.codePointAt()+1): cur+1)
    }
};