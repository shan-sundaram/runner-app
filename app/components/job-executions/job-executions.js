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

    function JobExecutionMappingAdditions(data) {
        var self = this;
        var model = ko.mapping.fromJS(data, {}, self);

        var theId = self.id();
        var theStatus = self.status().toLowerCase();

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


/*
    var mapping = {
        'ignore': ['twitter', 'webpage'],
        'copy': ['age', 'personId'],
        'lastName': {
            'create': function (options) {
                return ko.observable(options.data.toUpperCase());
            }
        }
    };
*/


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

/*
    var mapping = {
        'ignore': ['twitter', 'webpage'],
        'copy': ['age', 'personId'],
        'lastName': {
            'create': function (options) {
                return ko.observable(options.data.toUpperCase());
            }
        }
    };
*/

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

        self.isLoading = ko.observable(false);

            //self.paging = {};
        //self.alskdjfh = null;
        self.paging = ko.observable();

        //self.pageIndex = 0;
        //self.pageSize = 10;

        self.jobExecutions = ko.observableArray();




        //self.jobExecutions = ko.pagedObservableArray();

        self.filterJobExecutionsByStatusQuery = ko.observable(null);
        self.filterJobExecutionsByNameQuery = ko.observable(null);

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
            //console.log('isActive thisTab', thisTab);
            //console.log('isActive selectedTab', selectedTab);
            return thisTab === selectedTab;
        };


        if (dev) {
            var jobExecutionsFixture = fixtures.jobExecutions;

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
        } else {
            var runner = runnerConfig.getRunnerInstance();

            //var options = {
            //    page: self.pageIndex,
            //    size: self.pageSize
            //};

            self.isLoading(true);

            runner.jobs.find().then(function (jobExecutionsPage) {
            //runner.jobs.find(options).then(function (jobExecutionsPage) {
                console.log('RUNNER RETURNED');
                self.isLoading(false);

                var jobExecutionsPageData = jobExecutionsPage.data;
                var jobExecutions = jobExecutionsPageData.values;
                self.page = jobExecutionsPageData;

                jobExecutions.forEach(function (jobExecution) {
                    var jobExecutionData = jobExecution.data;
                    //console.log('jobExecutionData.status', jobExecutionData.status);
                    var observableJobExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                    self.jobExecutions.push(observableJobExecution);
                });



                var tempObject = {
                    pageNumber: ko.observable(jobExecutionsPage.data.page),
                    pageSize: ko.observable(jobExecutionsPage.data.size),
                    itemCount: ko.observable(jobExecutionsPage.data.totalSize)
                };


                //ko.mapping.fromJS(tempObject, pagingMapping, self.paging);
                self.paging(ko.mapping.fromJS(tempObject, pagingMapping));
                //var observablePaging = ko.mapping.fromJS(tempObject, pagingMapping);
                //self.paging = observablePaging;

                console.log('self.paging', ko.toJSON(self.paging, null, 4));

            });
        }




        self.jobExecutionsFiltered = self.jobExecutions.filter(function (jobExecution) {
            //console.log('jobExecutionsFiltered');

            var filterStatusArray = self.filterJobExecutionsByStatusQuery();
            var filterNameString = self.filterJobExecutionsByNameQuery();
            var jobExecutionStatus = jobExecution.status();
            var jobExecutionName = jobExecution.name();
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

