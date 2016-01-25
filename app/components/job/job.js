define(['knockout', 'mapping', 'text!./job.html', 'fixtures', 'runnerConfig'], function (ko, mapping, template, fixtures, runnerConfig) {

    //http://knockoutjs.com/documentation/plugins-mapping.html
    //https://github.com/SteveSanderson/knockout.mapping

    //https://github.com/pkmccaffrey/knockout.mapping
    //https://github.com/crissdev/knockout.mapping

    console.log.json = function (parm) {
        console.log(ko.toJSON(parm, null, 4));
    };
    console.log.js = function (parm) {
        console.log(ko.toJS(parm, null, 4));
    };

    var JobViewModel = function (params) {
        var self = this;
        var dev = false;


        self.job = ko.observable({});


        //self.job = ko.observable();
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

        //var jobData;
        var jobId = params.id;
        //self.job = ko.observable();

        //console.log('params.id: ' + jobId);
        if (dev) {
            self.job(fixtures.job);
        } else {
            var RNRrunner = runnerConfig.getRunnerInstance();
            //var context = RNRrunner.context;
            //var token = context.token;
            //var accountAlias = context.accountAlias;
            //var promise = context.Promise(doTheHustle);

            //console.log('RNRrunner:');
            //console.log(RNRrunner);
            //
            //console.log('context:');
            //console.log(context);
            //
            //console.log('token: ' + token);
            //console.log('accountAlias: ' + accountAlias);

            //var promise = RNRrunner.jobs.get(jobId)
            //        .then(function (result) {
            //
            //            // Update Job instance with the result as the underlying model.
            //            //return new RNR.Execution(self.context, result);
            //
            //        }).then(function (result) {
            //
            //            // If a callback was provided, execute.
            //            if (cb) {
            //                cb(result);
            //            }
            //
            //            return result;
            //
            //        });




            RNRrunner.jobs.get(jobId).then(function (job) {
                //jobData = job.data;
                //var jobDataPretty = JSON.stringify(JSON.parse(JSON.stringify(jobData), null, 2));
                //
                console.log('/////RNRrunner 1');
                //console.log(job);
                console.log(self.job);

                var jobData = job.data;
                //console.log(ko.toJSON(jobData));

                var jobDataPretty = ko.toJSON(jobData, null, 4)

                //console.log('jobDataPretty', jobDataPretty);


                //self.job(ko.mapping.toJSON(jobData, null, 2));
                //self.job(ko.mapping.fromJS(jobData, {}, self));

                //self.job = ko.observable();

                //console.log('self.job', self.job);

                //self.job = ko.toJSON(self.job);
                //console.log("self.job", self.job);
                //console.log(ko.toJSON(self.job));

                //console.log("jobDataPretty", jobDataPretty);
                console.log(jobDataPretty);
                //console.log.json(jobDataPretty);


                ko.mapping.fromJS(jobData);
                console.log(self.job);
                //console.log.json(self);

                //console.log('self.job.status', self.job.status);


                self.statusIcon = ko.computed(function () {
                    return statuses[self.job.status]['icon'];
                }, self);

                self.statusClass = ko.computed(function () {
                    return statuses[self.job.status]['class'];
                }, self);


                //console.log(scooby);
                //console.log('job.name(): ' + job.name());
                //console.log('jobData.name: ' + jobData.name);
                //console.log('/////');

                //self.job = new Job(jobData);
            }).then(function (job) {
                console.log('/////RNRrunner 2');
                //console.log(job);
                //
                //jobData = job.data;
                //console.log(jobData);
                //
                //self.job = ko.mapping.fromJSON(JSON.stringify(jobData));
                //console.log(self.job);
                //console.log(ko.toJSON(self.job));
                //
                //self.statusIcon = ko.computed(function () {
                //    return statuses[self.job.status]['icon'];
                //}, self);
                //
                //self.statusClass = ko.computed(function () {
                //    return statuses[self.job.status]['class'];
                //}, self);


                //jobData = job.data;
                //var jobDataPretty = JSON.stringify(JSON.parse(JSON.stringify(jobData), null, 2));
                //
                //console.log('/////jobDataPretty');
                //console.log(jobDataPretty);
                //console.log('job.name(): ' + job.name());
                //console.log('jobData.name: ' + jobData.name);
                //console.log('/////');

                //self.job = new Job(jobData);
            });


            //promise.then(function (job) {
            //    console.log('RNRrunner.jobs.promise');
            //    //jobData = jobDataPretty;
                //jobData = job.data;
                //console.log(jobData);
                //console.log(jobData.id);

                //var jobDataPretty = JSON.stringify(JSON.parse(JSON.stringify(jobData), null, 2));
                //var foo = JSON.stringify(jobData);
                //console.log(foo);
                //var bar = JSON.parse(foo, null, 2);
                ////console.log(bar);
                //var baz = JSON.stringify(bar);
                //console.log(baz);

                //console.log('/////jobDataPretty');
                //console.log(jobDataPretty);
                //console.log('job.name(): ' + job.name());
                //console.log('jobData.name: ' + jobData.name);
                //console.log('/////');
                //
                //console.log('ffffff');
                //console.log(jobData);
                //
                //console.log('ttttttt');
                //console.log(jobData);
                //
                //console.log("doTheHustle");
                //console.log(jobData);
                //var self = this;
                //console.log(JSON.stringify(job.data));
                //
                //self.job = ko.mapping.fromJSON(JSON.stringify(job.data));
                ////ko.mapping.fromJS(foo, {}, self);
                //console.log(self.job);
                //console.log(ko.toJSON(self.job));
                //console.log(jobData.id);
                //console.log(self.job);
                //console.log(self.job.id);

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

                //var statuses = {
                //    ACTIVE: {
                //        icon: '#icon-play',
                //        class: 'running'
                //    },
                //    COMPLETE: {
                //        icon: '#icon-ellipsis',
                //        class: 'success'
                //    },
                //    ERRORED: {
                //        icon: '#icon-exclamation-circle',
                //        class: 'error'
                //    },
                //    STOPPED: {
                //        icon: '#icon-stop',
                //        class: 'error'
                //    },
                //    QUEUED: {
                //        icon: '#icon-ellipsis',
                //        class: 'running'
                //    }
                //};

                //console.log(self.job);

            //    self.statusIcon = ko.computed(function () {
            //        return statuses[self.job.status]['icon'];
            //    }, self);
            //
            //    self.statusClass = ko.computed(function () {
            //        return statuses[self.job.status]['class'];
            //    }, self);
            //
            //
            //}, function (err) {
            //    console.log(err); // Error: "It broke"
            //});


        }

    };

    return {
        viewModel: JobViewModel,
        template: template
    };


});
