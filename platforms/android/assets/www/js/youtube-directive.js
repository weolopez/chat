angular.module('directive.video', [])
        .directive('myYoutube', function ($sce) {
            return {
                restrict: 'EA',
                scope: {code: '='},
                replace: true,
                template: '<div style="height:auto;"><iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
                link: function (scope) {
                    scope.$watch('code', function (newVal) {
                        if (newVal) {
                            scope.url = "https://www.youtube.com/embed/" + newVal;                            
                        }
                    });
                }
            };                   
        });