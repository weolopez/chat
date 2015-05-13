angular.module('component.page', [])
        .directive('page', function () {
            return {
                restrict: 'E',
                templateUrl: 'components/page/page.html',
                scope: {
                    pageid: '='
                },
                controller: function ($scope) {
                    var page = this;
                    page.pageid = $scope.pageid;
                    page.components = [ { url: 'components/wiki/wiki.html' }, { url: 'components/wiki/wiki.html' } ]
                },
                controllerAs: 'page'
            };
        });