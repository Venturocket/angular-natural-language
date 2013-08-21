angular.module('vr.directives.nlForm.text',[])
    .directive('nlText', function(){
        return {
            restrict: 'EA',
			replace: true,
			scope: {
				placeholder: '@',
				subline: '@',
				name: '@',
				value: '='
			},
            template:
                '<div ng-form class="nl-field nl-ti-text" ng-class="{\'nl-field-open\': opened}">' +
                    '<a class="nl-field-toggle" ng-click="open($event)" ng-bind="viewValue()"></a>' +
                    '<ul>' +
                        '<li class="nl-ti-input">' +
                            '<input type="text" placeholder="{{ placeholder }}" name="{{ name }}" ng-model="value" ng-click="$event.stopPropagation()" ng-required="required"/>' +
                            '<button class="nl-field-go" ng-click="close()">Go</button>' +
                        '</li>' +
                        '<li class="nl-ti-example" ng-show="showSubline()" ng-bind-html-unsafe="subline"></li>' +
                    '</ul>' +
                '</div>',
            controller: 'nlTextCtrl',
            link: function(scope, element, attributes){

				// is this input required?
				scope.required = !angular.isUndefined(attributes.required);

                var overlay = false;
				//look for an overlay element
				angular.forEach(element.parent().children(), function(child){
					child = angular.element(child);
					if(child.hasClass('nl-overlay')){
						overlay = child;
					}
				});
				if(!overlay){
					// no overlay exists so create one
					overlay = angular.element('<div class="nl-overlay"></div>');
					element.parent().append(overlay);
				}
				// close the input when the overlay is clicked
				overlay.bind('click',function() { scope.$apply(scope.close) });
            }
        };
    })
	.controller('nlTextCtrl',['$scope', function($scope){

		// is the input open
		$scope.opened = false;

		// open the input
		$scope.open = function(event){
			event.stopPropagation();
			$scope.opened = true;
		};

		// close the input
		$scope.close = function(){
			$scope.opened = false;
		};

		// if there is no value, show the placeholder instead
		$scope.viewValue = function(){
			if($scope.value == ''){
				return $scope.placeholder;
			}
			return $scope.value;
		};

		// do we have a subline? ok, then show it!
		$scope.showSubline = function() {
			return angular.isString($scope.subline) && $scope.subline != '';
		};

	}]);
