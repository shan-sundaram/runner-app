define(['knockout', 'mapping', 'text!./executions.html', 'fixtures', 'runnerConfig'], function (ko, mapping, template, fixtures, runnerConfig) {


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

    function Execution(data) {
        this.jobId = ko.observable(data.job_id || '—');
        this.executionId = ko.observable(data.execution_id || '—');
        this.accountAlias = ko.observable(data.account_alias || '—');
        this.timers = ko.observable(data.timers || '—');
        this.status = ko.observable(data.status || '—');
        this.repositoryLog = ko.observable(data.repository_log || '—');
        this.failedHosts = ko.observable(data.failed_hosts || '—');
        this.isVpnUsed = ko.observable(data.is_vpn_established || '—');

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

    function MappingAdditions(data) {
        var self = this;
        var model = ko.mapping.fromJS(data, {}, self);

        var theId = self.job_id();
        var theStatus = self.status();

        model.duration = ko.computed(function () {
            return self.timers()[0].start();
        }, self);

        model.finished = ko.computed(function () {
            return self.timers()[0].start();
        }, self);

        model.hrefJobStop = ko.computed(function () {
            return '#job/' + theId;
        }, self);

        model.hrefJobKill = ko.computed(function () {
            return '#job/' + theId;
        }, self);

        model.statusIcon = ko.computed(function () {
            if (statuses[theStatus]) {
                return statuses[theStatus]['statusIcon'];
            } else {
                return "";
            }
        }, self);
        model.statusClass = ko.computed(function () {
            if (statuses[theStatus]) {
                return statuses[theStatus]['statusClass'];
            } else {
                return "";
            }
        }, self);

        model.jobName = ko.computed(function () {
            var runner = runnerConfig.getRunnerInstance();
            var result = '';
            job = runner.jobs.get(theId).then(function (job) {
                return job.name();
            });
        }, self);

        return model;
    }

    var mappings = {
        create: function (options) {
            return new MappingAdditions(options.data);
        }
    };

    function ExecutionsViewModel(params) {
        var self = this;
        var dev = false;


        self.executions = ko.observableArray();
        self.query = ko.observable('');
        self.pageIndex = 0;
        self.pageSize = 10;

        if (dev) {
            var theFixture = fixtures.executions;

            theFixture.forEach(function (execution) {
                var dataObject = new Execution(execution);
                self.executions.push(dataObject);
            });

        } else {
            var runner = runnerConfig.getRunnerInstance();
            runner.executions.find().then(function (executions) {
                self.page = executions.data;
                var excutionsList = self.page.values;

                excutionsList.forEach(function (execution) {
                    var exData = execution.data;
                    var observableExecution = ko.mapping.fromJS(exData, mappings);
                    self.executions.push(observableExecution);
                });
            });


        }

        self.filterItems = ko.computed(function () {
            var search = self.query().toLowerCase();
            return ko.utils.arrayFilter(self.executions(), function (item) {
                return item.job_id().toLowerCase().indexOf(search) >= 0;
            });
        });

        self.loadNextPage = function () {
            self.page.fetch(self.pageIndex+1, self.pageSize).then(function(nextPage, data) {
                var pageData = nextPage.data.values;
                self.executions([]);
                pageData.forEach(function (item) {
                    var data = item.data;
                    var observableItem = ko.mapping.fromJS(data, mappings);
                    self.executions.push(observableItem);
                });
                self.pageIndex = self.pageIndex + 1;
            });
        };

        self.loadPreviousPage = function () {
            self.page.fetch(self.pageIndex-1, self.pageSize).then(function(prevPage, data) {
                var pageData = prevPage.data.values;
                self.executions([]);
                pageData.forEach(function (item) {
                    var data = item.data;
                    var observableItem = ko.mapping.fromJS(data, mappings);
                    self.executions.push(observableItem);
                });
                self.pageIndex = self.pageIndex - 1;
            });
        };

    }

    return {
        viewModel: ExecutionsViewModel,
        template: template
    };

});

