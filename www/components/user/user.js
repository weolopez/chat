angular.module('directive.user', ['firebase', 'ngStorage'])
        .service('$users', function ($log, $q, $firebaseObject, $firebaseArray, $localStorage, $sessionStorage, $firebaseAuth) {
            var users = this;
            users.$storage = $localStorage;
            users.usersRef = new Firebase('https://uverse-social.firebaseio.com');
            users.usersRef.onAuth(authDataCallback);
            var connectedRef = new Firebase('https://uverse-social.firebaseio.com/.info/connected');

            connectedRef.on('value', function (snap) {
                if ((snap.val() === true) && (users.userConnectionsRef !== undefined)) {
                    var con = users.userConnectionsRef.push(true);
                    con.onDisconnect().remove();
                    // con.onDisconnect().set("I disconnected!");
                    users.userLastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
                    
                    
                    var roomConn = users.roomConnectionsRef.push(true);
                    roomConn.onDisconnect().remove();
                    // con.onDisconnect().set("I disconnected!");
                    users.roomLastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
                }
            });

            users.getUser = function () {
                var deferred = $q.defer();
                this.user = this.$storage.user;
                if (users.user === undefined) {
                    if (this.usersRef === undefined) {
                        alert('Users undefined');
                        return;
                    }
                    $firebaseAuth(this.usersRef).$authWithOAuthPopup('twitter').then(function (authData) {
                        $log.debug('Initiallizing User');
                        deferred.resolve(init(authData));
                    }), function (reason) {
                        $log.debug('Failed $authWithOAuthPopup: ' + reason);
                        deferred.reject(reason);
                    };
                } else {
                    deferred.resolve(users.user);
                }

                return deferred.promise;
            }

            users.setRoom = function(roomRefString) {
                users.roomConnectionsRef = new Firebase(roomRefString+ users.user.name + '/connections');
                users.roomLastOnlineRef = new Firebase(roomRefString+ users.user.name + '/lastOnline');
            }

            function authDataCallback(authData) {
                if (authData) {
                    $log.debug('User ' + authData.twitter.cachedUserProfile.name + ' is logged in with ' + authData.provider);
                    init(authData);
                } else {
                    $log.debug('User is logged out');
                }
            }

            function init(authData) {
                users.user = {};
                users.user.name = authData.twitter.cachedUserProfile.name;
                users.user.icon = authData.twitter.cachedUserProfile.profile_image_url;

                $log.debug('Logged in as:', users.user);
                var userConnectionString = 'https://uverse-social.firebaseio.com/chat/users/' + users.user.name;
                users.userConnectionsRef = new Firebase(userConnectionString + '/connections');
                users.userLastOnlineRef = new Firebase(userConnectionString + '/lastOnline');
                users.userRef = new Firebase(userConnectionString);

                $firebaseObject(users.userRef).$loaded().then(function (u) {
                    if (u.name === undefined) {
                        u.name = users.user.name;
                        u.icon = users.user.icon;

                        u.$save().then(function (newuser) {
                            $log.debug('Saved new user: ', newuser);
                            $log.debug(newuser);
                            users.userConnectionsRef = new Firebase(userConnectionString + '/connections');
                            users.userLastOnlineRef = new Firebase(userConnectionString + '/lastOnline');

                            $localStorage.user = users.user;
                        }, function (reason) {
                            $log.debug('Failed save new user: ' + u.name + ' for reason: ' + reason);
                        });
                    } else {
                        $log.debug('Existing user: ', u);
                        users.user = u;
                        $localStorage.user = users.user;
                        users.userConnectionsRef = new Firebase(userConnectionString + '/connections');
                        users.userLastOnlineRef = new Firebase(userConnectionString + '/lastOnline');
                    }
                }), function (reason) {
                    alert('Failed load: ' + reason);
                };
            }
        })
        .directive('user-icon', function () {
            return {
                restrict: 'E',
                priority: -100,
                templateUrl: 'components/user/user.html',
                scope: {
                    user: '='
                },
                controller: function ($scope, user, $log) {
                    $log.debug('UserDirective User: ' + user)
                },
                link: function (scope, ele, attr) {
                }
            };
        })

        ;