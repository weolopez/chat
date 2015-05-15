angular.module('component.app-swipe', [])
        .directive('appSwipe', function ($window, $wiki) {
            return {
                restrict: 'E',
                templateUrl: 'components/app-swipe/app-swipe.html',
                scope: {
                },
                controller: function ($ionicSlideBoxDelegate, $wiki) {
               /*     var app = this;
                    app.test='TESTCODE';
                    var wiki = $wiki;
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
                    app.columns = $window.Math.floor(app.columns / 620);
                    app.pages = [];
                    wiki.pages = app.pages;*/
                },
                controllerAs: 'app'
            };
        });