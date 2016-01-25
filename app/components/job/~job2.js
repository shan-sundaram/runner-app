define(['knockout', 'mapping', 'text!./job.html', 'fixtures', 'runnerConfig'], function (ko, mapping, template, fixtures, runnerConfig) {

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




    function JobViewModel(params) {
        var self = this;
        var dev = false;

        var jobData;
        var idJob = params.id;

        console.log('params.id: ' + idJob);


        if (dev) {
            jobData = fixtures.job;
        } else {
            var RNRrunner = runnerConfig.getRunnerInstance();
            var context = RNRrunner.context;
            var token = context.token;
            var accountAlias = context.accountAlias;
            //var promise = context.Promise(doTheHustle);

            console.log('RNRrunner:');
            console.log(RNRrunner);

            console.log('context:');
            console.log(context);

            console.log('token: ' + token);
            console.log('accountAlias: ' + accountAlias);

            var promise = RNRrunner.jobs.get(idJob);

            promise.then(function (job) {
                console.log('RNRrunner.jobs.promise');
                //jobData = jobDataPretty;
                jobData = job.data;
                var jobDataPretty = JSON.stringify(JSON.parse(JSON.stringify(jobData), null, 2));

                console.log('/////jobDataPretty');
                console.log(jobDataPretty);
                console.log('job.name(): ' + job.name());
                console.log('jobData.name: ' + jobData.name);
                console.log('/////');

                console.log('ffffff');
                console.log(jobData);

                console.log('ttttttt');
                console.log(jobData);

                console.log("doTheHustle");
                console.log(jobData);
                //var self = this;

                //ko.mapping.fromJSON(jobData, {}, self);
                ko.mapping.fromJS(jobData, {}, self);

                //self.hrefJobKill = ko.computed(function () {
                //    var href = '#job/' + self.id;
                //    console.log('href: ' + href);
                //    return href;
                //}, self);

                //self.hrefJobStop = ko.computed(function () {
                //    var href = '#job/' + self.id;
                //    console.log('href: ' + href);
                //    return href;
                //}, self);

                self.statusIcon = ko.computed(function () {
                    return statuses[self.status()]['icon'];
                }, self);

                self.statusClass = ko.computed(function () {
                    return statuses[self.status()]['class'];
                }, self);


            }, function (err) {
                console.log(err); // Error: "It broke"
            });


        }
    }

    return {
        viewModel: JobViewModel,
        template: template
    };


});
