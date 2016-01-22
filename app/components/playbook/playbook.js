define(['knockout', 'text!./playbook.html', '/scripts/fixtures.js'], function (ko, template, fixtures) {

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

    function PlaybookViewModel(params) {
        var self = this;

        self.playbook = new Playbook(fixtures.playbook);
    }

    return {
        viewModel: PlaybookViewModel,
        template: template
    };
});
