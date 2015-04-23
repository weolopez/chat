angular.module('starter.controllers', ['service.share'])


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

        .controller('RoomCtrl', function ($scope, $share) {
            
            $scope.shareRoom = function () {
                $share.generic("message", "subject","link");
            }
        })

        .controller('ChatsCtrl', function ($scope) {
            $scope.remove = function (chat) {
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
