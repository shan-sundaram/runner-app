define(['knockout', 'mapping', 'text!./job-executions.html', 'fixtures', 'runnerConfig'], function (ko, mapping, template, fixtures, runnerConfig) {



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

        model.duration = ko.computed(function () {
            return self.createdTime();
        }, self);

        model.finished = ko.computed(function () {
            return self.createdTime();
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

    function jobExecutionsViewModel(params) {
        var self = this;
        var dev = true;

        self.jobExecutions = ko.observableArray();

        self.filterByNameQuery = ko.observable('');
        self.filterByStatusQuery = ko.observable('');

        //self.statusesFilter = ko.observableArray(
        //    [
        //        {
        //            title: 'active (--)',
        //            count: '--',
        //            href: '#jobs/active',
        //            class: ''
        //        },
        //        {
        //            title: 'successful (--)',
        //            count: '--',
        //            href: '#jobs/successful',
        //            class: ''
        //        },
        //        {
        //            title: 'errored (--)',
        //            count: '--',
        //            href: '#jobs/errored',
        //            class: ''
        //        },
        //        {
        //            title: 'all (--)',
        //            count: '--',
        //            href: '#jobs',
        //            class: 'active'
        //        }
        //    ]
        //);

        //var index = self.statusesFilter.map(function(e) { return e.title; }).indexOf('Nick');
        self.statuses = ko.observableArray(
            [
                'active',
                'successful',
                'errored',
                'all'
            ]
        );
        //self.selectedStatus = ko.observable('all');





        //Set href value of element
        self.selected = ko.observable(null);

        //initial set to show first tabpanel when loading page
        self.init = ko.observable(1);

        //Get href value og element
        self.getHref = function(){
            var target;
            var element = event.target;
            //var element = event.target.data('tab');
            console.log('element', element);
            var $element = $(element);
            console.log('$element', $element);
            var foo = $element.data('tab');
            console.log('foo', foo);

            //var element = event.target.hash;
            target = element.substr(1);
            return target;
        };

        //Show Tabpanel
        self.showBlock = function(){
            var target = self.getHref();
            self.selected(target);
            self.init(2);
        };







        self.selectStatus = function(status) {
            console.log("selectStatus status", status);
            self.selectedStatus(status);
        };



        self.pageIndex = 0;
        self.pageSize = 10;

        if (dev) {
            var jobExecutionsFixture = fixtures.jobExecutions;

            jobExecutionsFixture.forEach(function (jobExecution) {
                var JobExecutionObject = new JobExecution(jobExecution);
                self.jobExecutions.push(JobExecutionObject);
            });
        } else {
            var runner = runnerConfig.getRunnerInstance();
            runner.jobs.find().then(function (jobExecutions) {
                console.log('/////runner returned');

                self.page = jobExecutions.data;
                var jobExecutionsData = self.page.values;
                console.log("jobExecutionsData", jobExecutionsData);

                jobExecutionsData.forEach(function (job) {
                    var jobData = job.data;
                    var observableJob = ko.mapping.fromJS(jobData, jobMappings);
                    self.jobExecutions.push(observableJob);


                    //console.log(job);

                    //var jobData = job.data;

                    //console.log("job.data", job.data);
                    //console.log("job.data.id", job.data.id);
                    //console.log("job.data.name", job.data.name);
                    console.log("job.data.status", job.data.status);

                });

            });
        }


        self.jobExecutionsFilteredByStatus = ko.computed(function () {
            var search = self.filterByStatusQuery().toLowerCase();
            return ko.utils.arrayFilter(self.jobExecutions(), function (job) {
                if (job.status) {
                    return job.status().toLowerCase().indexOf(search) >= 0;
                }
            });
        });

        self.jobExecutionsFilteredByName = ko.computed(function () {
            var search = self.filterByNameQuery().toLowerCase();
            return ko.utils.arrayFilter(self.jobExecutions(), function (jobExecution) {
                if (jobExecution.name) {
                    return jobExecution.name().toLowerCase().indexOf(search) >= 0;
                }
            });
        });

        self.loadNextPage = function () {
            self.page.fetch(self.pageIndex+1, self.pageSize).then(function(nextPage, data) {
                var jobExecutionsData = nextPage.data.values;
                self.jobExecutions([]);
                jobExecutionsData.forEach(function (job) {
                    var jobData = job.data;
                    var observableJob = ko.mapping.fromJS(jobData, mappings);
                    self.jobExecutions.push(observableJob);
                });
                self.pageIndex = self.pageIndex + 1;
            });
        };

        self.loadPreviousPage = function () {
            self.page.fetch(self.pageIndex-1, self.pageSize).then(function(prevPage, data) {
                var jobExecutionsData = prevPage.data.values;
                self.jobExecutions([]);
                jobExecutionsData.forEach(function (job) {
                    var jobData = job.data;
                    var observableJob = ko.mapping.fromJS(jobData, mappings);
                    self.jobExecutions.push(observableJob);
                });
                self.pageIndex = self.pageIndex - 1;
            });
        };

    }

    return {
        viewModel: jobExecutionsViewModel,
        template: template
    };

});

