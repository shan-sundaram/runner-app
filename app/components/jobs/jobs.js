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
        COMPLETE: {
            statusIcon: '#icon-ellipsis',
            statusClass: 'success'
        },
        ERRORED: {
            statusIcon: '#icon-exclamation-circle',
            statusClass: 'error'
        },
        STOPPED: {
            statusIcon: '#icon-stop',
            statusClass: 'error'
        },
        QUEUED: {
            statusIcon: '#icon-ellipsis',
            statusClass: 'running'
        }
    };

    function MappingAdditions(data) {
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

    var mappings = {
        create: function (options) {
            return new MappingAdditions(options.data);
        }
    };

    function JobsViewModel(params) {
        var self = this;
        var dev = false;

        //var jobId = params.id;

        //console.log('params.id: ' + jobId);

        self.jobs = ko.observableArray();

        if (dev) {
            var theFixture = fixtures.jobs;

            theFixture.forEach(function (job) {
                var jobObject = new Job(job);
                self.jobs.push(jobObject);
            });

        } else {
            var runner = runnerConfig.getRunnerInstance();
            runner.jobs.find().then(function (jobs) {
                var jobsData = jobs.data.values;
                console.log("jobsData", jobsData);

                //runner.jobs.get().then(function (job) {
                //console.log(RNRrunner);

                jobsData.forEach(function (job) {
                    var jobData = job.data;
                    var observableJob = ko.mapping.fromJS(jobData, mappings);
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


        }

    }

    return {
        viewModel: JobsViewModel,
        template: template
    };

});

