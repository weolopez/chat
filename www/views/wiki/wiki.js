/* 
 */
'use strict';

angular.module('wiki', [
	'ngStorage',
	'ngResource'
])
	.factory('$wiki', function ($http, $localStorage) {
		var nouns = [];
		var observerCallbacks = [];

		if ($localStorage.nouns !== undefined) {
			nouns = $localStorage.nouns;
		}
		else {
			$http.get('https://api.github.com/repos/weolopez/Recursive/contents/views/wiki/pages').then(function (msg) {
				var content = msg.data;
				angular.forEach(content, function (value) {
					var suffix = '.html';
					var lastIndex = value.name.length - suffix.length;
					if (value.name.indexOf(suffix, lastIndex) > -1) {
						nouns.push(value.name.substring(0, lastIndex));
					}
				});
				$localStorage.nouns = nouns;
				notifyObservers();
			});
		}
		//call this when you know 'foo' has been changed
		var notifyObservers = function () {
			angular.forEach(observerCallbacks, function (callback) {
				callback();
			});
		};

		return {
			'nouns': nouns,
			'registerObserverCallback': function (callback) {
				observerCallbacks.push(callback);
			}
		};
	})
	.directive('wiki', function () {
		return {
			restrict: 'A',
			scope: {},
			controller: function ($scope, $element, $timeout, $wiki, $localStorage) {

				$scope.storage = $localStorage;

				function wikifyString(data) {
					var newMsg = '';
					var res = data.split(" ");
					angular.forEach(res, function (value) {
						angular.forEach($wiki.nouns, function (item) {
							//console.dir(item);
							if (item === value) {
								value = '<a href="#/wiki/' + item + '">' + item + '</a>';
								return false;
							}
						});
						newMsg += value + " ";
					});
					return newMsg;
				}
				function updateHTML() {
					$timeout(function () {
						var value = $element.html();
						value = wikifyString(value);
						$element.html(value);
					});
				}
				$wiki.registerObserverCallback(updateHTML);
				if ($wiki.nouns.length > 0)
					updateHTML();
			},
			replace: true,
			link: function (scope, element, attrs) {
			}
		};
	});