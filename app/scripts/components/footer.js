define(['knockout', 'text!/views/footer.html', 'fixtures'], function (ko, htmlString, fixtures) {

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
        template: htmlString
    };
});
