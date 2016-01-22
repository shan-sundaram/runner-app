define(['knockout', 'text!./job.html', '/scripts/fixtures.js'], function (ko, htmlString, fixtures) {

    function Job(params) {
        this.jobId = ko.observable(params.jobId || '—');
        this.name = ko.observable(params.name || '—');
        this.status = ko.observable(params.status || '—');
        this.icon = ko.observable(params.icon || '—');
        this.user = ko.observable(params.user || '—');
        this.duration = ko.observable(params.duration || '—');
        this.finished = ko.observable(params.finished || '—');
    }

    function JobViewModel(params) {
        var self = this;

        self.job = new Job(fixtures.job);
    }

    return {
        viewModel: JobViewModel,
        template: htmlString
    };
});
