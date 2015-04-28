//This controller initializes application level Services Depending on Routes

angular.module('app.controller', ['directive.chat', 'directive.user', 'ionic', 'directive.layout'])
        .controller('ChatRoomCtrl', function ($scope, $log, $ionicModal, $timeout, $stateParams, $chat, $ionicScrollDelegate, $users) {
            var app = this;
            app.messages = [];
            if ($stateParams.roomid === undefined)
                $stateParams.roomid = 'bravehackers';
            app.roomname = $stateParams.roomid;

            $chat.setRoom(app.roomname).then(function (room) {
                app.messages = $chat.messages;
                app.users = $chat.users;
                $log.info('room set: ' + room);
            }, function (reason) {
                alert('Failed getRoom: ' + reason);
            });

            $users.getUser().then(function (user) {
                return $users.getUser().then(function (user) {
                    $log.debug("Initialliezed User= " + user.name);
                    app.currentUser = $users.user;
                    ;
                }), function (reason) {
                    alert('Failed getUser: ' + reason);
                };
            })

            app.ytembed = $stateParams.embed;
            if (app.ytembed === undefined)
                app.ytembed = 'KBKXu3Kg4yg';
            else
                console.log('embed' + app.ytembed);

            app.sendMessage = function () {
                $ionicScrollDelegate.scrollBottom(true);
                $chat.sendMessage(app.message)
                app.message = '';
                $ionicScrollDelegate.scrollBottom(true);
            };

            $scope.$watch(function(s) {
                return s.app.messages.length;
            }, function(oldvalue, newvalue){
                $ionicScrollDelegate.scrollBottom(true);
              //  console.dir($chat.messages);
            })

            app.ytsrc = 'https://www.youtube.com/embed/' + app.ytembed + '?rel=0&playsinline=1';
            app.hideTime = true;
            var alternate,
                    isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
            app.inputUp = function () {
                if (isIOS)
                    app.data.keyboardHeight = 216;
                $timeout(function () {
                    $ionicScrollDelegate.scrollBottom(true);
                }, 300);
            };
            app.inputDown = function () {
                if (isIOS)
                    app.data.keyboardHeight = 0;
                $ionicScrollDelegate.resize();
            };
            app.closeKeyboard = function () {
                // cordova.plugins.Keyboard.close();
            };
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

        ;
        