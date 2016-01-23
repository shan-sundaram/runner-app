define(['knockout', 'mapping', 'text!./job.html', 'fixtures', 'runner'], function (ko, mapping, template, fixtures, RNR) {

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

    //http://knockoutjs.com/documentation/plugins-mapping.html
    //https://github.com/SteveSanderson/knockout.mapping

    //https://github.com/pkmccaffrey/knockout.mapping
    //https://github.com/crissdev/knockout.mapping


    var JobViewModelTest = function (data) {
        console.log('JobViewModelTest');
        console.log(data);

        var self = this;

        var jobData = fixtures.job;
        console.log(jobData);

        ko.mapping.fromJS(jobData, {}, self);

        self.hrefJobKill = ko.computed(function () {
            var href = '#job/' + self.id();
            console.log('href: ' + href);
            return href;
        }, self);

        self.hrefJobStop = ko.computed(function () {
            var href = '#job/' + self.id();
            console.log('href: ' + href);
            return href;
        }, self);

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

        self.statusIcon = ko.computed(function () {
            return statuses[self.status()]['icon'];
        }, self);

        self.statusClass = ko.computed(function () {
            return statuses[self.status()]['class'];
        }, self);
    };


/*
    function JobViewModel(params) {
        var self = this;
        var dev = true;

        self.job = ko.observable();

        var runner = new RNR.Runner({
            token : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBpLXRpZXIzIiwiYXVkIjoidXJuOnRpZXIzLXVzZXJzIiwibmJmIjoxNDUzMTU2NjQ3LCJleHAiOjE0NTQzNjYyNDcsInVuaXF1ZV9uYW1lIjoic2l2YS5wb3B1cmkud2Z0YyIsInVybjp0aWVyMzphY2NvdW50LWFsaWFzIjoiV0ZUQyIsInVybjp0aWVyMzpsb2NhdGlvbi1hbGlhcyI6IlVDMSIsInJvbGUiOiJBY2NvdW50QWRtaW4ifQ.zhIGzDb8yJX_mfWJLvIKBXWlr9LDbpjAypUA60NK2jA',
            accountAlias : 'WFTC'
        });

        var idJob = params.id;
        console.log('params.id: ' + idJob);

        if (dev) {
            self.job = new Job(fixtures.job);
        } else {
            runner.jobs.get(idJob).then(function(job){
                var jobData = job.data;
                var jobDataPretty = JSON.stringify(JSON.parse(JSON.stringify(jobData), null, 2));

                console.log('/////jobDataPretty');
                console.log(jobDataPretty);
                console.log('job.name(): ' + job.name());
                console.log('jobData.name: ' + jobData.name);
                console.log('/////');

                self.job = new Job(jobData);
            });
        }
    }
 */

    return {
        viewModel: JobViewModelTest,
        //viewModel: JobViewModel,
        template: template
    };
});


var fake = {
    jobId: 'jobId 33333-333333-33333333',
    executionId: 'executionId 33333-333333-33333333',
    name: 'Nodejs Server',
    status: 'running',
    icon: '#icon-play',
    user: 'Chris Kent',
    duration: '23 min 30 sec',
    finished: '2 hours ago'
};

var real = {
	"id": "56195215-69c8-4b48-b5bb-c5a2512d40a5",
	"accountAlias": "WFTC",
	"name": "Test Multi NIC-1",
	"description": "Test Multi NIC-1",
	"playbook": null,
	"useDynamicInventory": false,
	"properties": {},
	"status": "ACTIVE",
	"createdTime": 1453414212512,
	"lastUpdatedTime": 1453414212512,
	"bootstrapKeyPairAlias": null,
	"playbookTags": null,
	"executionTtl": null,
    "repository": {
        "url": "https://github.com/popurisiva/test-playbook",
        "branch": null,
        "defaultPlaybook": "create_file.yml",
        "credentials": {
            "username": "popurisiva",
            "password": "Sh1vaGit"
        }
    },
    "hosts": [
        {
            "id": "localhost",
            "hostVars": {
                "ansible_connection": "local"
            }
        },
        {
            "id": "UC1WFTCTEST08",
            "hostVars": {
                "ansible_connection": "ssh",
                "ansible_ssh_host": "10.122.35.27"
            }
        }
    ],
    "links": [
        {
            "ref": "self",
            "id": "56195215-69c8-4b48-b5bb-c5a2512d40a5",
            "href": "/jobs/WFTC/56195215-69c8-4b48-b5bb-c5a2512d40a5",
            "verbs": ["GET", "POST", "DELETE"]
        },
        {
            "ref": "self",
            "id": "56195215-69c8-4b48-b5bb-c5a2512d40a5",
            "href": "/jobs/WFTC/56195215-69c8-4b48-b5bb-c5a2512d40a5/executions",
            "verbs": ["GET"]
        }
    ],
    "callbacks": []
};
