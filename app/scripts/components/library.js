define(['knockout', 'text!/views/library.html', 'fixtures'], function (ko, htmlString, fixtures) {

    function Job(params) {
        this.jobId = ko.observable(params.jobId || '—');
        this.name = ko.observable(params.name || '—');
        this.status = ko.observable(params.status || '—');
        this.icon = ko.observable(params.icon || '—');
        this.user = ko.observable(params.user || '—');
        this.duration = ko.observable(params.duration || '—');
        this.finished = ko.observable(params.finished || '—');
    }

    function Playbook(params) {
        this.id = ko.observable(params.id || '—');
        this.name = ko.observable(params.name || '—');
        this.description = ko.observable(params.description || '—');
        this.image = ko.observable(params.image || '—');
        this.version = ko.observable(params.version || '—');
        this.githubUrlRepo = ko.observable(params.githubUrlRepo || '—');
        this.githubUrlMd = ko.observable(params.githubUrlMd || '—');
        this.updated = ko.observable(params.updated || '—');
        this.countDeploy = ko.observable(params.countDeploy || '—');
        this.countFork = ko.observable(params.countFork || '—');
        this.countStar = ko.observable(params.countStar || '—');
        this.featuredClass = ko.observable(params.featuredClass || '—');
        this.privacy = ko.observable(params.privacy || '—');
    }

    function LibraryViewModel(params) {
        var self = this;

        self.tabViews = {
            playbook: {
                selected: ko.observable()
            },
            job: {
                selected: ko.observable()
            }
        };

        self.jobs = [];
        self.playbooksFeatured = [];
        self.playbooks = [];

        fixtures.jobs.forEach(function (job) {
            var jobObject = new Job(job);
            self.jobs.push(jobObject);
        });

        fixtures.playbooksFeatured.forEach(function (playbookFeatured) {
            var playbookFeaturedObject = new Playbook(playbookFeatured);
            self.playbooksFeatured.push(playbookFeaturedObject);
        });

        fixtures.playbooks.forEach(function (playbook) {
            var playbookObject = new Playbook(playbook);
            self.playbooks.push(playbookObject);
        });
    }

    return {
        viewModel: LibraryViewModel,
        template: htmlString
    };
});
