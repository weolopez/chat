//This controller initializes application level Services Depending on Routes

angular.module('app.controller', [])
        .controller('AppCtrl', function ($log, $ionicSlideBoxDelegate, $wiki) {
            var app = this;
            var wiki = $wiki;
            
            app.pages = [
                {template:'components/wiki/templates/fedwiki.html', url:'components/wiki/view/how-to-wiki.json'},
                {template:'components/wiki/templates/weowiki.html', url:'components/wiki/view/how-to-wiki.json', title:'Weo Wiki Template'}
            ]
            
            $log.debug("TEST");

        });