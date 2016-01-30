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

        self.pageIndex = 0;
        self.pageSize = 10;

        self.jobExecutions = ko.observableArray();
        self.filterJobExecutionsByStatusQuery = ko.observable(null);


        self.jobsFeatured = ko.observableArray();
        self.jobs = ko.observableArray();
        var jobsFeaturedFixture = fixtures.jobsFeatured;
        var jobsFixture = fixtures.jobs;


        var selectedFilterStates = {
            'all': null,
            'active': [
                'pending',
                'initializing',
                'running'
            ],
            'errored': [
                'failure'
            ],
            'successful': [
                'success'
            ],

            'inactive': [
                'stopping',
                'stopped',
                'killing',
                'killed'
            ]
        };

        //Set ID of initially selected tab element
        self.selectedJobExecutionsTab = ko.observable('job-executions-all');

        //Mark clicked Tab as selected
        self.selectJobExecutionTab = function (data) {
            console.log('data', data);

            var element = event.target;
            var $element = $(element);
            var selectedTabID = $element.attr('id');
            var selectedTabStatus = $element.data('status');

            console.log('selectedTabStatus', selectedTabStatus);

            var filterStatusArray = selectedFilterStates[selectedTabStatus];
            console.log('filterStatusArray', filterStatusArray);
            self.filterJobExecutionsByStatusQuery(filterStatusArray);
            console.log('selectedTabID', selectedTabID);
            self.selectedJobExecutionsTab(selectedTabID);
        };

        self.jobExecutionTabIsActive = function (tabFilterString) {
            var thisTab = 'job-executions-' + tabFilterString;
            var selectedTab = self.selectedJobExecutionsTab();
            console.log('isActive thisTab', thisTab);
            console.log('isActive selectedTab', selectedTab);
            return thisTab === selectedTab;
        };

        if (dev) {
            var jobExecutionsFixture = fixtures.jobExecutions;
            //var jobsFeaturedFixture = fixtures.jobsFeatured;
            //var jobsFixture = fixtures.jobs;

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
                var observableJobFeatured = ko.mapping.fromJS(jobFeaturedData, jobFeaturedMapping);
                self.jobsFeatured.push(observableJobFeatured);
            });

            jobsFixture.forEach(function (jobData) {
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
                var observableJobFeatured = ko.mapping.fromJS(jobFeaturedData, jobFeaturedMapping);
                self.jobsFeatured.push(observableJobFeatured);
            });

            jobsFixture.forEach(function (jobData) {
                var observableJob = ko.mapping.fromJS(jobData, jobMapping);
                self.jobs.push(observableJob);
            });
        }

        self.jobExecutionsFiltered = self.jobExecutions.filter(function (jobExecution) {
            console.log('jobExecutionsFiltered');

            var filterStatusArray = self.filterJobExecutionsByStatusQuery();
            //var filterStatusArray = self.filterByStatusQuery();
            var jobExecutionStatus = jobExecution.status();
            var theStatusBool = true;

            //console.log('filterStatusArray', filterStatusArray);
            //console.log('jobExecutionStatus', jobExecutionStatus);

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
