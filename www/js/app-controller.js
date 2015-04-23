//This controller initializes application level Services Depending on Routes

angular.module('app.controller', ['directive.chat'])
        .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $stateParams, getRoom) {
            $scope.ytembed = $stateParams.embed;
            if ($scope.ytembed === undefined)
                $scope.ytembed = 'KBKXu3Kg4yg';
            else
                console.log('embed' + $scope.ytembed);

            this.roomname = $stateParams.roomid;
            this.messages = getRoom.messages;
            

            $scope.ytsrc = 'https://www.youtube.com/embed/' + $scope.ytembed + '?rel=0&playsinline=1';

            // Form data for the login modal
            $scope.loginData = {};

            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            // Triggered in the login modal to close it
            $scope.closeLogin = function () {
                $scope.modal.hide();
            };

            // Open the login modal
            $scope.login = function () {
                $scope.modal.show();
            };

            // Perform the login action when the user submits the login form
            $scope.doLogin = function () {
                console.log('Doing login', $scope.loginData);

                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                $timeout(function () {
                    $scope.closeLogin();
                }, 1000);
            };
        })
        ;
        