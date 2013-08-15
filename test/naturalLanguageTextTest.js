/**
 * Created with IntelliJ IDEA.
 * User: Joe Linn
 * Date: 8/9/13
 * Time: 2:25 PM
 * To change this template use File | Settings | File Templates.
 */
describe('naturalLanguageText', function(){
    var elm, scope;

    var inputName = 'testInput';
    var subline = "For example: <em>Los Angeles</em> or <em>New York</em>";

    //load the natural language text code
    beforeEach(module('jlinn.natural-language.text'));

    beforeEach(inject(function($rootScope, $compile){
        elm = angular.element(
            '<div>' +
                '<input natural-language-text="" type="text" value="" placeholder="any city" subline="{{ subline }}" name="{{ inputName }}"/>' +
            '</div>'
        );
        $rootScope.inputName = inputName;
        $rootScope.subline = subline;

        scope = $rootScope;
        $compile(elm)(scope);
        scope.$digest();
    }));

    it('should create elements based on the original <input/>', inject(function(){
        var container = elm.find('.nl-ti-text');
        var a = container.find('a');

        expect(a.length).toBe(1);

        var input = container.find('ul .nl-ti-input input[type="text"]');
        expect(input.attr('name')).toBe(inputName);

        expect(container.find('ul .nl-ti-input button')).toHaveClass('nl-field-go');

        expect(container.find('ul .nl-ti-example').html()).toBe(subline);
    }));

    it('should open and close properly', inject(function(){
        var container = elm.find('.nl-ti-text');
        var a = container.find('a');

        a.click();

        expect(container).toHaveClass('nl-field-open');

        container.find('button').click();   //close the input

        expect(container).not.toHaveClass('nl-field-open');
    }));

    it('should reflect the value entered in the input in the anchor', inject(function(){
        var container = elm.find('.nl-ti-text');

        container.find('a').click();
        //input('value').enter('test');
        console.log(container.find('input').val());
        container.find('button').click();

        //expect(container.find('a').html()).toBe('test');
    }));
});