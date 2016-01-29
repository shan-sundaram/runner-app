define(['knockout', 'mapping', 'text!./job.html', 'fixtures', 'runnerConfig'], function (ko, mapping, template, fixtures, runnerConfig) {

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

    //http://knockoutjs.com/documentation/plugins-mapping.html
    //https://github.com/SteveSanderson/knockout.mapping

    //https://github.com/pkmccaffrey/knockout.mapping
    //https://github.com/crissdev/knockout.mapping

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

        var theId = self.id();
        var theStatus = self.status();
        var theTime = self.createdTime();

        model.duration = ko.computed(function() {
            return theTime;
        }, self);

        model.finished = ko.computed(function() {
            return theTime;
        }, self);

        model.hrefJobStop = ko.computed(function() {
            return '#job/' + theId;
        }, self);

        model.hrefJobKill = ko.computed(function() {
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

    function JobViewModel(params) {
        var self = this;
        var dev = false;

        var jobId = params.id;

        console.log('params.id: ' + jobId);

        self.job = ko.observableArray();

        if (dev) {
            var theFixture = fixtures.job;
            var theJob = new Job(theFixture);
            self.job(theJob);
        } else {
            var runner = runnerConfig.getRunnerInstance();

            runner.jobs.get(jobId).then(function (job) {
                //console.log(RNRrunner);

                console.log('/////RNRrunner 1');
                //console.log(job);

                var jobData = job.data;

                //console.log("job.data", job.data);
                //console.log("job.data.id", job.data.id);
                //console.log("job.data.name", job.data.name);

                var observableJob = ko.mapping.fromJS(jobData, mappings);
                self.job(observableJob);

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

    // Use prototype to declare any public methods
    JobViewModel.prototype.doSomething = function() {

    };

    return {
        viewModel: JobViewModel,
        template: template,
        synchronous: true
    };

});
