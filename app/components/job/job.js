define(['knockout', 'mapping', 'text!./job.html', 'fixtures', 'runnerConfig'], function (ko, mapping, template, fixtures, runnerConfig) {

    function Job(job) {
        console.log('job object create', job);
        this.id = ko.observable(job.id || '—');
        this.name = ko.observable(job.name || '—');
    }

    //http://knockoutjs.com/documentation/plugins-mapping.html
    //https://github.com/SteveSanderson/knockout.mapping

    //https://github.com/pkmccaffrey/knockout.mapping
    //https://github.com/crissdev/knockout.mapping


    var statuses = {
        ACTIVE: {
            icon: '#icon-play',
            class: 'running'
        },
        COMPLETE: {
            icon: '#icon-ellipsis',
            class: 'success'
        },
        ERRORED: {
            icon: '#icon-exclamation-circle',
            class: 'error'
        },
        STOPPED: {
            icon: '#icon-stop',
            class: 'error'
        },
        QUEUED: {
            icon: '#icon-ellipsis',
            class: 'running'
        }
    };

    function MappingAdditions(data) {
        var self = this;
        var model = ko.mapping.fromJS(data, {}, self);

        var theId = self.id();
        var theStatus = self.status();

        model.duration = ko.computed(function() {
            return self.createdTime();
        }, self);

        model.finished = ko.computed(function() {
            return self.createdTime();
        }, self);

        model.hrefJobStop = ko.computed(function() {
            return '#job/' + theId;
        }, self);

        model.hrefJobKill = ko.computed(function() {
            return '#job/' + theId;
        }, self);

        model.statusIcon = ko.computed(function () {
            return statuses[theStatus]['icon'];
        }, self);
        model.statusClass = ko.computed(function () {
            return statuses[theStatus]['class'];
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
            self.job(new Job(fixtures.job));

        } else {
            var runner = runnerConfig.getRunnerInstance();



            runner.jobs.get(jobId).then(function (job) {
                //console.log(RNRrunner);

                console.log('/////RNRrunner 1');
                //console.log(job);

                var jobData = job.data;
                console.log("job.data", job.data);
                console.log("job.data.id", job.data.id);
                console.log("job.data.name", job.data.name);

                self.job(ko.mapping.fromJS(jobData, mappings));

                console.log('self', self);
                console.log('self.job', self.job());
                console.log('self.job.id', self.job().id());
                console.log('self.job.name', self.job().name());
                console.log('self.job.hrefJobStop', self.job().hrefJobStop());
                console.log('self.job.hrefJobKill', self.job().hrefJobKill());
                console.log('self.job.statusIcon', self.job().statusIcon());
                console.log('self.job.statusClass', self.job().statusClass());
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
