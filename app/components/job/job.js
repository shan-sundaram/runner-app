define(['knockout', 'text!./job.html', '/scripts/fixtures.js', 'runner'], function (ko, template, fixtures, RNR) {

    function Job(params) {
        this.jobId = ko.observable(params.jobId || '—');
        this.name = ko.observable(params.name || '—');
        this.status = ko.observable(params.status || '—');
        this.icon = ko.observable(params.icon || '—');
        this.user = ko.observable(params.user || '—');
        this.duration = ko.observable(params.duration || '—');
        this.finished = ko.observable(params.finished || '—');
    }

    function JobViewModel(params) {
        var self = this;

        self.job = new Job(fixtures.job);

        var runner = new RNR.Runner({
            token : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBpLXRpZXIzIiwiYXVkIjoidXJuOnRpZXIzLXVzZXJzIiwibmJmIjoxNDUzMTU2NjQ3LCJleHAiOjE0NTQzNjYyNDcsInVuaXF1ZV9uYW1lIjoic2l2YS5wb3B1cmkud2Z0YyIsInVybjp0aWVyMzphY2NvdW50LWFsaWFzIjoiV0ZUQyIsInVybjp0aWVyMzpsb2NhdGlvbi1hbGlhcyI6IlVDMSIsInJvbGUiOiJBY2NvdW50QWRtaW4ifQ.zhIGzDb8yJX_mfWJLvIKBXWlr9LDbpjAypUA60NK2jA',
            accountAlias : 'WFTC'
        });

        runner.jobs.get('56195215-69c8-4b48-b5bb-c5a2512d40a5').then(function(job){
            console.log('/////');
            console.log(JSON.stringify(JSON.parse(JSON.stringify(job.data), null, 2)));
            console.log(job.name());
            console.log('/////');

        });


    }

    return {
        viewModel: JobViewModel,
        template: template
    };
});


/*

{
	"id": "56195215-69c8-4b48-b5bb-c5a2512d40a5",
	"accountAlias": "WFTC",
	"name": "Test Multi NIC-1",
	"description": "Test Multi NIC-1",
	"repository": {
		"url": "https://github.com/popurisiva/test-playbook",
		"branch": null,
		"defaultPlaybook": "create_file.yml",
		"credentials": {
			"username": "popurisiva",
			"password": "Sh1vaGit"
		}
	},
	"playbook": null,
	"hosts": [{
		"id": "localhost",
		"hostVars": {
			"ansible_connection": "local"
		}
	}, {
		"id": "UC1WFTCTEST08",
		"hostVars": {
			"ansible_connection": "ssh",
			"ansible_ssh_host": "10.122.35.27"
		}
	}],
	"useDynamicInventory": false,
	"properties": {},
	"status": "ACTIVE",
	"callbacks": [],
	"createdTime": 1453414212512,
	"lastUpdatedTime": 1453414212512,
	"bootstrapKeyPairAlias": null,
	"playbookTags": null,
	"executionTtl": null,
	"links": [{
		"ref": "self",
		"id": "56195215-69c8-4b48-b5bb-c5a2512d40a5",
		"href": "/jobs/WFTC/56195215-69c8-4b48-b5bb-c5a2512d40a5",
		"verbs": ["GET", "POST", "DELETE"]
	}, {
		"ref": "self",
		"id": "56195215-69c8-4b48-b5bb-c5a2512d40a5",
		"href": "/jobs/WFTC/56195215-69c8-4b48-b5bb-c5a2512d40a5/executions",
		"verbs": ["GET"]
	}]
}}*/
