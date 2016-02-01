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

        //var idJob = self.idJob();
        //var idJobExecution = self.idJobExecution();
        //var theId = self.id();

        //var theStatus = self.status();

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

        model.hrefJobExecutionStop = ko.computed(function () {
            //#job/0da21734-61e8-48aa-9cad-4e3e13146007/job-execution/ac609d05-10dd-41af-9529-a1b6328044f8/stop
            var retVal = '#job/' + self.job_id() + '/job-execution/' + self.execution_id() + '/stop';
            return retVal;
        }, self);

        model.hrefJobExecutionKill = ko.computed(function () {
            //#job/0da21734-61e8-48aa-9cad-4e3e13146007/job-execution/ac609d05-10dd-41af-9529-a1b6328044f8/kill
            var retVal = '#job/' + self.job_id() + '/job-execution/' + self.execution_id() + '/kill';
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

        return model;
    }

    var jobExecutionMapping = {
        create: function (options) {
            return new JobExecutionMappingAdditions(options.data);
        }
    };

    function JobExecutionViewModel(params) {
        var self = this;
        var dev = false;

        var idJob = params.idJob;
        var idJobExecution = params.idJobExecution;

        //console.log('params.id: ' + jobExecutionId);

        self.jobExecution = ko.observableArray();
        self.job = ko.observableArray();

        if (dev) {
            var jobExecutionData = fixtures.jobExecution;

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
            self.jobExecution(observableJobExecution);
        } else {
            var runner = runnerConfig.getRunnerInstance();

            //given a job_execution_id, get the job.
            //with that job and job_execution_id, get the job_execution

            console.log('idJob', idJob);
            console.log('idJobExecution', idJobExecution);

            runner.jobs.get(idJob).then(function (job) {
                console.log('RUNNER RETURNED: jobs.get');
                var jobData = job.data;
                console.log('jobData', ko.toJSON(jobData, null, 4));

                var observableJob = ko.mapping.fromJS(jobData, {});
                self.job(observableJob);

                job.execution(idJobExecution).then(function (jobExecution) {
                    console.log('RUNNER RETURNED: job.execution');
                    var jobExecutionData = jobExecution.data;
                    console.log('jobExecutionData', ko.toJSON(jobExecutionData, null, 4));

                    var observableJobExecution = ko.mapping.fromJS(jobExecutionData, jobExecutionMapping);
                    self.jobExecution(observableJobExecution);

                });
            });
        }
    }

    function foo() {

    }

    // Use prototype to declare any public methods
    JobExecutionViewModel.prototype.doSomething = function() {

    };

    return {
        viewModel: JobExecutionViewModel,
        template: template
    };

});
