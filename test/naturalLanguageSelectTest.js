/**
 * Created with IntelliJ IDEA.
 * User: Joe Linn
 * Date: 8/9/13
 * Time: 10:09 AM
 * To change this template use File | Settings | File Templates.
 */
describe('naturalLanguageSelect', function(){
    var elm, scope;

    //load the natural language select code
    beforeEach(module('jlinn.natural-language.select'));

    beforeEach(inject(function($rootScope, $compile){
        elm = angular.element(
            '<div>' +
                '<select natural-language-select ng-transclude="">' +
                    '<option value="1">any food</option>' +
                    '<option value="2" selected>Indian</option>' +
                    '<option value="3">French</option>' +
                    '<option value="4">Japanese</option>' +
                    '<option value="5">Italian</option>' +
                '</select>' +
            '</div>'
        );

        scope = $rootScope;
        $compile(elm)(scope);
        scope.$digest();
    }));

    it('should create a list of options and an overlay element', inject(function(){
        var options = elm.find('div ul').find('li');

        expect(options.length).toBe(5);
        expect(options.eq(0).text()).toBe('any food');
        expect(options.eq(1).text()).toBe('Indian');
        expect(options.eq(1)).toHaveClass('nl-dd-checked');
        expect(elm.children().eq(1)).toHaveClass('nl-overlay');
    }));

    it('should open when the link is clicked and close when an option is clicked', function(){
        var link = elm.find('div a');

        link.click();

        expect(elm.find('div')).toHaveClass('nl-field-open');

        var options = elm.find('div ul li');
        options.eq(1).click();
        expect(elm).not.toHaveClass('nl-field-open');

    });

    it('should select the proper option when clicked', function(){
        //open the select
        var link = elm.find('div a');
        link.click();

        //choose an option
        var options = elm.find('div ul li');
        options.eq(2).click();

        //ensure that the option has been checked
        expect(options.eq(2)).toHaveClass('nl-dd-checked');

        //ensure that the change has been reflected in the <select>
        var selectOptions = elm.find('div select option');
        expect(selectOptions.eq(2).attr('selected')).toBe('selected');
        expect(selectOptions.eq(1).attr('selected')).not.toBe('selected');
    });
});