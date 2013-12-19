function RepayCalcCtrl($scope,$http){


    $scope.submit_contract = function(contract){

        if(($scope.contract.date < 200401) || ($scope.contract.date > 201312)){
            $scope.warning = "warning:利率不存在，请输入2004年之后，2014年之前的合同!";
        }

        else{
            $http.post('/input_handler',contract).
            success(function(data){
                var extra_data = data.data.pop();
                $scope.repayment_seq = data.data;
                $scope.sum_prin_intr = (extra_data.sum_principal_paid + extra_data.sum_interset_paid).toFixed(2);
                $scope.principal_paid = extra_data.sum_principal_paid.toFixed(2);
                $scope.interest_paid = extra_data.sum_interset_paid.toFixed(2);
            });
      }
  }

    $scope.selectItem = function(row) {
        $scope.selectedRow = row;
    };
}