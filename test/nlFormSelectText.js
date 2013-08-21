describe('Natural Language Select', function(){
    var elem, rootscope, scope, ctrl;

    //load the natural language select code
    beforeEach(module('vr.directives.nlForm.select'));

	describe('Directive',function() {
		beforeEach(inject(function($rootScope){
			rootscope = $rootScope;
		}));

		describe('with a simple array', function() {

			beforeEach(inject(function($compile) {
				rootscope.options = ['one','two','three'];
				rootscope.value = 'one';
				elem = $compile("<div><nl-select options='options' value='value'></nl-select></div>")(rootscope);
				rootscope.$digest();
			}));

			it('should create a list of options and an overlay element', function(){
				var options = elem.find('li');
				expect(options.length).toBe(3);
				expect(options.eq(0).text()).toBe('one');
				expect(options.eq(1).text()).toBe('two');
				expect(options.eq(2).text()).toBe('three');
				expect(options.eq(0)).toHaveClass('nl-dd-checked');

				var link = elem.find('a');
				expect(link.length).toBe(1);
				expect(link.text()).toBe('one');

				expect(elem.children().eq(1)).toHaveClass('nl-overlay');
			});

		});

		describe('with an array of objects', function() {

			beforeEach(inject(function($compile) {
				rootscope.options = [{ label: 'one', value: 'ten' }, { label: 'two', value: 'nine' }, { label: 'three', value: 'eight' }];
				rootscope.value = 'nine';
				elem = $($compile("<div><nl-select options='options' value='value'></nl-select></div>")(rootscope));
				rootscope.$digest();
			}));

			it('should create a list of options and an overlay element', function(){
				var options = elem.find('li');
				expect(options.length).toBe(3);
				expect(options.eq(0).text()).toBe('one');
				expect(options.eq(1).text()).toBe('two');
				expect(options.eq(2).text()).toBe('three');
				expect(options.eq(1)).toHaveClass('nl-dd-checked');

				expect(elem.children().eq(1)).toHaveClass('nl-overlay');
			});

		});

		describe('with an object of values', function() {

			beforeEach(inject(function($compile) {
				rootscope.options = { 'one': 'ten' , 'two': 'nine' , 'three': 'eight' };
				rootscope.value = 'eight';
				elem = $($compile("<div><nl-select options='options' value='value'></nl-select></div>")(rootscope));
				rootscope.$digest();
			}));

			it('should create a list of options and an overlay element', function(){
				var options = elem.find('li');
				expect(options.length).toBe(3);
				expect(options.eq(0).text()).toBe('one');
				expect(options.eq(1).text()).toBe('two');
				expect(options.eq(2).text()).toBe('three');
				expect(options.eq(2)).toHaveClass('nl-dd-checked');

				expect(elem.children().eq(1)).toHaveClass('nl-overlay');
			});

		});

		describe('with an object of objects', function() {

			beforeEach(inject(function($compile) {
				rootscope.options = { 'one':{ label: 'one', value: 'ten' }, 'two':{ label: 'two', value: 'nine' }, 'three':{ label: 'three', value: 'eight' }};
				rootscope.value = 'ten';
				elem = $($compile("<div><nl-select options='options' value='value'></nl-select></div>")(rootscope));
				rootscope.$digest();
			}));

			it('should create a list of options and an overlay element', function(){
				var options = elem.find('li');
				expect(options.length).toBe(3);
				expect(options.eq(0).text()).toBe('one');
				expect(options.eq(1).text()).toBe('two');
				expect(options.eq(2).text()).toBe('three');
				expect(options.eq(0)).toHaveClass('nl-dd-checked');

				expect(elem.children().eq(1)).toHaveClass('nl-overlay');
			});

		});

		describe('when clicked', function() {

			beforeEach(inject(function($compile) {
				rootscope.options = { 'one': 'ten' , 'two': 'nine' , 'three': 'eight' };
				rootscope.value = 'eight';
				elem = $($compile("<div><nl-select options='options' value='value'></nl-select></div>")(rootscope));
				rootscope.$digest();
				elem.find('a').click();
			}));

			it('should open the select', function() {
				expect(elem.find('div')).toHaveClass('nl-field-open');
			});

			it('should close when the overlay is clicked', function() {
				elem.find('.nl-overlay').click();
				expect(elem.find('div')).not.toHaveClass('nl-field-open');
			});

			describe('and an option is selected', function() {

				beforeEach(function() {
					elem.find('li').eq(1).click();
				});

				it('should close', function() {

				})

			});

		});
	});

	describe('Controller', function() {

		beforeEach(inject(function($rootScope, $controller) {
			rootscope = $rootScope;
			scope = rootscope.$new();
			scope.options = {'one':'ten','two':'nine','three':'eight'};
			scope.value = 'ten';
			scope.multiple = false;
			scope.conjunction = 'and';
			scope.none = 'none';
			scope.required = false;
			scope.nlSelect = {
				$setValidity: jasmine.createSpy('setValidity')
			};
			ctrl = $controller('nlSelectCtrl', { $scope: scope });
			scope.$digest();
		}));

		it('should get the labels', function() {
			expect(scope.getLabels()).toEqual(['one','two','three']);
		});

		it('should get the selected text', function() {
			expect(scope.getSelected()).toBe('one');
		});

		it('should say one is selected', function() {
			expect(scope.isSelected('one')).toBeTruthy();
		});

		it('should say two is not selected', function() {
			expect(scope.isSelected('two')).toBeFalsy();
		});

		it('should set opened to true', function() {
			expect(scope.opened).toBeFalsy();
			scope.open({ stopPropagation: function() {} });
			expect(scope.opened).toBeTruthy();
		});

		it('should set opened to false', function() {
			scope.open({ stopPropagation: function() {} });
			scope.close();
			expect(scope.opened).toBeFalsy();
		});

		it('should set the value to two', function() {
			scope.setValue('two');
			expect(scope.value).toBe('nine');
		});

		it('should add an option to the list and keep the value the same', function() {
			scope.$apply(function() { scope.options.four = {'one':'ten','two':'nine','three':'eight','four':'seven'}; });
			expect(scope.getLabels().length).toBe(4);
			expect(scope.value).toBe('ten');
		});

		it('should remove an option from the list and keep the value the same', function() {
			scope.$apply(function() { scope.options = {'one':'ten','two':'nine'}; });
			expect(scope.getLabels().length).toBe(2);
			expect(scope.value).toEqual('ten');
		});

		it('should remove an option from the list and change the value to the first option', function() {
			scope.$apply(function() { scope.options = {'two':'nine','three':'eight'}; });
			expect(scope.value).toEqual('nine');
		});

		describe('when multiple selections allowed', function() {

			beforeEach(function() {
				scope.$apply(function() {
					scope.multiple = true;
					scope.value = [scope.value];
				});
			});

			it('should have one option selected', function() {
				expect(scope.value.length).toBe(1);
			});

			it('should get the selected text for only one option', function() {
				expect(scope.getSelected()).toBe('one');
			});

			describe('and at least one is required',function() {

				beforeEach(function() {
					scope.$apply(function() { scope.required = true; });
					scope.setValue('one');
				});

				it('should become invalid', function() {
					expect(scope.nlSelect.$setValidity).toHaveBeenCalledWith('required',false);
				});

				it('should become valid again', function() {
					scope.setValue('two');
					expect(scope.nlSelect.$setValidity).toHaveBeenCalledWith('required',true);
				});

			});

			describe('and multiple options are selected', function() {

				beforeEach(function() {
					scope.setValue('two');
				});

				it('should have two options selected', function() {
					expect(scope.value.length).toBe(2);
					expect(scope.value).toEqual(['ten','nine']);
				});

				it('should get the selected text for both options', function() {
					expect(scope.getSelected()).toBe('one and two');
				});

				it('should say both options are selected', function() {
					expect(scope.isSelected('one')).toBeTruthy();
					expect(scope.isSelected('two')).toBeTruthy();
				});

				it('then one is deselected should have only one option selected', function() {
					scope.setValue('one');
					expect(scope.value.length).toBe(1);
					expect(scope.value).toEqual(['nine']);
					expect(scope.isSelected('one')).toBeFalsy();
				});

				it('then the options list is changed should have only one option selected', function() {
					scope.$apply(function() { scope.options = {'two':'nine','three':'eight'}; });
					expect(scope.value.length).toBe(1);
					expect(scope.value).toEqual(['nine']);
				});

			});

		});

	});

});
