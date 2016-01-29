define(['knockout', 'mapping', 'text!./jobs.html', 'fixtures', 'runnerConfig'], function (ko, mapping, template, fixtures, runnerConfig) {



    function Job(jobData) {
        this.id = ko.observable(jobData.id || '—');
        this.accountAlias = ko.observable(jobData.accountAlias || '—');
        this.name = ko.observable(jobData.name || '—');
        this.description = ko.observable(jobData.description || '—');
        this.playbook = ko.observable(jobData.playbook || '—');
        this.useDynamicInventory = ko.observable(jobData.useDynamicInventory || '—');
        this.properties = ko.observable(jobData.properties || '—');
        this.status = ko.observable(jobData.status || '—');
        this.createdTime = ko.observable(jobData.createdTime || '—');
        this.lastUpdatedTime = ko.observable(jobData.lastUpdatedTime || '—');
        this.bootstrapKeyPairAlias = ko.observable(jobData.bootstrapKeyPairAlias || '—');
        this.playbookTags = ko.observable(jobData.playbookTags || '—');
        this.executionTtl = ko.observable(jobData.executionTtl || '—');
        this.repository = ko.observable(jobData.repository || '—');
        this.hosts = ko.observable(jobData.hosts || '—');
        this.links = ko.observable(jobData.links || '—');
        this.callbacks = ko.observable(jobData.callbacks || '—');

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

        model.hrefJobStop = ko.computed(function () {
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

    function JobsViewModel(params) {
        var self = this;
        var dev = false;

        self.jobs = ko.observableArray();

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
        self.selectedStatus = ko.observable('all');

        self.selectStatus = function(status) {
            console.log("selectStatus status", status);
            self.selectedStatus(status);
        };



        self.pageIndex = 0;
        self.pageSize = 10;

        if (dev) {
            var jobFixture = fixtures.jobs;

            jobFixture.forEach(function (job) {
                var jobObject = new Job(job);
                self.jobs.push(jobObject);
            });
        } else {
            var runner = runnerConfig.getRunnerInstance();
            runner.jobs.find().then(function (jobs) {
                console.log('/////runner returned');

                self.page = jobs.data;
                var jobsData = self.page.values;
                console.log("jobsData", jobsData);

                jobsData.forEach(function (job) {
                    var jobData = job.data;
                    var observableJob = ko.mapping.fromJS(jobData, jobMappings);
                    self.jobs.push(observableJob);


                    //console.log(job);

                    //var jobData = job.data;

                    //console.log("job.data", job.data);
                    //console.log("job.data.id", job.data.id);
                    //console.log("job.data.name", job.data.name);
                    console.log("job.data.status", job.data.status);

                });

            });
        }


        self.jobsFilteredByStatus = ko.computed(function () {
            var search = self.filterByStatusQuery().toLowerCase();
            return ko.utils.arrayFilter(self.jobs(), function (job) {
                if (job.status) {
                    return job.status().toLowerCase().indexOf(search) >= 0;
                }
            });
        });

        self.jobsFilteredByName = ko.computed(function () {
            var search = self.filterByNameQuery().toLowerCase();
            return ko.utils.arrayFilter(self.jobs(), function (job) {
                if (job.name) {
                    return job.name().toLowerCase().indexOf(search) >= 0;
                }
            });
        });

        self.loadNextPage = function () {
            self.page.fetch(self.pageIndex+1, self.pageSize).then(function(nextPage, data) {
                var jobsData = nextPage.data.values;
                self.jobs([]);
                jobsData.forEach(function (job) {
                    var jobData = job.data;
                    var observableJob = ko.mapping.fromJS(jobData, mappings);
                    self.jobs.push(observableJob);
                });
                self.pageIndex = self.pageIndex + 1;
            });
        };

        self.loadPreviousPage = function () {
            self.page.fetch(self.pageIndex-1, self.pageSize).then(function(prevPage, data) {
                var jobsData = prevPage.data.values;
                self.jobs([]);
                jobsData.forEach(function (job) {
                    var jobData = job.data;
                    var observableJob = ko.mapping.fromJS(jobData, mappings);
                    self.jobs.push(observableJob);
                });
                self.pageIndex = self.pageIndex - 1;
            });
        };

    }

    return {
        viewModel: JobsViewModel,
        template: template
    };

});

