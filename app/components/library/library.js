define(['knockout', 'mapping', 'text!./library.html', 'fixtures', 'runnerConfig', 'bootstrap'], function (ko, mapping, template, fixtures, runnerConfig) {

    function JobExecution(jobExecution) {
        this.id = ko.observable(jobExecution.id || '—');
        this.name = ko.observable(jobExecution.name || '—');
        this.status = ko.observable(jobExecution.status || '—');
        this.duration = ko.observable(jobExecution.duration || '—');
        this.finished = ko.observable(jobExecution.finished || '—');



        this.accountAlias = ko.observable(jobExecution.accountAlias || '—');
        this.description = ko.observable(jobExecution.description || '—');
        this.playbook = ko.observable(jobExecution.playbook || '—');
        this.useDynamicInventory = ko.observable(jobExecution.useDynamicInventory || '—');
        this.properties = ko.observable(jobExecution.properties || '—');
        this.createdTime = ko.observable(jobExecution.createdTime || '—');
        this.lastUpdatedTime = ko.observable(jobExecution.lastUpdatedTime || '—');
        this.bootstrapKeyPairAlias = ko.observable(jobExecution.bootstrapKeyPairAlias || '—');
        this.playbookTags = ko.observable(jobExecution.playbookTags || '—');
        this.executionTtl = ko.observable(jobExecution.executionTtl || '—');
        this.repository = ko.observable(jobExecution.repository || '—');
        this.hosts = ko.observable(jobExecution.hosts || '—');
        this.links = ko.observable(jobExecution.links || '—');
        this.callbacks = ko.observable(jobExecution.callbacks || '—');

        this.statusIcon = ko.computed(function () {
            var theStatus = this.status();
            console.log('thisStatus: ' + theStatus);
            var statusIcon = statuses[theStatus]['statusIcon'];
            console.log('statusIcon: ' + statusIcon);
            return statusIcon;
        }, this);

        this.statusClass = ko.computed(function () {
            var theStatus = this.status();
            console.log('theStatus: ' + theStatus);
            var statusClass = statuses[theStatus]['statusClass'];
            console.log('statusClass: ' + statusClass);
            return statusClass;
        }, this);
    }

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

    var statuses = {
        ACTIVE: {
            statusIcon: '#icon-play',
            statusClass: 'running'
        },





        INITIALIZING: {
            statusIcon: '#icon-play',
            statusClass: 'initializing'
        },
        PENDING: {
            statusIcon: '#icon-play',
            statusClass: 'pending'
        },
        RUNNING: {
            statusIcon: '#icon-play',
            statusClass: 'running'
        },
        SUCCESS: {
            statusIcon: '#icon-ellipsis',
            statusClass: 'success'
        },
        FAILURE: {
            statusIcon: '#icon-exclamation-circle',
            statusClass: 'error'
        },
        STOPPED: {
            statusIcon: '#icon-stop',
            statusClass: 'error'
        },
        KILLED: {
            statusIcon: '#icon-ellipsis',
            statusClass: 'killed'
        }
    };


    function JobMappingAdditions(data) {
        var self = this;
        var model = ko.mapping.fromJS(data, {}, self);

        var theId = self.id();
        var theStatus = self.status();
        var theTime = self.createdTime();

        model.duration = ko.computed(function() {
            return theTime;
        }, self);

        model.finished = ko.computed(function() {
            return theTime;
        }, self);

        model.hrefJobStop = ko.computed(function() {
            return '#job/' + theId;
        }, self);

        model.hrefJobKill = ko.computed(function() {
            return '#job/' + theId;
        }, self);

        model.statusIcon = ko.computed(function () {
            return statuses[theStatus]['statusIcon'];
        }, self);
        model.statusClass = ko.computed(function () {
            return statuses[theStatus]['statusClass'];
        }, self);

        return model;
    }

    var jobMappings = {
        create: function (options) {
            return new JobMappingAdditions(options.data);
        }
    };

    function LibraryViewModel(params) {
        var self = this;
        var dev = true;

        self.jobExecutions = ko.observableArray();
        self.jobsFeatured = ko.observableArray();
        self.jobs = ko.observableArray();

        var jobsFeaturedFixture = fixtures.libraryJobsFeatured;
        var jobsFixture = fixtures.libraryJobs;

        if (dev) {
            var jobExecutionsFixture = fixtures.jobExecutions;
            //var playbooksFeaturedFixture = fixtures.playbooksFeatured;
            //var playbooksFixture = fixtures.playbooks;

            jobExecutionsFixture.forEach(function (jobExecution) {
                console.log("library jobExecution", jobExecution);
                var jobExecutionObject = new JobExecution(jobExecution);
                self.jobExecutions.push(jobExecutionObject);
            });

            jobsFeaturedFixture.forEach(function (jobFeatured) {
                var jobFeaturedObject = new Job(jobFeatured);
                self.jobsFeatured.push(jobFeaturedObject);
            });

            jobsFixture.forEach(function (job) {
                var jobObject = new Job(job);
                self.jobs.push(jobObject);
            });

        } else {
            var runner = runnerConfig.getRunnerInstance();

            runner.jobs.find().then(function (jobs) {
                self.page = jobs.data;
                var jobsData = self.page.values;
                console.log("jobsData", jobsData);

                //runner.jobs.get().then(function (job) {
                //console.log(RNRrunner);

                jobsData.forEach(function (job) {
                    var jobData = job.data;
                    var observableJob = ko.mapping.fromJS(jobData, jobMappings);
                    self.jobs.push(observableJob);
                });

                console.log('/////RNRrunner');
                //console.log(job);

                //var jobData = job.data;

                //console.log("job.data", job.data);
                //console.log("job.data.id", job.data.id);
                //console.log("job.data.name", job.data.name);
                //
                //console.log('self', self);
                //console.log('self.job', self.job());
                //console.log('self.job.id', self.job().id());
                //console.log('self.job.name', self.job().name());
                //console.log('self.job.hrefJobStop', self.job().hrefJobStop());
                //console.log('self.job.hrefJobKill', self.job().hrefJobKill());
                //console.log('self.job.statusIcon', self.job().statusIcon());
                //console.log('self.job.statusClass', self.job().statusClass());
                //console.log('self.job.statusClass', self.job().repository.credentials.username);
            });

            playbooksFeaturedFixture.forEach(function (playbookFeatured) {
                var playbookFeaturedObject = new Playbook(playbookFeatured);
                self.playbooksFeatured.push(playbookFeaturedObject);
            });

            playbooksFixture.forEach(function (playbook) {
                var playbookObject = new Playbook(playbook);
                self.playbooks.push(playbookObject);
            });

        }


/*
        self.playbooksFeatured = [];
        self.playbooks = [];
*/

/*
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
*/
    }

    return {
        viewModel: LibraryViewModel,
        template: template
    };
});
