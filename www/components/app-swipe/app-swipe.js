angular.module('component.app-swipe', [])
        .directive('appSwipe', function ($window) {
            return {
                restrict: 'E',
                templateUrl: 'components/app-swipe/app-swipe.html',
                scope: {
                },
                controller: function ($ionicSlideBoxDelegate) {
                    var app = this;
                    var totalPages = [{id: '1234'}, {id: '5678'}, {id: '5678'}, {id: '5678'}];

                    app.next = function () {
                        $ionicSlideBoxDelegate.next();
                    };
                    app.previous = function () {
                        $ionicSlideBoxDelegate.previous();
                    };

                    // Called each time the slide changes
                    app.slideChanged = function (index) {
                        app.slideIndex = index;
                    };
                    app.columns = $window.innerWidth;
                    app.columns = $window.Math.floor( app.columns / 620);
                    app.pages = totalPages.splice(0,app.columns);
                    
                },
                controllerAs: 'app'
            };
        });