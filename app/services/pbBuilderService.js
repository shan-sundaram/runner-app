( function () {
	'use strict';
		app.factory('pbBuilderService', [ function () {
			var pbBuilder = {};
			var os_List = {name:"Operating System", type:"os", list:[{id:"centOS5",name:"CentOS 5", scriptTag: "\n\n- name: CentOS 5 Build Servers \n  hosts: localhost \n  connection: local \n  roles: \n     - build_clc_server"},{id:"centOS6",name:"CentOS 6", scriptTag: "\n\n- name: CentOS 6 Build Servers \n  hosts: localhost \n  connection: local \n  roles: \n     - build_clc_server"},{id:"debian6",name:"Debian 6", scriptTag: ""},{id:"debian7",name:"Debian 7", scriptTag: ""},{id:"linux5",name:"RedHat Linux 5", scriptTag: ""},{id:"linux6",name:"RedHat Linux 6", scriptTag: ""},{id:"linux7",name:"RedHat Linux 7", scriptTag: ""},{id:"ubuntu12",name:"Ubuntu 12", scriptTag: ""},{id:"ubuntu14",name:"Ubuntu 14", scriptTag: ""},{id:"win2008R2",name:"Windows 2008 R2", scriptTag: ""},{id:"win2012",name:"Windows 2012", scriptTag: ""},{id:"win2012R2",name:"Windows 2012 R2", scriptTag: ""}]};
			var server_list = {name:"Web Server", type:"server",list: [{id:"Apache", name:"Apache Server", scriptTag: "\n\n- name: Build Servers \n  hosts: localhost \n  connection: local \n  roles: \n     - build_clc_server"}, {id: "", name: "Apache Tomcat", scriptTag: ""},{id: "", name: "IIS", scriptTag: ""},{id: "", name: "Node.js", scriptTag: ""}]};
			var db_list = {name:"Database Service", type: "db", list: [{id: "", name:"MySQL", scriptTag:"\n\n- hosts: LAMP\n  gather_facts: true \n  roles:\n    - mysql\n  tags:\n    - mysql"}, {id: "", name: "Orchestrate", scriptTag: ""},{id: "", name: "MS SQL", scriptTag: ""}]};
			var extras_list = {name:"Additional Features", type: "ext",list: [ {id: "", name: "HAProxy", scriptTag: "\n\n- hosts: HAPROXY\n  sudo: yes\n  roles:\n    - haproxy\n  tags:\n    - haproxy"},{id:"", name:"Load Balancer", scriptTag: ""}, {id:"", name:"Object Storage", scriptTag: ""}, {id:"", name:"VLAN/Firewall", scriptTag: ""}]};

			pbBuilder.getOSList = function (){
				return os_List;
			};
			pbBuilder.getServerList = function (){
				return server_list;
			};
			pbBuilder.getDBList = function (){
				return db_list;
			};
			pbBuilder.getExtrasList = function (){
				return extras_list;
			};
			return pbBuilder;
		}]);
}) ();