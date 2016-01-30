define({

    jobExecution: {
        "id": "56195215-69c8-4b48-b5bb-c5a2512d40a5",
        "name": "Test Multi NIC-1",
        "status": "ACTIVE",
        "createdTime": 1453414212512,
        "lastUpdatedTime": 1453414212512,

        "accountAlias": "WFTC",
        "description": "Test Multi NIC-1",
        "playbook": null,
        "useDynamicInventory": false,
        "properties": {},
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
    },
    jobExecutions: [
        {
            id: "56195215-69c8-4b48-b5bb-c5a2512d40a5",
            name: 'Inline Playbook Test',
            status: 'success',
            createdTime: 1453414212512,
            lastUpdatedTime: 1453414212512
        },
        {
            id: "56195215-69c8-4b48-b5bb-c5a2512d40a5",
            name: 'Redhat Linux Hyperscale Server',
            status: 'failure',
            createdTime: 1453414212512,
            lastUpdatedTime: 1453414212512
        },
        {
            id: "56195215-69c8-4b48-b5bb-c5a2512d40a5",
            name: 'Nodejs Server',
            status: 'pending',
            createdTime: 1453414212512,
            lastUpdatedTime: 1453414212512
        },
        {
            id: "56195215-69c8-4b48-b5bb-c5a2512d40a5",
            name: 'Nodejs Server',
            status: 'initializing',
            createdTime: 1453414212512,
            lastUpdatedTime: 1453414212512
        },
        {
            id: "56195215-69c8-4b48-b5bb-c5a2512d40a5",
            name: 'Redhat Linux Hyperscale Server',
            status: 'running',
            createdTime: 1453414212512,
            lastUpdatedTime: 1453414212512
        },
        {
            id: "56195215-69c8-4b48-b5bb-c5a2512d40a5",
            name: 'Redhat Linux Hyperscale Server',
            status: 'stopping',
            createdTime: 1453414212512,
            lastUpdatedTime: 1453414212512
        },
        {
            id: "56195215-69c8-4b48-b5bb-c5a2512d40a5",
            name: 'Nodejs Serve',
            status: 'stopped',
            createdTime: 1453414212512,
            lastUpdatedTime: 1453414212512
        },
        {
            id: "56195215-69c8-4b48-b5bb-c5a2512d40a5",
            name: 'Redhat Linux Hyperscale Server',
            status: 'killing',
            createdTime: 1453414212512,
            lastUpdatedTime: 1453414212512
        },
        {
            id: "56195215-69c8-4b48-b5bb-c5a2512d40a5",
            name: 'Nodejs Serve',
            status: 'killed',
            createdTime: 1453414212512,
            lastUpdatedTime: 1453414212512
        }
    ],
    job: {
        id: '1',
        name: 'Nodejs Server',
        description: 'Create a lightweight server that can handle a great number of simultaneous requests',
        image: '/assets/svg/logo-nodejs-color.svg',
        version: 'v1.1',
        githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
        githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
        updated: 'Nov 1, 2015',
        countDeploy: '20',
        countFork: '2',
        countStar: '21',
        featuredClass: 'nginx',
        privacy: 'public'
    },
    jobs: [
        {
            id: '1',
            name: 'Nodejs Server',
            description: 'Create a lightweight server that can handle a great number of simultaneous requests',
            image: '/assets/svg/logo-nodejs-color.svg',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'nginx',
            privacy: 'public'
        },
        {
            id: '2',
            name: 'Clustered LAMP Server',
            description: 'The platform of choice for dev and deployment of high performance web apps',
            image: '/assets/img/logo-lamp-color.png',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'kubernetes',
            privacy: 'public'

        },
        {
            id: '3',
            name: 'Windows Hyperscale Server',
            description: 'The platform of choice for dev and deployment of high performance web apps',
            image: '/assets/svg/logo-windows-color.svg',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'nginx',
            privacy: 'public'

        },
        {
            id: '4',
            name: 'Redhat Linux Hyperscale Server',
            description: 'The platform of choice for dev and deployment of high performance web apps',
            image: '/assets/svg/logo-redhat-color.svg',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'kubernetes',
            privacy: 'public'

        },
        {
            id: '5',
            name: 'Nodejs Server',
            description: 'Create a lightweight server that can handle a great number of simultaneous requests',
            image: '/assets/svg/logo-nodejs-color.svg',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'nginx',
            privacy: 'public'

        },
        {
            id: '6',
            image: '/assets/img/logo-lamp-color.png',
            name: 'Clustered LAMP Server',
            description: 'The platform of choice for dev and deployment of high performance web apps',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'kubernetes',
            privacy: 'public'

        },
        {
            id: '7',
            name: 'Windows Hyperscale Server',
            description: 'The platform of choice for dev and deployment of high performance web apps',
            image: '/assets/svg/logo-windows-color.svg',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'nginx',
            privacy: 'public'

        },
        {
            id: '8',
            name: 'Redhat Linux Hyperscale Server',
            description: 'The platform of choice for dev and deployment of high performance web apps',
            image: '/assets/svg/logo-redhat-color.svg',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'kubernetes',
            privacy: 'public'

        },
        {
            id: '9',
            name: 'Nodejs Server',
            description: 'Create a lightweight server that can handle a great number of simultaneous requests',
            image: '/assets/svg/logo-nodejs-color.svg',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'nginx',
            privacy: 'public'

        },
        {
            id: '10',
            name: 'Clustered LAMP Server',
            description: 'The platform of choice for dev and deployment of high performance web apps',
            image: '/assets/img/logo-lamp-color.png',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'kubernetes',
            privacy: 'public'

        },
        {
            id: '11',
            name: 'Windows Hyperscale Server',
            description: 'The platform of choice for dev and deployment of high performance web apps',
            image: '/assets/svg/logo-windows-color.svg',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'nginx',
            privacy: 'public'

        },
        {
            id: '12',
            name: 'Redhat Linux Hyperscale Server',
            description: 'The platform of choice for dev and deployment of high performance web apps',
            image: '/assets/svg/logo-redhat-color.svg',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'kubernetes',
            privacy: 'public'

        }
    ],
    jobsFeatured: [
        {
            id: '100',
            name: 'Create a Kubernetes Node',
            description: 'Manage a cluster of Linux containers as a single system to accelerate Dev and simplify Ops.',
            image: '/assets/svg/logo-kubernetes.svg',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'kubernetes',
            privacy: 'public'

        },
        {
            id: '101',
            name: 'Create a NGINX Server',
            description: 'The world’s most popular open source web server for high traffic sites, powering over 100 million properties.',
            image: '/assets/svg/logo-nginx.svg',
            version: 'v1.1',
            githubUrlRepo: 'https://github.com/AnsibleShipyard/ansible-nodejs',
            githubUrlMd: 'https://github.com/AnsibleShipyard/ansible-nodejs/blob/master/README.md',
            updated: 'Nov 1, 2015',
            countDeploy: '20',
            countFork: '2',
            countStar: '21',
            featuredClass: 'nginx',
            privacy: 'public'

        }
    ],
    activities: [
        {
            date: 'Tuesday Sep 29',
            time: '2:50:05 PM',
            description: '"DB-Dev" was deleted.',
            user: 'mark.lee'
        },
        {
            date: 'Tuesday Sep 28',
            time: '3:21:05 PM',
            description: '"DB-QA" was deleted.',
            user: 'other.dude'
        }
    ]
});

