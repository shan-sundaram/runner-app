define([
    'knockout',
    'knockoutMapping',
    'knockoutProjections',
    'text!./library.html',
    'runnerConfig',
    'bootstrap',
    'moment',
    'momentDurationFormat',
    'fixtures'
], function (
        ko,
        knockoutMapping,
        knockoutProjections,
        template,
        runnerConfig,
        bootstrap,
        moment,
        momentDurationFormat,
        fixtures
) {

    var selectedFilterStates = {
        'all': null,
        'active': [
            'pending',
            'initializing',
            'running'
        ],
        'errored': [
            'failure',
            'init_failure'
        ],
        'successful': [
            'success'
        ],

        'inactive': [
            'stopping',
            'stopped',
            'killing',
            'killed',
            'expired'
        ]
    };

    var statuses = {
        'active': {
            statusIcon: '#icon-play',
            statusClass: 'running'
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
            statusClass: 'pending'
        },
        'initializing': {
            statusIcon: '#icon-ellipsis',
            statusClass: 'initializing'
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
        },
        'expired': {
            statusIcon: '#icon-close',
            statusClass: 'expired'
        },
        'init_failure': {
            statusIcon: '#icon-close',
            statusClass: 'init_failure'
        }
    };

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

        var status = self.status().toLowerCase();
        var timers = self.timers()[0];

        model.duration = ko.computed(function () {
            var start = timers.start();
            var end = timers.end();

            var startMoment = moment(start);
            var endMoment = moment(end);

            var durationInMilliseconds = endMoment.diff(startMoment);
            var durationMoment = moment.duration(durationInMilliseconds);
            var durationMomentFormat = durationMoment.format('d [day] h [hr] m [min] s [sec]');

            return durationMomentFormat;
        }, self);

        model.finished = ko.computed(function () {
            var timers = self.timers()[0];

            var start = timers.start();
            var end = timers.end();

            var startMoment = moment(start);
            var endMoment = moment(end);
            var nowMoment = moment();

            var durationInMilliseconds = nowMoment.diff(endMoment);
            var durationMoment = moment.duration(durationInMilliseconds);
            var durationMomentFormat = durationMoment.format('d [day] h [hr] m [min] s [sec]') + ' ago';

            return durationMomentFormat;
        }, self);

        model.parentJobName = ko.computed(function () {
            var retVal = self.job_id();
            return retVal;
        }, self);

        model.statusIcon = ko.computed(function () {
            var retVal = statuses[status]['statusIcon'];
            return retVal;
        }, self);

        model.statusClass = ko.computed(function () {
            var retVal = statuses[status]['statusClass'];
            return retVal;
        }, self);

        model.hrefJobExecution = ko.computed(function () {
            //#job/0da21734-61e8-48aa-9cad-4e3e13146007/job-execution/ac609d05-10dd-41af-9529-a1b6328044f8
            var href = '#job/' + self.job_id() + '/job-execution/' + self.execution_id();
            return href;
        }, self);

        return model;
    }

    var jobExecutionMapping = {
        create: function (options) {
            return new JobExecutionMappingAdditions(options.data);
        }
    };

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

    function LibraryViewModel(params) {
        var self = this;
        var dev = true;

        self.jobExecutions = ko.observableArray();

        self.pageIndex = 0;
        self.pageSize = 10;

        self.filterJobExecutionsByStatusQuery = ko.observable(null);

        self.jobsFeatured = ko.observableArray();
        self.jobs = ko.observableArray();

        var jobsFeaturedFixture = fixtures.jobsFeatured;
        var jobsFixture = fixtures.jobs;

        //Set ID of initially selected tab element
        self.selectedJobExecutionsTab = ko.observable('job-executions-all');

        //Mark clicked Tab as selected
        self.selectJobExecutionTab = function (data) {
            console.log('data', data);

            var element = event.target;
            var $element = $(element);
            var selectedTabID = $element.attr('id');
            var selectedTabStatus = $element.data('status');

            var filterStatusArray = selectedFilterStates[selectedTabStatus];
            self.filterJobExecutionsByStatusQuery(filterStatusArray);
            self.selectedJobExecutionsTab(selectedTabID);
        };

        self.jobExecutionTabIsActive = function (tabFilterString) {
            var thisTab = 'job-executions-' + tabFilterString;
            var selectedTab = self.selectedJobExecutionsTab();
            return thisTab === selectedTab;
        };

        if (dev) {
            var jobExecutionsFixture = fixtures.jobExecutions;

            jobExecutionsFixture.forEach(function (jobExecutionData) {
                //console.log('jobExecutionData', ko.toJSON(jobExecutionData, null, 4));

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
                var observableJobFeatured = ko.mapping.fromJS(jobFeaturedData, jobFeaturedMapping);
                self.jobsFeatured.push(observableJobFeatured);
            });

            jobsFixture.forEach(function (jobData) {
                var observableJob = ko.mapping.fromJS(jobData, jobMapping);
                self.jobs.push(observableJob);
            });

        } else {
            var runner = runnerConfig.getRunnerInstance();

            runner.executions.find().then(function (jobExecutionsPage) {
                console.log('RUNNER RETURNED');
                self.page = jobExecutionsPage.data;
                var executionsList = self.page.values;
                executionsList.forEach(function (jobExecution) {
                    var jobExecutionData = jobExecution.data;
                    var observableExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                    self.jobExecutions.push(observableExecution);
                });
            });

            jobsFeaturedFixture.forEach(function (jobFeaturedData) {
                var observableJobFeatured = ko.mapping.fromJS(jobFeaturedData, jobFeaturedMapping);
                self.jobsFeatured.push(observableJobFeatured);
            });

            jobsFixture.forEach(function (jobData) {
                var observableJob = ko.mapping.fromJS(jobData, jobMapping);
                self.jobs.push(observableJob);
            });
        }

        self.jobExecutionsFiltered = self.jobExecutions.filter(function (jobExecution) {

            var filterStatusArray = self.filterJobExecutionsByStatusQuery();
            var jobExecutionStatus = jobExecution.status().toLowerCase();
            var theStatusBool = true;

            if (null == filterStatusArray) {
                return self.jobExecutions;
            }

            if ((null != filterStatusArray) && (null != jobExecutionStatus)) {
                theStatusBool = filterStatusArray.indexOf(jobExecutionStatus) != -1;
                //console.log('theStatusBool', theStatusBool);
            }

            return theStatusBool;
        });
    }

    // Use prototype to declare any public methods
    LibraryViewModel.prototype.doSomething = function () {

    };

    return {
        viewModel: LibraryViewModel,
        template: template
    };
});
