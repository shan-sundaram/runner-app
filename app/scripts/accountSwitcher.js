define(["knockout", "jquery"], function (ko, $) {
        var AccountSwitcherModel = function () {
            var self = this;

            self.accounts = ko.observableArray([]);

            window.setTimeout(function () {
                var accounts = [
                    {
                        accountAlias: "ROOT",
                        businessName: "My Awesome Business",
                        accountStatus: "active",
                        primaryDataCenter: "QA1",
                        subAccounts: [
                            {
                                accountAlias: "APPL",
                                businessName: "Apple Designed in California",
                                accountStatus: "active",
                                primaryDataCenter: "QA1",
                                subAccounts: [
                                    {
                                        accountAlias: "APLP",
                                        businessName: "iPhone division",
                                        accountStatus: "active",
                                        primaryDataCenter: "QA1",
                                        subAccounts: []
                                    },
                                    {
                                        accountAlias: "APLC",
                                        businessName: "iCar division",
                                        accountStatus: "active",
                                        primaryDataCenter: "QA1",
                                        subAccounts: []
                                    },
                                    {
                                        accountAlias: "APLO",
                                        businessName: "OSX division",
                                        accountStatus: "active",
                                        primaryDataCenter: "QA1",
                                        subAccounts: []
                                    },
                                    {
                                        accountAlias: "APLI",
                                        businessName: "iPad division",
                                        accountStatus: "active",
                                        primaryDataCenter: "QA1",
                                        subAccounts: []
                                    }
                                ]
                            },
                            {
                                accountAlias: "SUB1",
                                businessName: "Sub Account One",
                                accountStatus: "active",
                                primaryDataCenter: "QA1",
                                subAccounts: []
                            },
                            {
                                accountAlias: "SUB2",
                                businessName: "Sub Account Two",
                                accountStatus: "active",
                                primaryDataCenter: "QA1",
                                subAccounts: []
                            },
                            {
                                accountAlias: "SUB3",
                                businessName: "Sub Account Three",
                                accountStatus: "active",
                                primaryDataCenter: "QA1",
                                subAccounts: [
                                    {
                                        accountAlias: "SSUB",
                                        businessName: "Nested Sub Account",
                                        accountStatus: "active",
                                        primaryDataCenter: "QA1",
                                        subAccounts: []
                                    }
                                ]
                            },
                            {
                                accountAlias: "SUB4",
                                businessName: "Sub Account Four",
                                accountStatus: "active",
                                primaryDataCenter: "QA1",
                                subAccounts: [{
                                    accountAlias: "SSB4",
                                    businessName: "Nested Sub Account",
                                    accountStatus: "active",
                                    primaryDataCenter: "QA1",
                                    subAccounts: [{
                                        accountAlias: "NOOB",
                                        businessName: "Really Nested Sub Account",
                                        accountStatus: "active",
                                        primaryDataCenter: "QA1",
                                        subAccounts: []
                                    }]
                                }]
                            },
                            {
                                accountAlias: "SUB5",
                                businessName: "Sub Account Five",
                                accountStatus: "active",
                                primaryDataCenter: "QA1",
                                subAccounts: []
                            },
                            {
                                accountAlias: "SUB6",
                                businessName: "Sub Account Six",
                                accountStatus: "active",
                                primaryDataCenter: "QA1",
                                subAccounts: [{
                                    accountAlias: "FOO",
                                    businessName: "Nested Sub Account",
                                    accountStatus: "active",
                                    primaryDataCenter: "QA1",
                                    subAccounts: []
                                }]
                            },
                            {
                                accountAlias: "SUB7",
                                businessName: "Sub Account Seven",
                                accountStatus: "active",
                                primaryDataCenter: "QA1",
                                subAccounts: []
                            },
                            {
                                accountAlias: "RJP",
                                businessName: "Rick James Productions",
                                accountStatus: "active",
                                primaryDataCenter: "QA1",
                                subAccounts: []
                            },

                        ]
                    }
                ];

                for (var i = 0; i < 100; i++) {
                    accounts[0].subAccounts.push({
                        accountAlias: "G0" + i,
                        businessName: "" + i + " Generated Account for Perf Testing",
                        accountStatus: "active",
                        primaryDataCenter: "QA2",
                        subAccounts: []
                    });
                }

                self.accounts(accounts);
                self.loadingAccounts(false);
            }, 3000);

            self.loadingAccounts = ko.observable(true);
            self.currentAccountAlias = ko.observable('ROOT');
            self.currentAccountAlias.subscribe(function (newValue) {
                console.log(newValue)
            });

            return self;
        };

        ko.applyBindings(new AccountSwitcherModel(), $('account-switcher')[0]);
    }
);


