angular.module('directive.chat', ['firebase', 'ngStorage'])
        .service('$chat', function ($log, $q, $firebaseObject, $firebaseArray, $users) {

            var usersArray, childRooms = null;
            this.room = null;
            this.setRoom = function (roomName) {
                var deferred = $q.defer();
                deferred.notify('About to get ' + roomName + '.');
                var ref = new Firebase("https://uverse-social.firebaseio.com/chat/rooms/" + roomName);
                $firebaseObject(ref).$loaded().then(function (room) {
                    this.room = room;
                    if (room.name === undefined) {
                        room.name = roomName;
                        room.messages = {};
                        room.users = {};
                        room.childRooms = {};
                        room.$save().then(function () {
                            this.messages = $firebaseArray(ref.child('messages'));
                            usersArray = $firebaseArray(ref.child('users'));
                            childRooms = $firebaseArray(ref.child('childRooms'));
                            deferred.resolve(this);
                        }, function (reason) {
                            deferred.reject('Failed new room: ' + roomName + " for reason: " + reason);
                        });
                    } else {
                        messages = $firebaseArray(ref.child('messages'));
                        usersArray = $firebaseArray(ref.child('users'));
                        childRooms = $firebaseArray(ref.child('childRooms'));
                        deferred.resolve(room);
                    }
                }, function (reason) {
                    deferred.reject('Failed getting existing room: ' + roomName + " for reason: " + reason);
                });
                return deferred.promise;
            };
            this.sendMessage = function (msg) {
                if (msg.substring(0, 1) === "/") {
                    if (msg.substring(0, 6) === "/video") {
                        msg = "";
                        return {video: msg.substring(7)};
                    }
                } else {
                    var d = new Date().toLocaleTimeString().replace(/:\d+ /, ' ');
                    var message = {message: msg, usericon: $users.user.icon, date: d, userid: $users.user.name};
                    $log.log('addMessage:' + message)

                    messages.$add(message).then(function (m) {
                        $log.log('addedMessage:' + m)
                        msg = "";
                    }, function (reason) {
                        $log.warn('Failed save new user: ' + u.name + " for reason: " + reason);
                    });
                }
            }
        })
        .service('$users', function ($q, $firebaseObject, $firebaseArray, $localStorage, $sessionStorage, $firebaseAuth) {
            this.$storage = $localStorage;
            var ref = new Firebase("https://uverse-social.firebaseio.com");
            ref.onAuth(authDataCallback);
            this.getUser = function () {
                var deferred = $q.defer();
                this.user = this.$storage.user;
                if (this.user === undefined) {
                    $firebaseAuth(ref).$authWithOAuthPopup('twitter').then(function (authData) {
                        deferred.resolve(init(authData));
                    });
                } else {
                    deferred.resolve(user);
                }

                return deferred.promise;
            }


            function authDataCallback(authData) {
                if (authData) {
                    console.log("User " + authData.uid + " is logged in with " + authData.provider);
                    init(authData);
                } else {
                    console.log("User is logged out");
                }
            }

            function init(authData) {
                this.user = {};
                this.user.name = authData.twitter.cachedUserProfile.name;
                this.user.icon = authData.twitter.cachedUserProfile.profile_image_url;
                console.log("Logged in as:", user);

                var ref = new Firebase('https://uverse-social.firebaseio.com/chat/users/' + this.user.name);
                $firebaseObject(ref).$loaded().then(function (u) {
                    if (u.name === undefined) {
                        u.name = this.user.name;
                        u.icon = this.user.icon;
                        u.$save().then(function (newuser) {
                            console.log("Saved new user: ", newuser);
                            console.dir(newuser);

                            $localStorage.user = this.user;
                        }, function (reason) {
                            console.log('Failed save new user: ' + u.name + " for reason: " + reason);
                        });
                    } else {
                        console.log("Existing user: ", user);
                        $localStorage.user = this.user;
                    }
                });
            }

            /*
             
             messages.$add(
             {message: authData.twitter.cachedUserProfile.name + ' has joined the chat', usericon: $scope.user.icon}
             );      
             if (!room.users)
             room.users = {};
             if (!room.users[$scope.user.name]) {
             room.users[$scope.user.name] = $scope.user;
             room.$save().then(function (reference) {
             console.dir(reference);
             });
             }
             
             
             $scope.addRoom = function () {
             var newroomname = $scope.currentRoom + '+' + this.roomName;
             var newroom = $firebaseObject(ref.parent().child(newroomname));
             newroom.name = newroomname;
             this.addingRoom = false;
             newroom.messages = {};
             newroom.users = {};
             newroom.childRooms = {};
             newroom.$save().then(function () {
             $scope.messages = $firebaseArray(ref.parent().child(newroomname).child('messages'));
             $scope.usersArray = $firebaseArray(ref.parent().child(newroomname).child('users'));
             $scope.childRooms = $firebaseArray(ref.parent().child(newroomname).child('childRooms'));
             });
             }
             */
        })
        .directive('chatist', function () {
            return {
                restrict: 'E',
                priority: -100,
                templateUrl: 'components/chat/message-list.html',
                scope: {
                    mgs: '='
                },
                controller: function ($scope) {
                    //console.log('nnnn');
                },
                link: function (scope, ele, attr) {
                }
            };
        });