//This controller initializes application level Services Depending on Routes

angular.module('app.controller', ['directive.chat', 'ionic'])
        .controller('AppCtrl', function ($ionicModal, $timeout, $stateParams, Room, $ionicScrollDelegate, $chat) {
            this.ytembed = $stateParams.embed;
            if (this.ytembed === undefined)
                this.ytembed = 'KBKXu3Kg4yg';
            else
                console.log('embed' + this.ytembed);

            this.roomname = $stateParams.roomid;
            this.messages = Room.messages;
            
            this.sendMessage = function () {
                $ionicScrollDelegate.scrollBottom(true);
                Room.sendMessage(this.message)
            };
            
            this.ytsrc = 'https://www.youtube.com/embed/' + this.ytembed + '?rel=0&playsinline=1';

            this.hideTime = true;
            var alternate,
                    isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
                    
            
            this.inputUp = function () {
                if (isIOS)
                    this.data.keyboardHeight = 216;
                $timeout(function () {
                    $ionicScrollDelegate.scrollBottom(true);
                }, 300);
            };
            this.inputDown = function () {
                if (isIOS)
                    this.data.keyboardHeight = 0;
                $ionicScrollDelegate.resize();
            };
            this.closeKeyboard = function () {
                // cordova.plugins.Keyboard.close();
            };
        })
        ;
        