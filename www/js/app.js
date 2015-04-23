// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['starter.controllers', 'app.controller', 'directive.chat'])
        .config(function ($sceDelegateProvider) {
            $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://www.youtube.com/**']);
        })
        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
        })
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                    .state('app', {
                        resolve: {
                            getRoom: function ($chat, $stateParams) {
                                if ($stateParams.roomid===undefined)$stateParams.roomid='bravehackers'; 
                                return $chat.setRoom($stateParams.roomid).then(function (room) {
                                    console.dir(room);
                                    return room;
                                }, function (reason) {
                                    alert('Failed: ' + reason);
                                })
                            }
                        },
                        url: "/app?embed?roomid",
                        abstract: true,
                        templateUrl: "templates/body.html",
                        controller: 'AppCtrl as app'
                    })

                    .state('app.search', {
                        url: "/search",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/search.html"
                            }
                        }
                    })

                    .state('app.browse', {
                        url: "/browse",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/browse.html"
                            }
                        }
                    })
                    .state('app.playlists', {
                        url: "/playlists",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/playlists.html",
                                controller: 'PlaylistsCtrl'
                            }
                        }
                    })

                    .state('app.single', {
                        url: "/playlists/:playlistId",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/playlist.html",
                                controller: 'PlaylistCtrl'
                            }
                        }
                    })
                    .state('app.room', {
                        url: '/room',
                        views: {
                            'room': {
                                templateUrl: 'templates/room.html',
                                controller: 'RoomCtrl'
                            }
                        }
                    })

                    .state('app.chats', {
                        url: '/chats',
                        views: {
                            'tab-chats': {
                                templateUrl: 'templates/tab-chats.html',
                                controller: 'ChatsCtrl'
                            }
                        }
                    })
                    .state('app.chat-detail', {
                        url: '/chats/:chatId',
                        views: {
                            'tab-chats': {
                                templateUrl: 'templates/chat-detail.html',
                                controller: 'ChatDetailCtrl'
                            }
                        }
                    })
                    .state('app.account', {
                        url: '/account',
                        views: {
                            'tab-account': {
                                templateUrl: 'templates/tab-account.html',
                                controller: 'AccountCtrl'
                            }
                        }
                    })
                    ;
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/room');
        })

        .directive('input', function ($timeout) {
            return {
                restrict: 'E',
                scope: {
                    'returnClose': '=',
                    'onReturn': '&',
                    'onFocus': '&',
                    'onBlur': '&'
                },
                link: function (scope, element, attr) {
                    element.bind('focus', function (e) {
                        if (scope.onFocus) {
                            $timeout(function () {
                                scope.onFocus();
                            });
                        }
                    });
                    element.bind('blur', function (e) {
                        if (scope.onBlur) {
                            $timeout(function () {
                                scope.onBlur();
                            });
                        }
                    });
                    element.bind('keydown', function (e) {
                        if (e.which == 13) {
                            if (scope.returnClose)
                                element[0].blur();
                            if (scope.onReturn) {
                                $timeout(function () {
                                    scope.onReturn();
                                });
                            }
                        }
                    });
                }
            }
        })


        .controller('Messages', function ($scope, $timeout, $ionicScrollDelegate, $chat) {
            $scope.roomName = $chat.name;
            $scope.hideTime = true;
            var alternate,
                    isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
                    
            $scope.sendMessage = function (usr) {
                $chat.addMessage(this.message, usr)
            };
            
            $scope.inputUp = function () {
                if (isIOS)
                    $scope.data.keyboardHeight = 216;
                $timeout(function () {
                    $ionicScrollDelegate.scrollBottom(true);
                }, 300);
            };
            $scope.inputDown = function () {
                if (isIOS)
                    $scope.data.keyboardHeight = 0;
                $ionicScrollDelegate.resize();
            };
            $scope.closeKeyboard = function () {
                // cordova.plugins.Keyboard.close();
            };
        });
