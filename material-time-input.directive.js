(function() {

'use strict';

angular.module('SherlockedCustomDirective', [])
    .directive('materialTimeInput', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                if(attrs['ngTrim'] !== 'false'){
                    throw new Error('Missing ng-trim="false" in input element');
                    return;
                }

                var lastVal;

                modelCtrl.$parsers.unshift(validate);
                modelCtrl.$formatters.unshift(validate);

                function validate(inputValue) {
                    if(!inputValue){
                        return null;
                    }

                    //in case delete char, should have flag to skip auto add colon ":"
                    var isInputHave2Digit = inputValue.length === 2;

                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    var isValid = {
                        0:true,1:true,2:true
                    }

                    if(transformedInput.length >= 1){
                        isValid[0] = validateHour(transformedInput.substr(0,1), 0);
                        if(!isValid[0]){
                            if(transformedInput.length == 1){   //type in
                                transformedInput = null;
                            } else {//Should not have error in first char if type in. only paste will happend
                                transformedInput = '2';  // set to max value of 24h;
                            }
                        }
                    }

                    if(isValid[0]
                        && transformedInput.length >= 2){
                        isValid[1] =validateHour(transformedInput.substr(0,2), 1);
                        if(!isValid[1]){
                            if(transformedInput.length == 2){   //type in
                                transformedInput = transformedInput.substr(0,1);
                            } else {
                                //Should not have error in second char and length > 2 if type in.
                                //only paste will happend
                                //set to max value of 24h
                                transformedInput = transformedInput.substr(0,1) + '4';
                            }
                        }
                    }

                    if(isValid[0] && isValid[1]
                        && transformedInput.length >= 3){
                        isValid[2] = validateMinute(transformedInput.substr(2,1));
                        if(!isValid[2]){
                            if(transformedInput.length == 3){   //type in
                                transformedInput = transformedInput.substr(0,2);
                            } else {
                                //Should not have error in second char and length > 2 if type in.
                                //only paste will happend
                                //set to max of 59 mins
                                transformedInput = transformedInput.substr(0,2) + '5';
                            }
                        }
                    }

                    if(transformedInput && transformedInput.length > 4){
                        transformedInput = transformedInput.substr(0,4);
                    }
                    var lastValLength = lastVal?lastVal.length:0;
                    if(transformedInput && transformedInput.length >= 2 //HHmm
                        //not delete colon ':' case
                        && !(transformedInput.length === 2 && (lastValLength - transformedInput.length) === 1)
                        ){
                        transformedInput = transformedInput.slice(0, 2) + ":" + transformedInput.slice(2);
                    }

                    lastVal = transformedInput;
                    if (transformedInput != inputValue) {
                        //view value still show whatever user typed/pasted in
                        // modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$viewValue = transformedInput;
                        modelCtrl.$$lastCommittedViewValue = transformedInput;
                        // modelCtrl.$commitViewValue();
                        modelCtrl.$render();
                    }

                    //model value not taking space (trimed)
                    return transformedInput?transformedInput.trim():null;
                }

                function validateHour(hourStr, index){
                    if(index === 0){
                        return Number(hourStr[0]) <= 2;
                    } else{ //index =  1
                        var firstDigit = Number(hourStr[0]);
                        var secondDigit = Number(hourStr[1]);
                        return firstDigit != 2 ? true : secondDigit <4;
                    }
                }

                function validateMinute(minuteStr){
                    return Number(minuteStr[0]) <= 5;
                }
            }
        };
    });
})();
