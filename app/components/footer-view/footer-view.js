/**
 * Created by ericjohnson on 1/15/16.
 */

'use strict';

console.log('footer.js');

define(['knockout', 'text!./footer.html', 'fixtures'], function (ko, template, fixtures) {

    function Activity(params) {
        this.date = ko.observable(params.date || '—');
        this.time = ko.observable(params.time || '—');
        this.description = ko.observable(params.description || '—');
        this.user = ko.observable(params.user || '—');
    }

    function NavigationViewModel(params) {
        var self = this;

        self.activityItems = [];

        fixtures.activities.forEach(function (activityItem) {
            var activityObject = new Activity(activityItem);
            self.activityItems.push(activityObject);
        });
    }

    return {
        viewModel: NavigationViewModel,
        template: template
    };
});
