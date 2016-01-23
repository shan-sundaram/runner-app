define(['knockout', 'text!./job.html', '/scripts/fixtures.js', 'runner'], function (ko, template, fixtures, RNR) {

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

         //    jobId: 'jobId 33333-333333-33333333',
         //    executionId: 'executionId 33333-333333-33333333',
         //    name: 'Nodejs Server',
         //    status: 'running',
         //    icon: '#icon-play',
         //    user: 'Chris Kent',
         //    duration: '23 min 30 sec',
         //    finished: '2 hours ago'
    }

    function JobViewModel(params) {
        var self = this;
        var dev = false;

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

    return {
        viewModel: JobViewModel,
        template: template
    };
});





var foo = {
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
