define([
    'knockout',
    'knockoutMapping',
    'text!./job-execution.html',
    'runnerConfig',
    'moment',
    'momentDurationFormat',
    'fixtures'
], function (
        ko,
        knockoutMapping,
        template,
        runnerConfig,
        moment,
        momentDurationFormat,
        fixtures
) {
    //http://knockoutjs.com/documentation/plugins-mapping.html
    //https://github.com/SteveSanderson/knockout.mapping

    //https://github.com/pkmccaffrey/knockout.mapping
    //https://github.com/crissdev/knockout.mapping

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

    function JobExecutionMappingAdditions(data) {
        var self = this;
        var model = ko.mapping.fromJS(data, {}, self);

        var theId = self.id();
        var theStatus = self.status();

        model.duration = ko.computed(function () {
            var fudgeFactorForTesting = 1234567;
            var lastUpdatedTime = self.lastUpdatedTime();
            var createdTime = self.createdTime() - fudgeFactorForTesting;

            if (lastUpdatedTime === createdTime) {
                console.log('duration instant');
                return 'instant';
            }

            var lastUpdatedMoment = moment(lastUpdatedTime);
            //console.log('lastUpdatedMoment', lastUpdatedMoment.format("ddd, MMM Do YYYY, h:mm:ss a"));
            var createdMoment = moment(createdTime);
            //console.log('createdMoment', createdMoment.format("ddd, MMM Do YYYY, h:mm:ss a"));
            var durationInMilliseconds = lastUpdatedMoment.diff(createdMoment);
            //console.log('durationInMilliseconds', durationInMilliseconds);
            var durationMoment = moment.duration(durationInMilliseconds);
            //console.log('durationMoment', durationMoment);
            //var durationMomentHumanize = durationMoment.humanize();
            //console.log('durationMomentHumanize', durationMomentHumanize);
            var durationMomentFormat = durationMoment.format('d [day] h [hr] m [min] s [sec]');
            //console.log('durationMomentFormat', durationMomentFormat);

            console.log('duration', durationMomentFormat);
            return durationMomentFormat;
        }, self);

        model.finished = ko.computed(function () {
            var lastUpdatedTime = self.lastUpdatedTime();
            var lastUpdatedMoment = moment(lastUpdatedTime);
            var nowMoment = moment();

            var durationInMilliseconds = nowMoment.diff(lastUpdatedMoment);
            //console.log('durationInMilliseconds', durationInMilliseconds);
            var durationMoment = moment.duration(durationInMilliseconds);
            //console.log('durationMoment', durationMoment);
            var durationMomentFormat = durationMoment.format('d [day] h [hr] m [min] s [sec]') + ' ago';
            //console.log('durationMomentFormat', durationMomentFormat);

            console.log('finished', durationMomentFormat);
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
        model.statusClass = ko.computed(function () {
            return statuses[theStatus]['statusClass'];
        }, self);

        return model;
    }

    var jobExecutionMapping = {
        create: function (options) {
            return new JobExecutionMappingAdditions(options.data);
        }
    };

    function JobExecutionViewModel(params) {
        var self = this;
        var dev = true;

        var jobExecutionId = params.id;

        //console.log('params.id: ' + jobExecutionId);

        self.jobExecution = ko.observableArray();

        if (dev) {
            var jobExecutionData = fixtures.jobExecution;

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


            var observableJobExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
            self.jobExecution(observableJobExecution);
        } else {
            var runner = runnerConfig.getRunnerInstance();

            runner.jobs.get(jobExecutionId).then(function (jobExecution) {
                console.log('RUNNER RETURNED');
                var jobExecutionData = jobExecution.data;
                var observableJobExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                self.jobExecution(observableJobExecution);
            });
        }
    }

    // Use prototype to declare any public methods
    JobExecutionViewModel.prototype.doSomething = function() {

    };

    return {
        viewModel: JobExecutionViewModel,
        template: template
    };

});
