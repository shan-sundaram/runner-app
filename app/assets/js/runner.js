(function(){
	var RNR = (function(module) {
		'use strict';

		/**
		 * @namespace RNR
		 */

		/**
		 * Interceptor to handle adding authorization elements to the request.
		 */
		var PreInvokeAuthInterceptor = function(context) {
			this.context = context;

			return function(xhr) {
				xhr.setRequestHeader('Authorization', ['Bearer', context.token].join(' '));
			};

		};

		var postInvokeInterceptor200 = function(xhr, success, error) {
			if(xhr.status === 200 && success) success(JSON.parse(xhr.responseText));
		}

		var postInvokeInterceptor204 = function(xhr, success, error) {
			if(xhr.status === 204 && success) success({});
		}

		var postInvokeInterceptor400 = function(xhr, success, error) {
			if(xhr.status === 400 && error) error(xhr.status);
		}

		var postInvokeInterceptor401 = function(xhr, success, error) {
			if(xhr.status === 401 && error) error(xhr.status);
		}

		var postInvokeInterceptor404 = function(xhr, success, error) {
			if(xhr.status === 404 && error) error(xhr.status);
		}

		/**
		 * Adapter to execute restful calls.
		 */
		var Rest = function() {
			this.request = XMLHttpRequest;
			this.preInvokeInterceptors = [];
			this.postInvokeInterceptors = [
				postInvokeInterceptor200,
				postInvokeInterceptor204,
				postInvokeInterceptor400,
				postInvokeInterceptor401,
				postInvokeInterceptor404
			];
		};

		Rest.prototype.get = function(path, parameters, success, error){
			this.execute(path.join('/'), 'GET', parameters, null, success, error);
		};

		Rest.prototype.post = function(path, parameters, data, success, error){
			this.execute(path.join('/'), 'POST', parameters, data, success, error);
		};

		Rest.prototype.put = function(path, parameters, data, success, error){
			this.execute(path.join('/'), 'PUT', parameters, data, success, error);
		};

		Rest.prototype.execute = function(url, method, parameters, data, success, error) {

			var self = this;

			// Create query string if required.
			var query = [];
			for (var property in parameters) {
				if (parameters.hasOwnProperty(property)) {

					if(query.length > 0) {
						query.push('&');
					}

					query.push(property);
					query.push('=');
					query.push(encodeURIComponent(String(parameters[property])));

				}
			}

			if(query.length > 0) {
				url = [url, query.join('')].join('?');
			}

			var payload = data ? JSON.stringify(data) : null;
			var xhr = new this.request();
			xhr.open(method, url, true);

			if(payload) {
				xhr.setRequestHeader('Content-type','application/json');
			}

			self.preInvokeInterceptors.forEach(function(item){item(xhr)});

			xhr.onload = function(){
				self.postInvokeInterceptors.forEach(function(item){item(xhr, success, error)});
			};

			xhr.onerror = function(){
				if(error) {
					error(xhr.status);
				}
			};

			xhr.send(payload);

		};

		/**
		 * Retrieve a property value, or sets a property value is supplied.
		 *
		 * @param {Object} self - The instance's this reference.
		 * @param {Object} target - The target to get the property from.
		 * @param {string} property - The property to retrieve.
		 * @param {Object} dflt - The default to supply if the property is not defined.
		 * @returns {Function} - A function to retrieve or set a property.
		 */
		var getOrSet = function(self, target, property, dflt) {

			return function(value) {

				if(value !== undefined) {
					target[property] = value;
					return self;
				}

				value = target[property];

				if(!value) {
					value = target[property] = dflt;
				}

				return value;

			};

		};

		/**
		 * A callback to support job operations.
		 *
		 * @memberof RNR
		 * @callback jobOnSuccess
		 * @param {RNR.Job} job - The job model.
		 */

		/**
		 * A callback to support jobs operations.
		 *
		 * @memberof RNR
		 * @callback jobsOnSuccess
		 * @param {RNR.Page<RNR.Job>} jobs - The job models.
		 */

		/**
		 * A callback to support execution operations.
		 *
		 * @memberof RNR
		 * @callback executionOnSuccess
		 * @param {RNR.Execution} execution - The execution model.
		 */

		/**
		 * A callback to support execution operations.
		 *
		 * @memberof RNR
		 * @callback executionsOnSuccess
		 * @param {RNR.Page<RNR.Execution>} execution - The execution models.
		 */

		/**
		 * A callback to support status operations.
		 *
		 * @memberof RNR
		 * @callback statusesOnSuccess
		 * @param {RNR.Page<RNR.Status>} status - The status models.
		 */

		/**
		 * A callback to support paging fetch operations.
		 *
		 * @memberof RNR
		 * @callback pageFetch
		 * @param {Number} page - The page in the series to fetch.
		 * @param {Number} size - The size of the page to fetch.
		 * @returns {Promise<RNR.Page<?>>} - The requested page.
		 */

		/**
		 * Pagination page representation.
		 *
		 * @memberof RNR
		 * @property {Number} data.page - The current page.
		 * @property {Number} data.size - The page size.
		 * @property {Number} data.totalSize - The total size of the series.
		 * @property {Array} data.values - The page data values.
		 * @property {RNR.pageFetch} data.fetch - Callback to fetch a page in the series.
		 * @param {Object} options - The page content and pagination callbacks.
		 * @constructor
		 */
		var Page = module.Page = function(context, options) {
			this.data = options || {};
			this.page = getOrSet(this, this.data, 'page', 0);
			this.size = getOrSet(this, this.data, 'size', 0);
			this.totalSize = getOrSet(this, this.data, 'totalSize', 0);
			this.values = getOrSet(this, this.data, 'values', []);
			this.fetch = getOrSet(this, this.data, 'fetch', function(page, size){});
		};

		/**
		 * Get the next page in the series.
		 *
		 * @returns {Promise<RNR.Page<?>>} - The next page.
		 */
		Page.prototype.next = function() {
			return this.fetch()(this.page() + 1, this.size());
		};

		/**
		 * Get the previous page in the series.
		 *
		 * @returns {Promise<RNR.Page<?>>} - The previous page.
		 */
		Page.prototype.previous = function() {
			return this.fetch()(this.page() - 1, this.size());
		};

		/**
		 * Get the first page in the series.
		 *
		 * @returns {Promise<RNR.Page<?>>} - The first page.
		 */
		Page.prototype.first = function() {
			return this.fetch()(0, this.size());
		};

		/**
		 * Get the last page in the series.
		 *
		 * @returns {Promise<RNR.Page<?>>} - The last page.
		 */
		Page.prototype.last = function() {
			return this.fetch()(this.totalSize() / this.size(), this.size());
		};

		/**
		 * Provides status operations.
		 *
		 * @memberof RNR
		 * @property {string} data.id - The status identifier.
		 * @property {Number} data.timestamp - The timestamp the status event was recorded.
		 * @property {Array} data.notifications - Notifications generated by the status.
		 * @property {Object} data.message - The complex status message content.
		 * @property {string} data.jobId - The job id that generated the status event.
		 * @property {Object} data.executionId - The job execution that generated the status event.
		 * @property {string} data.accountAlias - The account alias.
		 * @property {string} data.eventType - The event type associated with the status event.
		 *
		 * @param {Object} context - The runner context.
		 * @param {Object} options - Initial data property options.
		 * @constructor
		 */
		var Status = module.Status = function(context, options) {
			this.context = context;
			this.data = (options || {});
			this.id = getOrSet(this, this.data, 'id', null);
			this.timestamp = getOrSet(this, this.data, 'timestamp', null);
			this.notifications = getOrSet(this, this.data, 'notifications', []);
			this.message = getOrSet(this, this.data, 'message', {});
			this.jobId = getOrSet(this, this.data, 'job_id', null);
			this.executionId = getOrSet(this, this.data, 'execution_id', null);
			this.accountAlias = getOrSet(this, this.data, 'account_alias', null);
			this.eventType = getOrSet(this, this.data, 'event_type', null);
		};

		/**
		 * Provides execution related operations like refresh.
		 *
		 * @memberof RNR
		 * @property {string} data.jobId - The job id this execution is related to.
		 * @property {Object} data.executionId - The execution identifier.
		 * @property {string} data.accountAlias - The account alias.
		 * @property {Array} data.timers - Any timers associated with this execution instance.
		 * @property {string} data.status - The status of the execution.
		 * @property {string} data.repositoryLog - The repository log info from the git repository used by the execution.
		 * @property {Array} data.failedHosts - Any failed hosts associated with the execution instance.
		 * @property {boolean} data.vpnConnection - Indicates if a VPN connection was established during the execution.
		 *
		 * @param {Object} context - The runner context.
		 * @param {Object} options - Initial data property options.
		 * @constructor
		 */
		var Execution = module.Execution = function(context, options) {
			this.context = context;
			this.data = (options || {});
			this.jobId = getOrSet(this, this.data, 'job_id', null);
			this.executionId = getOrSet(this, this.data, 'execution_id', null);
			this.accountAlias = getOrSet(this, this.data, 'account_alias', null);
			this.timers = getOrSet(this, this.data, 'timers', []);
			this.status = getOrSet(this, this.data, 'status', null);
			this.repositoryLog = getOrSet(this, this.data, 'repository_log', null);
			this.failedHosts = getOrSet(this, this.data, 'failed_hosts', []);
			this.vpnConnection = getOrSet(this, this.data, 'is_vpn_established', false);

		};

		/**
		 * Stop an execution instance.
		 *
		 * @param {long} expiryDuration - Indicates how long the system should attempt to stop the request.
		 * @param {RNR.executionOnSuccess} cb - Callback invoked when the stop operation is successful.
		 * @returns {Promise<RNR.Execution>} - The execution instance.
		 */
		Execution.prototype.stop = function(expiryDuration, cb) {

			var self = this;

			var options = {
				expiryDuration : expiryDuration
			};

			return new this.context.Promise(function(resolve, reject) {

				var path = [self.context.endpoint, 'jobs', self.context.accountAlias,
					self.jobId(), 'executions', self.executionId(), 'stop'];

				self.context.rest.post(path, null, options, resolve, reject);

			}).then(function(result){

				// Update Job instance with the result as the underlying model.
				return new RNR.Execution(self.context, result);

			}).then(function(result) {

				// If a callback was provided, execute.
				if(cb) { cb(result); }

				return result;

			});
		};

		/**
		 * Kill an execution instance.
		 *
		 * @param {long} expiryDuration - Indicates how long the system should attempt to kill the request.
		 * @param {RNR.executionOnSuccess} cb - Callback invoked when the kill operation is successful.
		 * @returns {Promise<RNR.Execution>} - The execution instance.
		 */
		Execution.prototype.kill = function(expiryDuration, cb) {

			var self = this;

			var options = {
				expiryDuration : expiryDuration
			};

			return new this.context.Promise(function(resolve, reject) {

				var path = [self.context.endpoint, 'jobs', self.context.accountAlias,
					self.jobId(), 'executions', self.executionId(), 'kill'];

				self.context.rest.post(path, null, options, resolve, reject);

			}).then(function(result){

				// Update Job instance with the result as the underlying model.
				return new RNR.Execution(self.context, result);

			}).then(function(result) {

				// If a callback was provided, execute.
				if(cb) { cb(result); }

				return result;

			});

		};

		/**
		 * Gets all status models related to the execution instance.
		 *
		 * @param {Object} options - Find operation options.
		 * @param {Number} options.page - The page to retrieve, defaults to 0.
		 * @param {Number} options.size - The page size to retrieve, defaults to 10.
		 * @param {RNR.statusesOnSuccess} cb - Callback invoked when the kill operation is successful.
		 * @returns {Promise<RNR.Page<RNR.Status>>} - The status models.
		 */
		Execution.prototype.statuses = function(options, cb){

			var self = this;
			self.options = options || {};

			if(!self.options.page) {
				self.options.page = 0;
			}

			if(!self.options.size) {
				self.options.size = 10;
			}

			return new this.context.Promise(function(resolve, reject) {

				var parameters = {
					page : String(self.options.page),
					size : String(self.options.size)
				};

				// The rest type will convert this array to a '/' separated string.
				var path = [self.context.endpoint, 'status', self.context.accountAlias,
					'job', self.jobId(), 'execution', self.executionId()];

				self.context.rest.get(path, parameters, resolve, reject);

			}).then(function(result){

				if(Array.isArray(result)) {

					return new Page(self.context)
						.page(0)
						.size(result.length)
						.totalSize(result.length)
						.values(result.map(function(item){
							// Transform the plain data object to a new Status type.
							return new RNR.Status(self.context, item);
						}))
						// Setup the fetch operation on the page instance.
						.fetch(function(page, size){
							return self.statuses({page : page, size : size});
						});

				}

				// Create a new Page instance with the result as the underlying model.
				return new Page(self.context)
					.page(result.page)
					.size(result.size)
					.totalSize(result.totalSize)
					.values(result.results.map(function(item){
						// Transform the plain data object to a new Status type.
						return new RNR.Status(self.context, item);
					}))
					// Setup the fetch operation on the page instance.
					.fetch(function(page, size){
						return self.statuses({page : page, size : size});
					});

			}).then(function(result) {

				// If a callback was provided, execute.
				if(cb) { cb(result); }

				return result;

			});

		};

		/**
		 * Provides job related operations like get and find.
		 *
		 * @memberof RNR
		 * @param {Object} context - The runner context.
		 * @constructor
		 */
		var Jobs = module.Jobs = function(context) {
			this.context = context;
		};

		/**
		 * Get a job from the repository.
		 *
		 * @param {string} jobId - The job identifier to lookup.
		 * @param {RNR.jobOnSuccess} cb - Callback invoked when the operation is successful.
		 * @returns {Promise<RNR.Job>} - The persisted job instance.
		 */
		Jobs.prototype.get = function(jobId, cb) {

			var self = this;

			return new this.context.Promise(function(resolve, reject) {

				var path = [self.context.endpoint, 'jobs', self.context.accountAlias, jobId];
				self.context.rest.get(path, null, resolve, reject);

			}).then(function(result){

				// Create a new Job instance with the result as the underlying model.
				return new Job(self.context, result);

			}).then(function(result) {

				// If a callback was provided, execute.
				if(cb) { cb(result); }

				return result;

			});

		};

		/**
		 * Find jobs from the repository.
		 *
		 * @param {Object} options - Find operation options.
		 * @param {Number} options.page - The page to retrieve, defaults to 0.
		 * @param {Number} options.size - The page size to retrieve, defaults to 10.
		 * @param {RNR.jobsOnSuccess} cb - Callback invoked when the operation is successful.
		 * @returns {Promise<RNR.Page<RNR.Job>>} - A page of data, or a page of 0 values if no data is available.
		 */
		Jobs.prototype.find = function(options, cb) {

			var self = this;
			self.options = options || {};

			if(!self.options.page) {
				self.options.page = 0;
			}

			if(!self.options.size) {
				self.options.size = 10;
			}

			return new this.context.Promise(function(resolve, reject) {

				var parameters = {
					page : String(self.options.page),
					size : String(self.options.size)
				};

				// The rest type will convert this array to a '/' separated string.
				var path = [self.context.endpoint, 'jobs', self.context.accountAlias];

				self.context.rest.get(path, parameters, resolve, reject);

			}).then(function(result){

				// Create a new Page instance with the result as the underlying model.
				return new Page(self.context)
					.page(result.page)
					.size(result.size)
					.totalSize(result.totalSize)
					.values(result.results.map(function(item){
						// Transform the plain data object to a new Job type.
						return new RNR.Job(self.context, item);
					}))
					// Setup the fetch operation on the page instance.
					.fetch(function(page, size){
						return self.find({page : page, size : size});
					});

			}).then(function(result) {

				// If a callback was provided, execute.
				if(cb) { cb(result); }

				return result;

			});

		};

		/**
		 * Provides job related operations like create, start, stop and kill.
		 *
		 * @memberof RNR
		 * @property {string} data.name - The job name.
		 * @property {string} data.description - A string defining the job.
		 * @property {Object} data.repository - The playbook repository definition.
		 * @property {string} data.repository.url - The playbook repository git URL.
		 * @property {string} data.repository.branch - The playbook repository branch if applicable. If not supplied, the default branch is used.
		 * @property {string} data.repository.defaultPlaybook - The path to the playbook from the repository root. Defaults to playbook.yml.
		 * @property {Object} data.repository.credentials - The playbook repository credentials. Only required if the repository is not public.
		 * @property {string} data.repository.credentials.username - The username that will be used to access the playbook repository.
		 * @property {string} data.repository.credentials.password - The password that will be used to access the playbook repository.
		 * @property {string} data.repository.credentials.sshPrivateKey - The ssh private key that will be used to access the playbook repository.
		 * @property {Array} data.hosts - An optional list of inventory hosts.
		 * @property {string} data.hosts.id - An identified for the host.
		 * @property {Object} data.hosts.hostVars - Optional playbook variables to be applied to the host.
		 * @property {string} data.hosts.sshPrivateKey - An optional key to be used to access the host.
		 * @property {boolean} data.useDynamicInventory - Indicates the job should load dynamic inventory for the account.
		 * @property {Object} data.properties - Optional playbook variables to be applied to all hosts.
		 * @property {Array} data.callbacks - An optional list callbacks to be notified of status updates.
		 * @property {string} data.callbacks.url - The URL endpoint to POST callbacks.
		 * @property {string} data.callbacks.level - The status level to notify on. DEBUG, ERROR or RESULT.
		 *
		 * @param {Object} context - The runner context.
		 * @param {Object} options - Initial data property options.
		 * @constructor
		 */
		var Job = module.Job = function(context, options) {
			this.context = context;
			this.data = (options || {});
			this.id = getOrSet(this, this.data, 'id', null);
			this.name = getOrSet(this, this.data, 'name', null);
			this.description = getOrSet(this, this.data, 'description', null);
			this.repository = getOrSet(this, this.data, 'repository', {});
			this.hosts = getOrSet(this, this.data, 'hosts', []);
			this.useDynamicInventory = getOrSet(this, this.data, 'useDynamicInventory', false);
			this.properties = getOrSet(this, this.data, 'properties', {});
			this.callbacks = getOrSet(this, this.data, 'callbacks', []);
		};

		/**
		 * Create a new job, persisting the configuration.
		 *
		 * @param {RNR.jobOnSuccess} cb - Callback invoked when the operation is successful.
		 * @returns {Promise<RNR.Job>} - The persisted job instance.
		 */
		Job.prototype.create = function(cb) {

			var self = this;

			return new this.context.Promise(function(resolve, reject) {

				var path = [self.context.endpoint, 'jobs', self.context.accountAlias];
				self.context.rest.post(path, null, self.data, resolve, reject);

			}).then(function(result){

				// Update Job instance with the result as the underlying model.
				return new RNR.Job(self.context, result);

			}).then(function(result) {

				// If a callback was provided, execute.
				if(cb) { cb(result); }

				return result;

			});

		};

		/**
		 * Update a job, persisting the configuration.
		 *
		 * @param {RNR.jobOnSuccess} cb - Callback invoked when the operation is successful.
		 * @returns {Promise<RNR.Job>} - The persisted job instance.
		 */
		Job.prototype.update = function(cb) {

			var self = this;

			return new this.context.Promise(function(resolve, reject) {

				var path = [self.context.endpoint, 'jobs', self.context.accountAlias, self.id()];
				self.context.rest.put(path, null, self.data, resolve, reject);

			}).then(function(result){

				// Update Job instance with the result as the underlying model.
				return new RNR.Job(self.context, result);

			}).then(function(result) {

				// If a callback was provided, execute.
				if(cb) { cb(result); }

				return result;

			});

		};

		/**
		 * Start a new job execution.
		 *
		 * @param {Object} options - Start operation options.
		 * @param {string} options.sshPrivateKey - An optional default key to be used to access all hosts.
		 * @param {Array} options.hosts - An optional list of inventory hosts.
		 * @param {Array} options.hosts.id - A host identifier.
		 * @param {string} options.hosts.sshPrivateKey - An optional key to be used to access the host. Overrides the default sshPrivateKey if provided.
		 * @param {RNR.executionOnSuccess} cb - Callback invoked when the operation is successful.
		 * @returns {Promise<RNR.Execution>} - The execution instance.
		 */
		Job.prototype.start = function(options, cb) {

			var self = this;
			options = options || {};

			return new this.context.Promise(function(resolve, reject) {

				var path = [self.context.endpoint, 'jobs', self.context.accountAlias, self.id(), 'start'];
				self.context.rest.post(path, null, options, resolve, reject);

			}).then(function(result){

				// Update Job instance with the result as the underlying model.
				return new RNR.Execution(self.context, result);

			}).then(function(result) {

				// If a callback was provided, execute.
				if(cb) { cb(result); }

				return result;

			});

		};

		/**
		 * Get all executions for the job.
		 *
		 * @param {Object} options - Find operation options.
		 * @param {Number} options.page - The page to retrieve, defaults to 0.
		 * @param {Number} options.size - The page size to retrieve, defaults to 10.
		 * @param {RNR.executionsOnSuccess} cb - Callback invoked when the operation is successful.
		 * @returns {Promise<RNR.Page<RNR.Execution>>} - The execution instance.
		 */
		Job.prototype.executions = function(options, cb) {

			var self = this;
			self.options = options || {};

			if(!self.options.page) {
				self.options.page = 0;
			}

			if(!self.options.size) {
				self.options.size = 10;
			}

			return new this.context.Promise(function(resolve, reject) {

				var parameters = {
					page : String(self.options.page),
					size : String(self.options.size)
				};

				// The rest type will convert this array to a '/' separated string.
				var path = [self.context.endpoint, 'jobs', self.context.accountAlias, self.id(), 'executions'];

				self.context.rest.get(path, parameters, resolve, reject);

			}).then(function(result){

				// Create a new Page instance with the result as the underlying model.
				return new Page(self.context)
					.page(result.page)
					.size(result.size)
					.totalSize(result.totalSize)
					.values(result.results.map(function(item){
						// Transform the plain data object to a new Job type.
						return new RNR.Execution(self.context, item);
					}))
					// Setup the fetch operation on the page instance.
					.fetch(function(page, size){
						return self.executions({page : page, size : size});
					});

			}).then(function(result) {

				// If a callback was provided, execute.
				if(cb) { cb(result); }

				return result;

			});
		};

		/**
		 * Get an execution for the job using a distinct execution id.
		 *
		 * @param {string} executionId - The execution id to use in the lookup.
		 * @param {RNR.executionOnSuccess} cb - Callback invoked when the operation is successful.
		 * @returns {Promise<RNR.Execution>} - The execution instance.
		 */
		Job.prototype.execution = function(executionId, cb) {

			var self = this;

			return new this.context.Promise(function(resolve, reject) {

				var path = [self.context.endpoint, 'jobs', self.context.accountAlias, self.id(), 'executions', executionId];
				self.context.rest.get(path, null, resolve, reject);

			}).then(function(result){

				// Create a new Execution instance with the result as the underlying model.
				return new Execution(self.context, result);

			}).then(function(result) {

				// If a callback was provided, execute.
				if(cb) { cb(result); }

				return result;

			});

		};

		/**
		 * Gets all status models related to the job instance.
		 *
		 * @param {Object} options - Find operation options.
		 * @param {Number} options.page - The page to retrieve, defaults to 0.
		 * @param {Number} options.size - The page size to retrieve, defaults to 10.
		 * @param {RNR.statusesOnSuccess} cb - Callback invoked when the kill operation is successful.
		 * @returns {Promise<RNR.Page<RNR.Status>>} - The status models.
		 */
		Job.prototype.statuses = function(options, cb){

			var self = this;
			self.options = options || {};

			if(!self.options.page) {
				self.options.page = 0;
			}

			if(!self.options.size) {
				self.options.size = 10;
			}

			return new this.context.Promise(function(resolve, reject) {

				var parameters = {
					page : String(self.options.page),
					size : String(self.options.size)
				};

				// The rest type will convert this array to a '/' separated string.
				var path = [self.context.endpoint, 'status', self.context.accountAlias, 'job', self.id()];

				self.context.rest.get(path, parameters, resolve, reject);

			}).then(function(result){

				if(Array.isArray(result)) {

					// Create a new Page instance with the result as the underlying model.
					return new Page(self.context)
						.page(0)
						.size(result.length)
						.totalSize(result.length)
						.values(result.map(function(item){
							// Transform the plain data object to a new Status type.
							return new RNR.Status(self.context, item);
						}))
						// Setup the fetch operation on the page instance.
						.fetch(function(page, size){
							return self.statuses({page : page, size : size});
						});

				}

				// Create a new Page instance with the result as the underlying model.
				return new Page(self.context)
					.page(result.page)
					.size(result.size)
					.totalSize(result.totalSize)
					.values(result.results.map(function(item){
						// Transform the plain data object to a new Status type.
						return new RNR.Status(self.context, item);
					}))
					// Setup the fetch operation on the page instance.
					.fetch(function(page, size){
						return self.statuses({page : page, size : size});
					});

			}).then(function(result) {

				// If a callback was provided, execute.
				if(cb) { cb(result); }

				return result;

			});

		};

		/**
		 * Provides execution related operations like find.
		 *
		 * @memberof RNR
		 * @param {Object} context - The runner context.
		 * @constructor
		 */
		var Executions = module.Executions = function(context){
			this.context = context;
		};

		/**
		 * Find executions from the repository.
		 *
		 * @param {Object} options - Find operation options.
		 * @param {Number} options.page - The page to retrieve, defaults to 0.
		 * @param {Number} options.size - The page size to retrieve, defaults to 10.
		 * @param {RNR.executionsOnSuccess} cb - Callback invoked when the operation is successful.
		 * @returns {Promise<RNR.Page<Execution>>} - A page of data, or a page of 0 values if no data is available.
		 */
		Executions.prototype.find = function(options, cb) {

			var self = this;
			self.options = options || {};

			if(!self.options.page) {
				self.options.page = 0;
			}

			if(!self.options.size) {
				self.options.size = 10;
			}

			return new this.context.Promise(function(resolve, reject) {

				var parameters = {
					page : String(self.options.page),
					size : String(self.options.size)
				};

				// The rest type will convert this array to a '/' separated string.
				var path = [self.context.endpoint, 'jobs', self.context.accountAlias, 'executions'];

				self.context.rest.get(path, parameters, resolve, reject);

			}).then(function(result){

				// Create a new Page instance with the result as the underlying model.
				return new Page(self.context)
					.page(result.page)
					.size(result.size)
					.totalSize(result.totalSize)
					.values(result.results.map(function(item){
						// Transform the plain data object to a new Job type.
						return new RNR.Execution(self.context, item);
					}))
					// Setup the fetch operation on the page instance.
					.fetch(function(page, size){
						return self.find({page : page, size : size});
					});

			}).then(function(result) {

				// If a callback was provided, execute.
				if(cb) { cb(result); }

				return result;

			});

		};

		/**
		 * Create a new runner API instance.
		 *
		 * @memberof RNR
		 * @constructor
		 * @param {Object} context - API options.
		 * @param {string} context.token - An existing bearer token for authentication with services.
		 * @param {string} context.accountAlias - The account alias to interact with.
		 * @property {RNR.Jobs} jobs - Provides access to job search functions.
		 * @property {RNR.Executions} executions - Provides access to execution search functions.
		 */
		var Runner = module.Runner = function(context){

			this.context = context || {};
			this.context.endpoint = 'https://api.runner.ctl.io';
			this.context.rest = new Rest();
			this.context.rest.preInvokeInterceptors.push(new PreInvokeAuthInterceptor(this.context));

			/*
			 * If the promise type has not been defined, then
			 * set to the default Promise implementation.
			 */
			if(typeof context.Promise === 'undefined') {
				context.Promise = Promise;
			}

			this.jobs = new Jobs(context);
			this.executions = new Executions(context);

		};

		/**
		 * Creates a new job model instance. This model provides access
		 * to all job operations like, create, start, stop and kill.
		 *
		 * @param {Object} options - The job details.
		 * @param {string} options.job - The job name.
		 * @param {string} options.description - A string defining the job.
		 * @param {Object} options.repository - The playbook repository definition.
		 * @param {string} options.repository.url - The playbook repository git URL.
		 * @param {string} options.repository.branch - The playbook repository branch if applicable. If not supplied, the default branch is used.
		 * @param {string} options.repository.defaultPlaybook - The path to the playbook from the repository root. Defaults to playbook.yml.
		 * @param {Object} options.repository.credentials - The playbook repository credentials. Only required if the repository is not public.
		 * @param {string} options.repository.credentials.username - The username that will be used to access the playbook repository.
		 * @param {string} options.repository.credentials.password - The password that will be used to access the playbook repository.
		 * @param {string} options.repository.credentials.sshPrivateKey - The ssh private key that will be used to access the playbook repository.
		 * @param {Array} options.hosts - An optional list of inventory hosts.
		 * @param {string} options.hosts.id - An identified for the host.
		 * @param {Object} options.hosts.hostVars - Optional playbook variables to be applied to the host.
		 * @param {string} options.hosts.sshPrivateKey - An optional key to be used to access the host.
		 * @param {boolean} options.useDynamicInventory - Indicates the job should load dynamic inventory for the account.
		 * @param {Object} options.properties - Optional playbook variables to be applied to all hosts.
		 * @param {Array} options.callbacks - An optional list callbacks to be notified of status updates.
		 * @param {string} options.callbacks.url - The URL endpoint to POST callbacks.
		 * @param {string} options.callbacks.level - The status level to notify on. DEBUG, ERROR or RESULT.
		 * @returns {RNR.Job} - A new job model instance.
		 */
		Runner.prototype.job = function(options) {
			return new Job(this.context, options);
		};

		return module;

	}(RNR || {}));

	// Module Definitions For Different Dependency Managers

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		// Define Module for Node
		module.exports = RNR;
	}
	else {
		if (typeof define === 'function' && define.amd) {
			// Define Module for AMD
			define( [], function() {
				return RNR;
			});
		}
		else {
			// Define Module for Browsers
			window.RNR = RNR;
		}
	}
})();