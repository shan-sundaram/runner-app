define([
    'knockout',
    'knockoutMapping',
    'text!./library.html',
    'runnerConfig',
    'bootstrap',
    'moment',
    'momentDurationFormat',
    'fixtures'
], function (
        ko,
        knockoutMapping,
        template,
        runnerConfig,
        bootstrap,
        moment,
        momentDurationFormat,
        fixtures
) {

    var statuses = {
        'active': {
            statusIcon: '#icon-play',
            statusClass: 'running',
            statusClass2: 'active',
        },


        'success': {
            statusIcon: '#icon-check-circle',
            statusClass: 'success'

        },
        'failure': {
            statusIcon: '#icon-exclamation-circle',
            statusClass: 'failure'

        },
        'pending': {
            statusIcon: '#icon-ellipsis',
            statusClass: 'pending',

        },
        'initializing': {
            statusIcon: '#icon-ellipsis',
            statusClass: 'initializing',

        },
        'running': {
            statusIcon: '#icon-play',
            statusClass: 'running'

        },
        'stopping': {
            statusIcon: '#icon-ellipsis',
            statusClass: 'stopping'

        },
        'stopped': {
            statusIcon: '#icon-stop',
            statusClass: 'stopped'

        },
        'killing': {
            statusIcon: '#icon-ellipsis',
            statusClass: 'killing'
        },
        'killed': {
            statusIcon: '#icon-close',
            statusClass: 'killed'

        }
    };

/*
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
*/

/*
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
*/

/*
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
*/


    function JobMappingAdditions(data) {
        var self = this;
        var model = ko.mapping.fromJS(data, {}, self);

        return model;
    }
    function JobFeaturedMappingAdditions(data) {
        var self = this;
        var model = ko.mapping.fromJS(data, {}, self);

        return model;
    }
    function JobExecutionMappingAdditions(data) {
        var self = this;
        var model = ko.mapping.fromJS(data, {}, self);

        var theId = self.id();
        var theStatus = self.status();

        //console.log('JobExecutionMappingAdditions theId', theId);
        //console.log('JobExecutionMappingAdditions theStatus', theStatus);

        model.duration = ko.computed(function () {
            var fudgeFactorForTesting = 1234567;
            var lastUpdatedTime = self.lastUpdatedTime();
            var createdTime = self.createdTime() - fudgeFactorForTesting;

            if (lastUpdatedTime === createdTime) {
                console.log('duration instant');
                return 'instant';
            }

            var lastUpdatedMoment = moment(lastUpdatedTime);
            var createdMoment = moment(createdTime);
            var durationInMilliseconds = lastUpdatedMoment.diff(createdMoment);
            var durationMoment = moment.duration(durationInMilliseconds);
            var durationMomentFormat = durationMoment.format('d [day] h [hr] m [min] s [sec]');

            //console.log('duration', durationMomentFormat);
            return durationMomentFormat;
        }, self);

        model.finished = ko.computed(function () {
            var lastUpdatedTime = self.lastUpdatedTime();
            var lastUpdatedMoment = moment(lastUpdatedTime);
            var nowMoment = moment();

            var durationInMilliseconds = nowMoment.diff(lastUpdatedMoment);
            var durationMoment = moment.duration(durationInMilliseconds);
            var durationMomentFormat = durationMoment.format('d [day] h [hr] m [min] s [sec]') + ' ago';

            //console.log('finished', durationMomentFormat);
            return durationMomentFormat;
        }, self);

        model.hrefjobExecutionstop = ko.computed(function () {
            return '#job/' + theId;
        }, self);

        model.hrefJobKill = ko.computed(function () {
            return '#job/' + theId;
        }, self);

        model.statusIcon = ko.computed(function () {
            return statuses[theStatus]['statusIcon'];
        }, self);

        return model;
    }


    var jobMapping = {
        create: function (options) {
            return new JobMappingAdditions(options.data);
        }
    };

    var jobFeaturedMapping = {
        create: function (options) {
            return new JobFeaturedMappingAdditions(options.data);
        }
    };

    var jobExecutionMapping = {
        create: function (options) {
            return new JobExecutionMappingAdditions(options.data);
        }
    };

    function LibraryViewModel(params) {
        var self = this;
        var dev = true;

        self.jobExecutions = ko.observableArray();


        self.jobsFeatured = ko.observableArray();
        self.jobs = ko.observableArray();

        var jobsFeaturedFixture = fixtures.jobsFeatured;
        var jobsFixture = fixtures.jobs;

        if (dev) {
            var jobExecutionsFixture = fixtures.jobExecutions;
            //var playbooksFeaturedFixture = fixtures.playbooksFeatured;
            //var playbooksFixture = fixtures.playbooks;

            jobExecutionsFixture.forEach(function (jobExecutionData) {
                //24 hours
                //1440 min
                //86400 sec
                //86400000 milliseconds

                var earliestPastCreateSeconds = 4;
                var earliestPastUpdateSeconds = 2;
                var latestPastSeconds = 3600; // 3600 = 1 hour
                //var latestPastSeconds = 86400; // 86400 = 1 day
                var randomCreateMilliseconds = Math.floor(Math.random() * (latestPastSeconds * 1000)) + (earliestPastCreateSeconds * 1000);
                var randomUpdateMilliseconds = Math.floor(Math.random() * (latestPastSeconds * 1000)) + (earliestPastUpdateSeconds * 1000);

                var randomCreatedTime = moment().subtract(randomCreateMilliseconds).valueOf();
                var randomLastUpdatedTime = moment().subtract(randomUpdateMilliseconds).valueOf();

                jobExecutionData.createdTime = randomCreatedTime;
                jobExecutionData.lastUpdatedTime = randomLastUpdatedTime;

                //console.log('jobExecutionData.status', jobExecutionData.status);

                var observableJobExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                self.jobExecutions.push(observableJobExecution);
            });

            jobsFeaturedFixture.forEach(function (jobFeaturedData) {
                //var jobFeaturedObject = new Job(jobFeatured);
                //self.jobsFeatured.push(jobFeaturedObject);

                var observableJobFeatured = ko.mapping.fromJS(jobFeaturedData, jobFeaturedMapping);
                self.jobsFeatured.push(observableJobFeatured);
            });

            jobsFixture.forEach(function (jobData) {
                //var jobObject = new Job(job);
                //self.jobs.push(jobObject);

                var observableJob = ko.mapping.fromJS(jobData, jobMapping);
                self.jobs.push(observableJob);
            });

        } else {
            var runner = runnerConfig.getRunnerInstance();

            var options = {
                page: 0,
                size: 10
            };

            runner.jobs.find(options).then(function (jobExecutionsPage) {
                console.log('RUNNER RETURNED');
                self.page = jobExecutionsPage.data;
                var jobExecutions = self.page.values;

                jobExecutions.forEach(function (jobExecution) {
                    var jobExecutionData = jobExecution.data;
                    console.log('jobExecutionData.status', jobExecutionData.status);
                    var observableJobExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                    self.jobExecutions.push(observableJobExecution);
                });
            });

            jobsFeaturedFixture.forEach(function (jobFeaturedData) {
                //var playbookFeaturedObject = new Playbook(playbookFeatured);
                //self.playbooksFeatured.push(playbookFeaturedObject);

                var observableJobFeatured = ko.mapping.fromJS(jobFeaturedData, jobFeaturedMapping);
                self.jobsFeatured.push(observableJobFeatured);
            });

            jobsFixture.forEach(function (jobData) {
                //var playbookObject = new Playbook(playbook);
                //self.playbooks.push(playbookObject);

                var observableJob = ko.mapping.fromJS(jobData, jobMapping);
                self.jobs.push(observableJob);
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
