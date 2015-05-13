// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['starter.controllers', 'app.controller', 'directive.chat', 'wiki.controller'])
        .config(function ($sceDelegateProvider) {
            $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://www.youtube.com/**']);
            $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://uverse-social.firebaseio.comj/a:;;/**']);
        })
        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
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
                        url: "/app?embed",
                        abstract: true,
                        templateUrl: "views/chatroom/chatroom.html",
                        controller: 'ChatRoomCtrl as app'
                    })
                    .state('app.chat', {
                        url: '/room/:room',
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
                    .state('wiki', {
                        url: "/wiki",
                        abstract: true,
                        templateUrl: "views/wiki/wiki.html",
                        controller: 'WikiCtrl as app'
                    })
                    ;
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/room/bravehackers');
        })
