describe('Natural Language Text', function(){
    var elem, scope;

    var subline = "For example: <em>Los Angeles</em> or <em>New York</em>";

    //load the natural language text code
    beforeEach(module('vr.directives.nlForm.text'));

	describe('Directive', function() {

		beforeEach(inject(function($rootScope, $compile){
			elem = angular.element('<div><nl-text value="city" placeholder="any city" subline="{{ subline }}" name="city"></nl-text></div>');
			$rootScope.subline = subline;
			$rootScope.city = '';

			scope = $rootScope;
			$compile(elem)(scope);
			scope.$digest();
		}));

		it('should create the elements', inject(function(){

			expect(elem.find('div')).toHaveClass('nl-ti-text');

			expect(elem.find('.nl-ti-text a').length).toBe(1);

			expect(elem.find('ul .nl-ti-input input[type="text"]').length).toBe(1);
			expect(elem.find('ul .nl-ti-input input[type="text"]').prop('name')).toBe('city');

			expect(elem.find('ul .nl-ti-input button').length).toBe(1);
			expect(elem.find('ul .nl-ti-input button')).toHaveClass('nl-field-go');

			expect(elem.find('ul .nl-ti-example').length).toBe(1);
			expect(elem.find('ul .nl-ti-example').html()).toBe(subline);
			expect(elem.find('ul .nl-ti-example').css('diaplay')).not.toBe('none');

			expect(elem.find('.nl-overlay').length).toBe(1);
		}));

		it('should show the placeholder text', function() {
			expect(elem.find('.nl-ti-text a').text()).toBe('any city');
			expect(elem.find('input').val()).toBe('');
		});

		it('should show the correct value in the input and the view', function() {
			scope.$apply(function() { scope.city = 'blah'; });
			expect(elem.find('.nl-ti-text a').text()).toBe('blah');
			expect(elem.find('input').val()).toBe('blah');
		});

		it('should not show the subline', function() {
			scope.$apply(function() { scope.subline = ''; });
			expect(elem.find('ul .nl-ti-example').html()).toBe('');
			expect(elem.find('ul .nl-ti-example').css('display')).toBe('none');
		});

		describe('when clicked', function() {

			beforeEach(function() {
				elem.find('a').click();
			});

			it('should open', function() {
				expect(elem.find('.nl-ti-text')).toHaveClass('nl-field-open');
			});

			it('should close when the button is clicked', function() {
				elem.find('button').click();   //close the input
				expect(elem.find('.nl-ti-text')).not.toHaveClass('nl-field-open');
			});

			it('should close when the overlay is clicked', function() {
				elem.find('.nl-overlay').click();   //close the input
				expect(elem.find('.nl-ti-text')).not.toHaveClass('nl-field-open');
			});

		});

	});

	describe('Controller', function() {

		beforeEach(inject(function($rootScope, $controller) {
			scope = $rootScope.$new();
			scope.value = '';
			scope.placeholder = 'anything';
			scope.name = 'blah';
			scope.subline = subline;
			ctrl = $controller('nlTextCtrl', { $scope: scope });
			scope.$digest();
		}));

		it('should not be opened', function() {
			expect(scope.opened).toBeFalsy();
		});

		it('should show the placeholder', function() {
			expect(scope.viewValue()).toBe('anything');
		});

		it('when the value is updated should show the new value in the view', function() {
			scope.$apply(function() { scope.value = 'woot'; });
			expect(scope.viewValue()).toBe('woot');
		});

		describe('when opened', function() {

			beforeEach(function() {
				scope.$apply(function() { scope.open({ stopPropagation: function() {} }); });
			});

			it('should actually be opened', function() {
				expect(scope.opened).toBeTruthy();
			});

			it('then closed should be closed', function() {
				scope.$apply(scope.close);
				expect(scope.opened).toBeFalsy();
			});

		})

	})
});
