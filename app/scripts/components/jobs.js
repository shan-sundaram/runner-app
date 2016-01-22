define(['knockout', 'text!/views/jobs.html', 'models', 'fixtures'], function (ko, htmlString, fixtures) {

    function Job(params) {
        this.jobId = ko.observable(params.jobId || '—');
        this.name = ko.observable(params.name || '—');
        this.status = ko.observable(params.status || '—');
        this.icon = ko.observable(params.icon || '—');
        this.user = ko.observable(params.user || '—');
        this.duration = ko.observable(params.duration || '—');
        this.finished = ko.observable(params.finished || '—');
    }

    function JobsViewModel(params) {
        var self = this;

        self.jobs = [];

        fixtures.jobs.forEach(function (job) {
            var jobObject = new Job(job);
            self.jobs.push(jobObject);
        });

    }

    return {
        viewModel: JobsViewModel,
        template: htmlString
    };
});
