'use strict';

angular.module('jlinn.natural-language', ['jlinn.natural-language.select', 'jlinn.natural-language.text']);

angular.module('jlinn.natural-language.select', [])
    .directive('naturalLanguageSelect', [function(){
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            template:
                '<div class="nl-field nl-dd" ng-class="{\'nl-field-open\': opened}">' +
                    '<a class="nl-field-toggle" ng-click="open($event)">{{ selected }}</a>' +
                    '<ul>' +
                        '<li ng-repeat="option in options" ng-class="{\'nl-dd-checked\': selected == option.name}" ng-click="select(option.name)">{{ option.name }}</li>' +
                    '</ul>' +
                    '<select style="display: none;">' +
                        '<option ng-repeat="option in options" value="{{ option.value }}" ng-selected="selected == option.name" >{{ option.name }}</option> ' +
                    '</select>' +
                '</div>',
            controller: ['$scope', '$element', function($scope, $element){
                $scope.opened = false;

                $element.parent().bind('click', function(){ $scope.$apply($scope.close) });

                $scope.open = function(event){
                    event.stopPropagation();
                    $scope.opened = true;
                };

                $scope.close = function(){
                    $scope.opened = false;
                };

                $scope.select = function(option){
                    $scope.selected = option;
                    $scope.close();
                };
            }],
            scope: {
                option: '='
            },
            link: function(scope, element){
                //add the overlay element if we don't already have one
                var overlayed = false;
                angular.forEach(element.parent().children(), function(child){
                    child = angular.element(child);
                    if(child.hasClass('nl-overlay')){
                        overlayed = true;
                        scope.overlay = overlayed;
                    }
                });
                if(!overlayed){
                    scope.overlay = angular.element('<div class="nl-overlay"></div>');
                    element.parent().append(scope.overlay);
                }

                scope.options = [];
                scope.selected = '';
                element = angular.element(element);
                angular.forEach(element.find('option'), function(option){
                    option = angular.element(option);
                    scope.options.push({name: option.text(), value: option.attr('value')});
                    if(option.attr('selected')){
                        scope.selected = option.text();
                    }
                });
            }
        };
    }]);

angular.module('jlinn.natural-language.text', [])
    .directive('naturalLanguageText', function(){
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            scope: {
                placeholder: '@',
                subline: '@',
                name: '@',
                value: '@'
            },
            template:
                '<div class="nl-field nl-ti-text" ng-class="{\'nl-field-open\': opened}">' +
                    '<a class="nl-field-toggle" ng-click="open($event)" ng-bind="choose(placeholder, value)"></a>' +
                    '<ul>' +
                        '<li class="nl-ti-input">' +
                            '<input type="text" placeholder="{{ placeholder }}" name="{{ name }}" value="{{ value }}" ng-click="$event.stopPropagation()" ng-model="value"/>' +
                            '<button class="nl-field-go">Go</button>' +
                        '</li>' +
                        '<li class="nl-ti-example" ng-bind-html-unsafe="subline"></li>' +
                    '</ul>' +
                '</div>',
            controller: ['$scope', '$element', function($scope, $element){
                $scope.opened = false;

                $element.parent().bind('click', function(){ $scope.$apply($scope.close) });

                $scope.open = function(event){
                    event.stopPropagation();
                    $scope.opened = true;
                };

                $scope.close = function(){
                    $scope.opened = false;
                };

                $scope.select = function(option){
                    $scope.selected = option;
                    $scope.close();
                };

                $scope.choose = function(placeholder, value){
                    if(value == ''){
                        return placeholder;
                    }
                    return value;
                };
            }],
            link: function(scope, element){
                //add the overlay element if we don't already have one
                var overlayed = false;
                angular.forEach(element.parent().children(), function(child){
                    child = angular.element(child);
                    if(child.hasClass('nl-overlay')){
                        overlayed = true;
                        scope.overlay = overlayed;
                    }
                });
                if(!overlayed){
                    scope.overlay = angular.element('<div class="nl-overlay"></div>');
                    element.parent().append(scope.overlay);
                }
            }
        };
    });