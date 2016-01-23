## Getting Started

### Clone the repository

```
git clone https://github.com/CenturyLinkCloud/wf-dashboard.git
cd wf-dashboard
```

### Install Managed Dependencies

We have two kinds of dependencies in this project: npm managed and bower managed.

* `npm`, the [node package manager][npm].
* `bower`, a [client-side code package manager][bower].

In the future we will preconfigure `grunt` to automatically run both `npm` and `bower` but for now simply do:

### npm managed dependencies

```
npm install
```

You should find that you have a new folder in the project.

* `node_modules` - contains the npm packages for the tools we need

### bower managed dependencies

```
bower install
```

You should find that you have a new folder in the project.

* `app/assets/js/vendor` - contains bower managed files

*Note that the `bower_components` folder would normally be installed in the root folder but
we have changed this location and name via the `.bowerrc` file.*

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
grunt serve
```
This will start the server, open your default browser and navigate to the index of the SPA at `http://localhost:9000`.
We have preconfigured grunt to automatically refresh your browser whenever .js or .html files change.

