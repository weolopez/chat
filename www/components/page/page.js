angular.module('component.page', [])
        .directive('page', function ($http, $document, $parse, $log, $wiki) {
            return {
                restrict: 'E',
                templateUrl: 'components/page/page.html',
                scope: {
                    pageref: '='
                },
                controller: function ($scope, $wiki) {                    
                    var page = this;
                    page.wiki = $wiki;
                    page.pageref = $scope.pageref;
                },
                controllerAs: 'page'
            };
        });