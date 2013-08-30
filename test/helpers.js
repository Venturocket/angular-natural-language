/**
 * Created with IntelliJ IDEA.
 * User: Joe Linn
 * Date: 8/9/13
 * Time: 12:12 PM
 * To change this template use File | Settings | File Templates.
 */
beforeEach(function(){
    this.addMatchers({
        toHaveClass: function(cls){
            this.message = function(){
                return "Expected '" + angular.mock.dump(this.actual) + "'"+(this.isNot?" not":"")+" to have class '" + cls + "'.";
            };
            return this.actual.hasClass(cls);
        }
    });

    /**
     * Determine the length of the given associative JS object
     * @param obj a javascript object
     * @returns int
     */
    Object.size = function(obj){
        var size = 0;
        var key;
        for(key in obj){
            if(obj.hasOwnProperty(key)){
                size++;
            }
        }
        return size;
    };
});
