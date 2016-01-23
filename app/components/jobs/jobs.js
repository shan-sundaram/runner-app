define(['knockout', 'text!./jobs.html', 'fixtures', 'runner'], function (ko, template, fixtures, RNR) {

    /*
     function Job(params) {
         this.jobId = ko.observable(params.jobId || '—');
         this.name = ko.observable(params.name || '—');
         this.status = ko.observable(params.status || '—');
         this.icon = ko.observable(params.icon || '—');
         this.user = ko.observable(params.user || '—');
         this.duration = ko.observable(params.duration || '—');
         this.finished = ko.observable(params.finished || '—');
     }
     */

    /*
         jobId: 'jobId 33333-333333-33333333',
         executionId: 'executionId 33333-333333-33333333',
         name: 'Nodejs Server',
         status: 'running',
         icon: '#icon-play',
         user: 'Chris Kent',
         duration: '23 min 30 sec',
         finished: '2 hours ago'
     */

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

        this.icon = ko.computed(function () {
            var statuses = {
                ACTIVE: '#icon-play',
                COMPLETE: '#icon-ellipsis',
                ERRORED: '#icon-exclamation-circle',
                STOPPED: '#icon-stop',
                QUEUED: '#icon-ellipsis'
            };
            var thisStatus = this.status();
            console.log('thisStatus: ' + thisStatus);
            var icon = statuses[thisStatus];
            console.log('icon: ' + icon);
            return icon;
        }, this);

        this.class = ko.computed(function () {
            var statuses = {
                ACTIVE: 'running',
                COMPLETE: 'success',
                ERRORED: 'error',
                STOPPED: 'error',
                QUEUED: 'running'
            };
            var thisStatus = this.status();
            console.log('thisStatus: ' + thisStatus);
            var cssClass = statuses[thisStatus];
            console.log('cssClass: ' + cssClass);
            return cssClass;
        }, this);
    }

    function JobsViewModel(params) {
        var self = this;
        var dev = true;

        self.jobs = ko.observable();

        /*fixtures.jobs.forEach(function (job) {
         var jobObject = new Job(job);
         self.jobs.push(jobObject);
         });*/

        var runner = new RNR.Runner({
            token : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBpLXRpZXIzIiwiYXVkIjoidXJuOnRpZXIzLXVzZXJzIiwibmJmIjoxNDUzMTU2NjQ3LCJleHAiOjE0NTQzNjYyNDcsInVuaXF1ZV9uYW1lIjoic2l2YS5wb3B1cmkud2Z0YyIsInVybjp0aWVyMzphY2NvdW50LWFsaWFzIjoiV0ZUQyIsInVybjp0aWVyMzpsb2NhdGlvbi1hbGlhcyI6IlVDMSIsInJvbGUiOiJBY2NvdW50QWRtaW4ifQ.zhIGzDb8yJX_mfWJLvIKBXWlr9LDbpjAypUA60NK2jA',
            accountAlias : 'WFTC'
        });

        if (dev) {
            fixtures.jobs.forEach(function (job) {
                var jobObject = new Job(job);
                self.jobs.push(jobObject);
            });
        } else {
            runner.jobs.find().then(function (page) {
                var pageValues = page.values;
                console.log(pageValues);

                pageValues.forEach(function (job) {
                    var jobData = job.data;
                    var jobDataPretty = JSON.stringify(JSON.parse(JSON.stringify(jobData), null, 2));

                    console.log('/////jobDataPretty');
                    console.log(jobDataPretty);
                    console.log('job.name(): ' + job.name());
                    console.log('jobData.name: ' + jobData.name);
                    console.log('/////');

                    var jobObject = new Job(jobData);
                    self.jobs.push(jobObject);
                });
            });
        }
    }

    return {
        viewModel: JobsViewModel,
        template: template
    };
});


