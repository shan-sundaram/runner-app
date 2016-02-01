define([
    'knockout',
    'knockoutMapping',
    'knockoutProjections',
    'text!./job-executions.html',
    'runnerConfig',
    'moment',
    'momentDurationFormat',
    'fixtures'
], function (
        ko,
        knockoutMapping,
        knockoutProjections,
        template,
        runnerConfig,
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
            statusClass: 'running',
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

    function JobExecutionMappingAdditions(data) {
        var self = this;
        var model = ko.mapping.fromJS(data, {}, self);

        var status = self.status().toLowerCase();
        var timers = self.timers()[0];

        //console.log('JobExecutionMappingAdditions idJob', idJob);
        //console.log('JobExecutionMappingAdditions idJobExecution', idJobExecution);
        //console.log('JobExecutionMappingAdditions theStatus', theStatus);

        model.duration = ko.computed(function () {
            //var timers = self.timers()[0];

            var start = timers.start();
            var end = timers.end();

            //if (end === start) {
            //    console.log('duration instant');
            //    return 'end: ' + end + 'start: ' + start;
            //    //return 'instant';
            //}

            var startMoment = moment(start);
            var endMoment = moment(end);

            var durationInMilliseconds = endMoment.diff(startMoment);
            var durationMoment = moment.duration(durationInMilliseconds);
            var durationMomentFormat = durationMoment.format('d [day] h [hr] m [min] s [sec]');
            //var durationMomentFormat = durationMoment.format('d [day] h [hr] m [min] s [sec] S [ms]');

            //console.log('duration', durationMomentFormat);
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
            //var durationMomentFormat = durationMoment.format('d [day] h [hr] m [min] s [sec] S [ms]') + ' ago';

            //console.log('finished', durationMomentFormat);
            return durationMomentFormat;
        }, self);

        model.parentJobName = ko.computed(function () {
            return self.job_id();
            //return 'parentJobName';
            //return statuses[status]['statusIcon'];
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

    function PagingMappingAdditions(data) {

        var self = this;
        var model = ko.mapping.fromJS(data, {}, self);

        var theCount = self.itemCount();
        var thePageSize = self.pageSize();

        model.pageCount = ko.computed(function () {
            //the total number of pages.
            if (theCount <= 0) {
                return 1;
            }
            return Math.ceil(theCount / thePageSize);
        }, self);

/*
        model.firstItemOnPage = ko.computed(function () {
            //the index (one-based) of the first item on the current page.
            return (self.pageNumber - 1) * self.pageSize() + 1;
        }, self);

        model.lastItemOnPage = ko.computed(function () {
            //the index (one-based) of the last item on the current page.
            if (self.itemCount() == 0) {
                return 1;
            }
            return Math.min(self.pageNumber * self.pageSize(), self.itemCount());
        }, self);

        model.hasPreviousPage = ko.computed(function () {
            //indicates if there is a previous page.
            return !model.isFirstPage;
        }, self);

        model.hasNextPage = ko.computed(function () {
            //indicates if there is a next page.
            return !self.isLastPage();
        }, self);

        model.isFirstPage = ko.computed(function () {
            //indicates if the current page is the first page.
            return self.pageNumber() == 1;
        }, self);

        model.isLastPage = ko.computed(function () {
            //indicates if the current page is the last page.
            return self.pageNumber() == self.pageCount();
        }, self);
*/

        //model.pages = ko.computed(function () {
        //    //an array of pages.
        //}, self);

        return model;
    }

    var pagingMapping = {
        create: function (options) {
            return new PagingMappingAdditions(options.data);
        }
    };

    function PagingModel(paging) {
        var self = this;

        self.pageNumber = paging.page;
        self.pageSize = paging.size;
        self.itemCount = paging.totalSize;
        //self.pageNumber = ko.observable(paging.page);
        //self.pageSize = ko.observable(paging.size);
        //self.itemCount = ko.observable(paging.totalSize);
    }

    function JobExecutionsViewModel(params) {
        var self = this;
        var dev = false;


        self.jobExecutions = ko.observableArray();

        self.pageIndex = 0;
        self.pageSize = 10;

        self.paging = ko.observable();
        self.isLoading = ko.observable(false);

        self.filterJobExecutionsByStatusQuery = ko.observable(null);
        self.filterJobExecutionsByNameQuery = ko.observable(null);

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
            //console.log('isActive thisTab', thisTab);
            //console.log('isActive selectedTab', selectedTab);
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

                //var earliestPastCreateSeconds = 4;
                //var earliestPastUpdateSeconds = 2;
                //var latestPastSeconds = 3600; // 3600 = 1 hour
                //var randomCreateMilliseconds = Math.floor(Math.random() * (latestPastSeconds * 1000)) + (earliestPastCreateSeconds * 1000);
                //var randomUpdateMilliseconds = Math.floor(Math.random() * (latestPastSeconds * 1000)) + (earliestPastUpdateSeconds * 1000);
                //
                //var randomCreatedTime = moment().subtract(randomCreateMilliseconds).valueOf();
                //var randomLastUpdatedTime = moment().subtract(randomUpdateMilliseconds).valueOf();
                //
                //jobExecutionData.createdTime = randomCreatedTime;
                //jobExecutionData.lastUpdatedTime = randomLastUpdatedTime;

                var observableJobExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                self.jobExecutions.push(observableJobExecution);
            });
        } else {
            var runner = runnerConfig.getRunnerInstance();

            self.isLoading(true);

            runner.executions.find().then(function (jobExecutionsPage) {
                console.log('RUNNER RETURNED');

                self.page = jobExecutionsPage.data;
                var executionsList = self.page.values;

                //console.log('jobExecutionsPage', jobExecutionsPage);
                //console.log('executionsList', executionsList);

                executionsList.forEach(function (jobExecution) {
                    var jobExecutionData = jobExecution.data;

                    //var jobID = jobExecutionData.job_id;
                    //var executionID = jobExecutionData.execution_id;

                    //console.log('jobID', jobID);
                    //console.log('executionID', executionID);

                    var observableExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                    self.jobExecutions.push(observableExecution);
                });
            });
        }




        self.jobExecutionsFiltered = self.jobExecutions.filter(function (jobExecution) {
            //console.log('jobExecutionsFiltered');

            var filterStatusArray = self.filterJobExecutionsByStatusQuery();
            var filterNameString = self.filterJobExecutionsByNameQuery();

            var jobExecutionStatus = jobExecution.status().toLowerCase();
            var jobExecutionName = jobExecution.execution_id();

            //var jobExecutionStatus = jobExecution.status();
            //var jobExecutionName = jobExecution.name();

            var theStatusBool = true;
            var theNameBool = true;

            //console.log('filterStatusArray', filterStatusArray);
            //console.log('filterNameString', filterNameString);
            //console.log('jobExecutionStatus', jobExecutionStatus);
            //console.log('jobExecutionName', jobExecutionName);

            if (null == filterStatusArray && null == filterNameString) {
                return self.jobExecutions;
            }

            if ((null != filterStatusArray) && (null != jobExecutionStatus)) {
                theStatusBool = filterStatusArray.indexOf(jobExecutionStatus) != -1;
                //console.log('theStatusBool', theStatusBool);
            }

            if ((null != filterNameString) && (null != jobExecutionName)) {
                theNameBool = jobExecutionName.match(new RegExp(filterNameString, "i"));
                //console.log('theNameBool', theNameBool);
            }

            return theStatusBool && theNameBool;
        });




        self.loadNextPage = function () {
            self.page.fetch(self.pageIndex+1, self.pageSize).then(function(nextPage, data) {
                var jobExecutionsData = nextPage.data.values;
                self.jobExecutions([]);
                jobExecutionsData.forEach(function (jobExecution) {
                    var jobExecutionData = jobExecution.data;
                    var observableJobExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                    self.jobExecutions.push(observableJobExecution);
                });
                self.pageIndex = self.pageIndex + 1;
            });
        };

        self.loadPreviousPage = function () {
            self.page.fetch(self.pageIndex-1, self.pageSize).then(function(prevPage, data) {
                var jobExecutionsData = prevPage.data.values;
                self.jobExecutions([]);
                jobExecutionsData.forEach(function (jobExecution) {
                    var jobExecutionData = jobExecution.data;
                    var observableJobExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                    self.jobExecutions.push(observableJobExecution);
                });
                self.pageIndex = self.pageIndex - 1;
            });
        };
    }

    // Use prototype to declare any public methods
    JobExecutionsViewModel.prototype.doSomething = function () {

    };

    return {
        viewModel: JobExecutionsViewModel,
        template: template
    };
});

