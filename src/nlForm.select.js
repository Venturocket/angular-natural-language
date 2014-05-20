angular.module('vr.directives.nlForm.select',[])
    .directive('nlSelect', function(){
        return {
            restrict: 'EA',
			replace: true,
			scope: {
				value: '=',
				options: '='
			},
            controller: 'nlSelectCtrl',
			template:
				"<div ng-form='nlSelect' class='nl-field nl-dd' ng-class=\"{'nl-field-open': opened}\">" +
					"<a class='nl-field-toggle' ng-click='open($event)' ng-bind='getSelected()'></a>" +
					"<ul>" +
                        "<li ng-show='allOptions && multiple && !isAllSelected()' ng-bind='allOptions' ng-click='selectAll()'></li>" +
						"<li ng-repeat='label in getLabels()' ng-class=\"{'nl-dd-checked': isSelected(label)}\" ng-click='select(label)' ng-bind='label'></li>" +
                        "<li ng-show='multiple && !isNoneSelected()' ng-bind='none' ng-click='selectNone()'></li> " +
					"</ul>" +
				"</div>",
			link: function(scope, element, attributes){

				// is this required
				scope.required = !angular.isUndefined(attributes.required);

				// allow multiple options to be selected
				scope.multiple = !angular.isUndefined(attributes.multiple);
				// text for the view when multiple options are selected
				scope.conjunction = scope.multiple && attributes.multiple != ''?attributes.multiple:'and';
				// text for the view when no options are selected
				scope.none = !angular.isUndefined(attributes.none)?attributes.none:'none';

                // an option which is the equivalent of "select all" (multiple only)
                scope.allOptions = !angular.isUndefined(attributes.all) ? attributes.all : false;

				// convert the value to an array if this is a multi-select
                if(scope.multiple && angular.isUndefined(scope.value)){
                    scope.value = [];
                }
				if(scope.multiple && !angular.isArray(scope.value)) {
					scope.value = [scope.value];
				}

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
				// close the select when the overlay is clicked
				overlay.bind('click',function() { scope.$apply(scope.close); });

			}
        };
    })
	.controller('nlSelectCtrl',['$scope', function($scope){

		// option list type constants
		var ARRAY_OF_LABELS = 1;		// e.g. [ 'one', 'two', 'three', ...]
		var ARRAY_OF_OBJECTS = 2;		// e.g. [ { label: 'one', value: 'ten'}, { label: 'two', value: 'nine'}, ...]
		var OBJECT_OF_VALUES = 3;		// e.g. { 'one':'ten', 'two':'nine', 'three':'eight', ...}
		var OBJECT_OF_OBJECTS = 4;	// e.g. { 'one':{ label: 'one', value: 'ten'}, 'two':{ label: 'two', value: 'nine' }, ...}

		// is the select open
		$scope.opened = false;

		// is the value in the list of options
		function isOption(value) {
			var found = false;
			angular.forEach($scope.options,function(opt) {
				switch($scope.optionType) {
					case ARRAY_OF_LABELS:
					case OBJECT_OF_VALUES:
						if(value == opt) {
							found = true;
						}
						break;
					case ARRAY_OF_OBJECTS:
					case OBJECT_OF_OBJECTS:
						if(value == opt.value) {
							found = true;
						}
						break;
				}
			});
			return found;
		}

		function optionsLength() {
			switch($scope.optionType) {
				case ARRAY_OF_LABELS:
				case ARRAY_OF_OBJECTS:
					return $scope.options.length;
				case OBJECT_OF_OBJECTS:
				case OBJECT_OF_VALUES:
					var ctr = 0;
					angular.forEach($scope.options, function() { ctr++; });
					return ctr;
			}
			return 0;
		}

		// get the option at the given index, normalized as an object: { value: 'value', label: 'label' }
		function getOption(index) {
			if(index < optionsLength() && index >= 0) {
				switch($scope.optionType) {
					case ARRAY_OF_LABELS:
						// the label and value are the same
						return { value: $scope.options[0], label: $scope.options[0] };
					case ARRAY_OF_OBJECTS:
						// already normalized
						return $scope.options[0];
					case OBJECT_OF_VALUES:
					case OBJECT_OF_OBJECTS:
						// iterate through the options to find the index
						var option = null;
						var ctr = 0;
						angular.forEach($scope.options,function(value, label) {
							if(ctr == index) {
								if($scope.optionType == OBJECT_OF_VALUES) {
									option = { value: value, label: label };
								} else {
									option = value;
								}
							}
							ctr++;
						});
						return option;
				}
			}
			return { value: '', label: ''};
        }

        // get the label from the given value
		function getLabel(value) {
			var label = value;
			switch($scope.optionType) {
				case ARRAY_OF_OBJECTS:
				case OBJECT_OF_OBJECTS:
					// find the option with the given value and get its value
					angular.forEach($scope.options, function(opt) {
						if(opt.value == value) {
							label = opt.label;
						}
					});
					break;
				case ARRAY_OF_LABELS:
					// the label is the value so don't do anything
					break;
				case OBJECT_OF_VALUES:
					// find the option with the given value and get the index (the label)
					angular.forEach($scope.options, function(opt, index) {
						if(value == opt) {
							label = index;
						}
					});
					break;
			}
			return label;
        }

        // get the value given the label
		function getValue(label) {
			var value = label;

			switch($scope.optionType) {
				case ARRAY_OF_LABELS:
					// the value is the label so don't do anything
					break;
				case ARRAY_OF_OBJECTS:
					// find the option with the given label and get its value
					angular.forEach($scope.options,function(opt) {
						if(opt.label == label) {
							value = opt.value;
						}
					});
					break;
				case OBJECT_OF_VALUES:
					// simple index retrieval
					value = $scope.options[label];
					break;
				case OBJECT_OF_OBJECTS:
					// simple index retrieval
					value = $scope.options[label].value;
					break;
			}

			return value;
        }

		// given an option (label, object, value, etc) retrieve its label
		function getLabelFromOption(option) {
			var label = option;

			switch($scope.optionType) {
				case ARRAY_OF_LABELS:
					// the option is the value so don't do anything
					break;
				case OBJECT_OF_VALUES:
					angular.forEach($scope.options,function(val, lbl) {
						if(option == val) {
							label = lbl;
						}
					});
					break;
				case ARRAY_OF_OBJECTS:
					// find the option with the given label
					angular.forEach($scope.options,function(opt) {
						if(opt.value == option.value) {
							label = opt.label;
						}
					});
					break;
				case OBJECT_OF_OBJECTS:
					angular.forEach($scope.options,function(val, lbl) {
						if(option == val) {
							label = lbl;
						}
					});
					break;
			}

			return label;
        }
		
        // check to make sure all the values are in the list of options
		function checkValue() {
			if($scope.multiple) {
				var values = [];
				angular.forEach($scope.value, function(value) {
					if(isOption(value)) {
						values.push(value);
					}
				});
				$scope.value = values;
			} else {
				if(!isOption($scope.value)) {
					$scope.value = getOption(0).value;
				}
			}
        }

        // open the select
		$scope.open = function(event){
			event.stopPropagation();
			$scope.opened = true;
		};

		// close the select
		$scope.close = function(){
			$scope.opened = false;
		};

		// select an option
		$scope.select = function(option) {
			$scope.setValue(option);
			$scope.close();
		};

        /**
         * select all options
         */
        $scope.selectAll = function(){
            angular.forEach($scope.options, function(option){
				var label = getLabelFromOption(option);
                if(!$scope.isSelected(label)){
                    $scope.select(label);
                }
                $scope.close();
            });
        };

        /**
         * unselect all options
         */
        $scope.selectNone = function(){
            angular.forEach($scope.options, function(option){
				var label = getLabelFromOption(option);
                if($scope.isSelected(label)){
                    $scope.select(label);
                }
                $scope.close();
            });
        };

        /**
         * Returns true if all possible options have been selected; false otherwise.
         * @returns {boolean}
         */
        $scope.isAllSelected = function(){
            return !angular.isUndefined($scope.value) && $scope.value.length == optionsLength();
        };

        /**
         * Returns true if no options are selected; false otherwise.
         * @returns {boolean}
         */
        $scope.isNoneSelected = function(){
            return angular.isUndefined($scope.value) || $scope.value.length == 0;
        };

		// set the value, or add it to the list if this is a multi-select
		$scope.setValue = function(option) {
			var value = getValue(option);
			if($scope.multiple) {
				var index = $scope.value.indexOf(value);
				if(index == -1) {
					$scope.value.push(value);
				} else {
					$scope.value.splice(index,1);
				}
				if($scope.required) {
					// at least one option must be selected
					if($scope.value.length == 0) {
						// no options selected so it's invalid
						$scope.nlSelect.$setValidity('required',false);
					} else {
						// we're good here
						$scope.nlSelect.$setValidity('required',true);
					}
				}
			} else {
				$scope.value = value;
			}
		};

		// extract just the labels from the options
		$scope.getLabels = function() {
			switch($scope.optionType) {
				case ARRAY_OF_LABELS:
					// don't need to do anything
					return $scope.options;
				case ARRAY_OF_OBJECTS:
					// map the array to pull out the label
					return $scope.options.map(function(opt) {
						return opt.label;
					});
				case OBJECT_OF_VALUES:
				case OBJECT_OF_OBJECTS:
					// iterate through the options to get the labels
					var options = [];
					angular.forEach($scope.options,function(value, label) {
						if($scope.optionType == OBJECT_OF_VALUES) {
							options.push(label);
						} else {
							options.push(value.label);
						}
					});
					return options;
			}
			return [];
		};

		// concatenate the current selections for the view
		$scope.getSelected = function() {
			if($scope.multiple) {
				// there might be multiple selections
				var text = '';
				if(!angular.isUndefined($scope.value) && $scope.value.length > 0) {
					// there is at least one selection
                    if($scope.allOptions && $scope.value.length == optionsLength()){
                        //all options have been selected, and the 'all' parameter has been set
                        text = $scope.allOptions;
                    }
                    else{
                        var comma = '';
                        var ctr = 1;
                        angular.forEach($scope.value, function(value) {
                            text += comma+getLabel(value);
                            ctr++;
                            if($scope.value.length > 2){
                                comma = ', ';
                            } else {
                                comma = ' ';
                            }
                            if(ctr == $scope.value.length) {
                                comma += $scope.conjunction+' ';
                            }
                        })
                    }
				} else {
					// no selections
					text = $scope.none;
				}
				return text;
			} else {
				// only one selection possible
				return getLabel($scope.value);
			}
		};

		// check if the option is selected
		$scope.isSelected = function(option) {
            if(angular.isUndefined($scope.value)){
                return false;
            }
			if($scope.multiple) {
				return $scope.value.indexOf(getValue(option)) > -1;
			} else {
				return $scope.value == getValue(option);
			}
		};

		// make sure we update the options internally if they change externally
		$scope.$watch('options',function() {

			// reset option list type
			$scope.optionType = null;
			if(angular.isArray($scope.options)) {
				// option list is an array
				if(angular.isObject($scope.options[0])) {
					// of objects
					$scope.optionType = ARRAY_OF_OBJECTS;
				} else {
					// of labels
					$scope.optionType = ARRAY_OF_LABELS;
				}
			} else if(angular.isObject($scope.options)) {
				// option list is an object
				for(var key in $scope.options) {
					if($scope.options.hasOwnProperty(key)) {
						if(angular.isObject($scope.options[key])) {
							// of objects
							$scope.optionType = OBJECT_OF_OBJECTS;
						} else {
							// of key:value pairs
							$scope.optionType = OBJECT_OF_VALUES;
						}
						break;
					}
				}
			}

			// make sure the value is still in the list of options
			checkValue();

		},true);

	}]);
