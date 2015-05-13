angular.module('starter.controllers', ['service.share', 'firebase'])


        .controller('PlaylistsCtrl', function ($scope) {
            $scope.playlists = [
                {title: 'Reggae', id: 1},
                {title: 'Chill', id: 2},
                {title: 'Dubstep', id: 3},
                {title: 'Indie', id: 4},
                {title: 'Rap', id: 5},
                {title: 'Cowbell', id: 6}
            ];
        })

        .controller('PlaylistCtrl', function ($scope, $stateParams) {
        })

        .controller('RoomCtrl', function ($scope, $share, $users) {
            
            $scope. loginRoom = function () {
                $users.getUser();
            };
            $scope.shareRoom = function () {
                $share.generic("message", "subject","link");
            };
        })

        .controller('ChatsCtrl', function ($log, $scope, $firebaseObject) {
            var ref = new Firebase('https://uverse-social.firebaseio.com/chat/rooms');
            $firebaseObject(ref).$loaded().then(function (rooms) {
                $log.debug('loaded rooms: ',rooms);
                $scope.rooms=rooms;
            }, function(reason) {
                $log.debug('coud not load rooms: ',reason);
            });
            $scope.addRoom = function () {
                $log.debug('ADDROOM');
            }
    
        })

        .controller('ChatDetailCtrl', function ($scope, $stateParams) {
        })

        .controller('AccountCtrl', function ($scope) {
            $scope.settings = {
                enableFriends: true
            };
        })
        ;
