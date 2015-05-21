/* 
 */
'use strict';

angular.module('component.wiki', [
    'ngStorage'
])
        .controller('WikiCtrl', function () {

        })
        .factory('$wiki', function ($http, $localStorage) {
            var wiki = this;
            var nouns = [];
            var observerCallbacks = [];
            wiki.pages = [];

            if ($localStorage.nouns !== undefined) {
                nouns = $localStorage.nouns;
            }
            else {
                $http.get('https://api.github.com/repos/weolopez/Recursive/contents/views/wiki/pages').then(function (msg) {
                    var content = msg.data;
                    angular.forEach(content, function (value) {
                        var suffix = '.html';
                        var lastIndex = value.name.length - suffix.length;
                        if (value.name.indexOf(suffix, lastIndex) > -1) {
                            nouns.push(value.name.substring(0, lastIndex));
                        }
                    });
                    $localStorage.nouns = nouns;
                    notifyObservers();
                });
            }
            //call this when you know 'foo' has been changed
            var notifyObservers = function () {
                angular.forEach(observerCallbacks, function (callback) {
                    callback();
                });
            };

            return {
                'nouns': nouns,
                'registerObserverCallback': function (callback) {
                    observerCallbacks.push(callback);
                },
                'openFedWiki': function (ref) {
                    alert("TEST");
                    var p = {
                        url: 'http://fed.wiki.org/' + ref + '.json'
                    }
                    wiki.pages.push();
                }
            }
        })
        .directive('wiki', function ($log, $http, $document, $compile) {
            return {
                restrict: 'A',
                scope: {
                    wiki: '='
                },
                controller: function ($scope, $element, $timeout, $wiki, $localStorage) {

                    $scope.storage = $localStorage;
                    function wikifyString(data) {
                        var newMsg = '';
                        var res = data.split(" ");
                        angular.forEach(res, function (value) {
                            angular.forEach($wiki.nouns, function (item) {
                                //console.dir(item);
                                if (item === value) {
                                    value = '<a href="#/wiki/' + item + '">' + item + '</a>';
                                    return false;
                                }
                            });
                            newMsg += value + " ";
                        });
                        return newMsg;
                    }
                    function updateHTML() {
                        $timeout(function () {
                            var value = $element.html();
                            value = wikifyString(value);
                        });
                    }

                    $scope.openFedWiki = function (text) {
                        alert(text);
                    }

                    $wiki.registerObserverCallback(updateHTML);
                    if ($wiki.nouns.length > 0)
                        updateHTML();
                },
                replace: true,
                link: function (scope, element, attrs) {
                    $http.get(scope.wiki.url).then(function (resp) {
                        console.log('Success', resp);
                        $document[0].title = resp.data.title;
                        var txt = "";
                        angular.forEach(resp.data.story, function (value, key) {
                            txt = txt + parseStory(value);
                        });
                        txt = $compile("<div><h1>"+resp.data.title+"</h1>"+txt + "</div>")(scope.$parent)
                        element.append(txt);
                        //page.components = [{url: 'components/wiki/fedwiki.html', title: resp.data.title, story: resp.data.story}, {url: 'components/wiki/wiki.html', title: 'WORKED'}]
                    }, function (err) {
                        console.error('ERR', err);
                        //page.components = [{url: 'components/wiki/wiki.html', title: page.pageref.url}, {url: 'components/wiki/wiki.html', title: 'FAILED'}]
                    })

                    function parseStory(story) {
                        if (story.type === 'paragraph') {
                            var txt = replaceLink(story.text)
                            return "<p>" + txt + "</p>";
                        }
                        if (story.type === 'html') {
                            var txt = replaceLink(story.text)
                            return txt + "</h3>";
                        }
                        if (story.type === 'pagefold') {
                            return "<hr>";
                        }
                        else {
                            $log.error("Story Type Not Found: "+ story.type);
                            return story.type + "<br>" + story.text + "<hr>";
                        }
                    }
                    function replaceLink(txt) {
                        txt = txt.replace(/\[\[(.+?)\]\]/g, function (match) {
                            var display = match.substring(2, match.length - 2);
                            var link = display.replace(/ /g, "-");
                            var newtxt = "<a ng-click=\"page.openFedWiki(\'" + link + "\')\">" + display + "</a>";
                            return newtxt;
                        }, txt);
                        return txt;
                    }
                    ;
                }
            };
        });
    