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

    function JobExecutionsViewModel(params) {
        var self = this;
        var dev = false;

        self.jobExecutions = ko.observableArray();

        self.page = ko.observable();
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
                console.log('self.page', ko.toJSON(self.page, null, 4));



                //self.page(jobExecutionsPage.data);

                var executionsList = self.page.values;

                executionsList.forEach(function (jobExecution) {
                    var jobExecutionData = jobExecution.data;
                    var observableExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                    self.jobExecutions.push(observableExecution);
                });


                var pagingData = new PagingModel(self.page);
                console.log('pagingData', ko.toJSON(pagingData, null, 4));

                var observablePaging = ko.mapping.fromJS(pagingData, pagingMapping);
                console.log('observablePaging', ko.toJSON(observablePaging, null, 4));

                self.paging(observablePaging);
                //console.log('self.paging', ko.toJSON(self.paging, null, 4));
                console.log('self.paging', self.paging());

            });

        }

        self.jobExecutionsFiltered = self.jobExecutions.filter(function (jobExecution) {
            //console.log('jobExecutionsFiltered');

            var filterStatusArray = self.filterJobExecutionsByStatusQuery();
            var filterNameString = self.filterJobExecutionsByNameQuery();

            var jobExecutionStatus = jobExecution.status().toLowerCase();
            var jobExecutionName = jobExecution.execution_id();

            var theStatusBool = true;
            var theNameBool = true;

            if (null == filterStatusArray && null == filterNameString) {
                return self.jobExecutions;
            }

            if ((null != filterStatusArray) && (null != jobExecutionStatus)) {
                theStatusBool = filterStatusArray.indexOf(jobExecutionStatus) != -1;
            }

            if ((null != filterNameString) && (null != jobExecutionName)) {
                theNameBool = jobExecutionName.match(new RegExp(filterNameString, "i"));
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

    function PagingModel(page) {
        var self = this;

        self.pageNumber = page.page + 1;
        self.pageSize = page.size;
        self.itemCount = page.totalSize;
        self.page = page;
    }

    var pagingMapping = {
        create: function (options) {
            return new PagingMappingAdditions(options.data);
        }
    };


    function PagingMappingAdditions(data) {

        var self = this;
        self.data = data;

        ko.mapping.fromJS(data, {}, self);

        self.loadNextPage = function () {
            self.data.page().next().then(function (jobExecutionsPage){
                //self.page = jobExecutionsPage.data;

                var executionsList = jobExecutionsPage.values;

                executionsList.forEach(function (jobExecution) {
                    var jobExecutionData = jobExecution.data;
                    var observableExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                    self.jobExecutions.push(observableExecution);
                });
            })
        };


/*
        self.loadNextPage = function () {
            self.fetch(self.pageNumber() + 1, self.pageSize()).then(function(nextPage, data) {
                var jobExecutionsData = nextPage.data.values;
                self.jobExecutions([]);
                jobExecutionsData.forEach(function (jobExecution) {
                    var jobExecutionData = jobExecution.data;
                    var observableJobExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                    self.jobExecutions.push(observableJobExecution);
                    //self.jobExecutions.push(observableJobExecution);
                });
                self.pageNumber = self.pageNumber + 1;
            });
        };


        self.loadPrevPage = function () {
            self.fetch(self.pageNumber() - 1, self.pageSize()).then(function(prevPage, data) {
                var jobExecutionsData = prevPage.data.values;
                self.jobExecutions([]);
                jobExecutionsData.forEach(function (jobExecution) {
                    var jobExecutionData = jobExecution.data;
                    var observableJobExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                    self.jobExecutions.push(observableJobExecution);
                });
                self.pageNumber = self.pageNumber - 1;
            });
        };
*/




        self.pageCount = ko.computed(function () {
            //the total number of pages.
            if (self.itemCount() <= 0) {
                return 1;
            }
            return Math.ceil(self.itemCount() / self.pageSize());
        }, self);

        self.firstItemOnPage = ko.computed(function () {
            //the index (one-based) of the first item on the current page.
            return (self.pageNumber() - 1) * self.pageSize() + 1;
        }, self);

        self.lastItemOnPage = ko.computed(function () {
            //the index (one-based) of the last item on the current page.
            if (self.itemCount() == 0) {
                return 1;
            }
            return Math.min(self.pageNumber() * self.pageSize(), self.itemCount());
        }, self);

        self.hasPreviousPage = ko.computed(function () {
            //indicates if there is a previous page.
            return !self.isFirstPage();
        }, self);

        self.hasNextPage = ko.computed(function () {
            //indicates if there is a next page.
            return !self.isLastPage();
        }, self);

        self.isFirstPage = ko.computed(function () {
            //indicates if the current page is the first page.
            return self.pageNumber() == 1;
        }, self);

        self.isLastPage = ko.computed(function () {
            //indicates if the current page is the last page.
            return self.pageNumber() == self.pageCount();
        }, self);

        return self;
    }


    // Use prototype to declare any public methods
    JobExecutionsViewModel.prototype.doSomething = function () {

    };

    return {
        viewModel: JobExecutionsViewModel,
        template: template
    };
});

