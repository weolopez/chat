angular.module('directive.user', ['firebase', 'ngStorage'])
        .service('$users', function ($q, $firebaseObject, $firebaseArray, $localStorage, $sessionStorage, $firebaseAuth) {
            var users = this;
            users.$storage = $localStorage;
            var ref = new Firebase("https://uverse-social.firebaseio.com");
            ref.onAuth(authDataCallback);

            users.getUser = function () {
                var deferred = $q.defer();
                users.user = users.$storage.user;
                if (users.user === undefined) {
                    $firebaseAuth(ref).$authWithOAuthPopup('twitter').then(function (authData) {
                        deferred.resolve(init(authData));
                    });
                } else {
                    deferred.resolve(users.user);
                }

                return deferred.promise;
            }



            function authDataCallback(authData) {
                if (authData) {
                    console.log("User " + authData.twitter.cachedUserProfile.name + " is logged in with " + authData.provider);
                    init(authData);
                } else {
                    console.log("User is logged out");
                }
            }

            function init(authData) {
                users.user = {};
                users.user.name = authData.twitter.cachedUserProfile.name;
                users.user.icon = authData.twitter.cachedUserProfile.profile_image_url;
                console.log("Logged in as:", users.user);

                var ref = new Firebase('https://uverse-social.firebaseio.com/chat/users/' + users.user.name);
                $firebaseObject(ref).$loaded().then(function (u) {
                    if (u.name === undefined) {
                        u.name = users.user.name;
                        u.icon = users.user.icon;
                        u.$save().then(function (newuser) {
                            console.log("Saved new user: ", newuser);
                            console.dir(newuser);

                            $localStorage.user = users.user;
                        }, function (reason) {
                            console.log('Failed save new user: ' + u.name + " for reason: " + reason);
                        });
                    } else {
                        console.log("Existing user: ", u);
                        users.user = u;
                        $localStorage.user = users.user;
                    }
                });
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
                    $log.debug("UserDirective User: "+user)
                },
                link: function (scope, ele, attr) {
                }
            };
        })
        
        ;