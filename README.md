material-timer-input
==================

Base on Angular Material input. Used to validate user input for time, as it only allow in 24h format HH:mm. Ex: `23:50`, `00:15`

Requirements
-------

- Angular
- Angular Material

Install
-------

    bower install material-time-input


Add `SherlockedCustomDirective` to your app’s dependencies

```javascript
angular.module('MaterialApp',
    [
        'ngMaterial',
        'SherlockedCustomDirective'
    ]);
```

Usage
-----

##HTML: 

```html
    <md-input-container>
        <label>Sequence number</label>
        <input ng-model="testInput" material-time-input ng-trim="false">
    </md-input-container>
```

##Note:
- Must specify ng-trim="false" to input element to trigger $parser everytime testInput model change
