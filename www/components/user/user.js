angular.module('directive.user', ['firebase', 'ngStorage'])
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
                        this.user = u;
                        $localStorage.user = this.user;
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