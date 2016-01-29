define(['knockout', 'text!./job.html', 'fixtures'], function (ko, template, fixtures) {

    function Job(job) {
        this.id = ko.observable(job.id || '—');
        this.name = ko.observable(job.name || '—');
        this.description = ko.observable(job.description || '—');
        this.image = ko.observable(job.image || '—');
        this.version = ko.observable(job.version || '—');
        this.githubUrlRepo = ko.observable(job.githubUrlRepo || '—');
        this.githubUrlMd = ko.observable(job.githubUrlMd || '—');
        this.updated = ko.observable(job.updated || '—');
        this.countDeploy = ko.observable(job.countDeploy || '—');
        this.countFork = ko.observable(job.countFork || '—');
        this.countStar = ko.observable(job.countStar || '—');
        this.featuredClass = ko.observable(job.featuredClass || '—');
        this.privacy = ko.observable(job.privacy || '—');
    }

    function JobViewModel(params) {
        var self = this;

        self.job = new Job(fixtures.job);
    }

    return {
        viewModel: JobViewModel,
        template: template
    };
});
