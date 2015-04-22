angular.module('service.share', ['ionic', 'ngCordova'])
        .service('$share', function ($window, $cordovaSocialSharing, $ionicActionSheet) {
            this.generic = function (message, subject, link) {
                if ($window.plugins !== undefined) {
                    alert('Success ');
                    console.log('\n\n\n\n\nSuccess ');
                    $cordovaSocialSharing
                            .share(message, subject, null, link) // Share via native share sheet
                            .then(function (result) {
                                // Success!
                                alert('Success Room');
                            }, function (err) {
                                // An error occured. Show a message to the user
                                alert('Error Room');
                            });
                }
                else {

                    // Show the action sheet
                    var hideSheet = $ionicActionSheet.show({
                        buttons: [
                            {text: '<b>Share</b>'}
                        ],
                        destructiveText: 'Cancel',
                        titleText: subject+' '+message+' '+link,
                        buttonClicked: function (index) {                            
                    console.log('\n\n\n\n\TODO implement share '+index);
                            return true;
                        },
                        destructiveButtonClicked: function() {      
                            return true;
                        }
                    });
                }
            };

            return this;
        });