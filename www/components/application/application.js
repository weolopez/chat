//This controller initializes application level Services Depending on Routes

angular.module('app.controller', [])        
        .factory('$app', function ($http, $localStorage) {
            this.$storage = $localStorage;
    return this;
        })
        .controller('AppCtrl', function ($log, $ionicSlideBoxDelegate, $wiki, $app) {
            var app = this;
            app.$storage = $app.$storage;
            var wiki = $wiki;

            app.$storage.pages = [
                {template: 'components/wiki/templates/fedwiki.html', url: 'components/wiki/view/how-to-wiki.json'},
                {template: 'components/wiki/templates/weowiki.html', url: 'components/wiki/view/how-to-wiki.json', title: 'Weo Wiki Template'}
            ]

            app.openFedWiki = function (text) {
                alert(text);
                $log.debug("TEST");
            }

        });