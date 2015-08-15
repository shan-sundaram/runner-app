( function () {
	'use strict';
		app.factory('pbBuilderService', [ function () {
			var pbBuilder = {};
			var os_List = {name:"Operating System", type:"os", list:[{id:"centOS5",name:"CentOS 5", scriptTag: "\n- name: CentOS 5 Build Servers \n  hosts: localhost \n  connection: local \n  roles: \n     - build_clc_server"},{id:"centOS6",name:"CentOS 6", scriptTag: "\n- name: CentOS 6 Build Servers \n  hosts: localhost \n  connection: local \n  roles: \n     - build_clc_server"},{id:"debian6",name:"Debian 6"},{id:"debian7",name:"Debian 7"},{id:"linux5",name:"RedHat Linux 5"},{id:"linux6",name:"RedHat Linux 6"},{id:"linux7",name:"RedHat Linux 7"},{id:"ubuntu12",name:"Ubuntu 12"},{id:"ubuntu14",name:"Ubuntu 14"},{id:"win2008R2",name:"Windows 2008 R2"},{id:"win2012",name:"Windows 2012"},{id:"win2012R2",name:"Windows 2012 R2"}]};
			var server_list = {name:"Web Server", type:"server",list: [{id:"Apache", name:"Apache Server", scriptTag: "\n- name: Build Servers \n  hosts: localhost \n  connection: local \n  roles: \n     - build_clc_server"}, {id: "", name: "Apache Tomcat"},{id: "", name: "IIS"},{id: "", name: "Node.js"}]};
			var db_list = {name:"Database Service", type: "db", list: [{id: "", name:"MySQL", scriptTag:"\n- hosts: LAMP\n  gather_facts: true \n  roles:\n    - mysql\n  tags:\n    - mysql"}, {id: "", name: "Orchestrate"},{id: "", name: "MS SQL"}]};
			var extras_list = {name:"Additional Features", type: "ext",list: [ {id: "", name: "HAProxy", scriptTag: "\n- hosts: HAPROXY\n  sudo: yes\n  roles:\n    - haproxy\n  tags:\n    - haproxy"},{id:"", name:"Load Balancer"}, {id:"", name:"Object Storage"}, {id:"", name:"VLAN/Firewall"}]};

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