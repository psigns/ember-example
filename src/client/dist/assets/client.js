"use strict";



define('client/adapters/application', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.RESTAdapter.extend({
        namespace: '/api'
    });
});
define('client/app', ['exports', 'client/resolver', 'ember-load-initializers', 'client/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('client/components/new-task-field', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({});
});
define('client/components/todo-listing', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    isComplete: false,

    didReceiveAttrs() {
      this.isComplete = this.get('todo').status === 'COMPLETE';
    },

    actions: {
      toggleComplete(e) {
        let todo = this.get('todo');

        Ember.set(todo, 'status', e.target.checked ? 'COMPLETE' : 'INCOMPLETE');
        todo.save();
      },
      deleteTodo() {
        let todo = this.get('todo');

        todo.destroyRecord();
      }
    }
  });
});
define('client/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('client/controllers/application', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    actions: {
      createTodo(e) {
        if (e.keyCode === 13 && !Ember.isBlank(e.target.value)) {
          const newPost = this.get('store').createRecord('todo', {
            text: e.target.value
          });

          newPost.save().then(() => {
            // https://github.com/emberjs/data/issues/1829
            let parent = this.store.peekAll('todo');
            let filtered = parent.filter(data => get(data, 'id') === null);

            filtered.forEach(item => item.deleteRecord());
          });

          e.target.value = '';
        }
      }
    }
  });
});
define('client/helpers/app-version', ['exports', 'client/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_, hash = {}) {
    const version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    let versionOnly = hash.versionOnly || hash.hideSha;
    let shaOnly = hash.shaOnly || hash.hideVersion;

    let match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('client/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('client/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('client/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'client/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  let name, version;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('client/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('client/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('client/initializers/export-application-global', ['exports', 'client/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define("client/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('client/models/todo', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        status: _emberData.default.attr(),
        text: _emberData.default.attr()
    });
});
define('client/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('client/router', ['exports', 'client/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('active');
    this.route('completed');
  });

  exports.default = Router;
});
define('client/routes/active', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        async model() {
            const allTodos = await this.get('store').findAll('todo');

            return allTodos.filter(todo => todo.status === 'INCOMPLETE');
        }
    });
});
define('client/routes/completed', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    async model() {
      const allTodos = await this.get('store').findAll('todo');

      return allTodos.filter(todo => todo.status === 'COMPLETE');
    }
  });
});
define('client/routes/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model() {
      return this.get('store').findAll('todo');
    }
  });
});
define('client/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define("client/templates/active", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Yzynrp1I", "block": "{\"symbols\":[\"todoItem\"],\"statements\":[[4,\"each\",[[22,[\"model\"]]],null,{\"statements\":[[0,\"  \"],[1,[26,\"todo-listing\",null,[[\"todo\"],[[21,1,[]]]]],false],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "client/templates/active.hbs" } });
});
define("client/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ZEgxCdHk", "block": "{\"symbols\":[],\"statements\":[[6,\"h1\"],[8],[0,\"Todo app\"],[9],[0,\"\\n\"],[6,\"nav\"],[8],[0,\"\\n\"],[4,\"link-to\",[\"index\"],[[\"class\"],[\"menu__link--all-todos\"]],{\"statements\":[[0,\"      All\\n\"]],\"parameters\":[]},null],[4,\"link-to\",[\"active\"],[[\"class\"],[\"menu__link--active-todos\"]],{\"statements\":[[0,\"      Active\\n\"]],\"parameters\":[]},null],[4,\"link-to\",[\"completed\"],[[\"class\"],[\"menu__link--completed-todos\"]],{\"statements\":[[0,\"      Completed\\n\"]],\"parameters\":[]},null],[0,\"    \"],[6,\"input\"],[10,\"id\",\"new-todo\"],[11,\"onkeydown\",[26,\"action\",[[21,0,[]],\"createTodo\"],null],null],[10,\"placeholder\",\"What needs to be done?\"],[10,\"autofocus\",\"\"],[10,\"type\",\"text\"],[8],[9],[0,\"\\n\"],[9],[0,\"\\n\"],[6,\"div\"],[8],[0,\"\\n\"],[9],[0,\"\\n\"],[1,[20,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "client/templates/application.hbs" } });
});
define("client/templates/completed", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "uqdJ+B9w", "block": "{\"symbols\":[\"todoItem\"],\"statements\":[[4,\"each\",[[22,[\"model\"]]],null,{\"statements\":[[0,\"  \"],[1,[26,\"todo-listing\",null,[[\"todo\"],[[21,1,[]]]]],false],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "client/templates/completed.hbs" } });
});
define("client/templates/components/new-task-field", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "fexJvgzc", "block": "{\"symbols\":[],\"statements\":[[6,\"input\"],[10,\"id\",\"new-todo\"],[11,\"onkeydown\",[26,\"action\",[[21,0,[]],\"createTodo\"],null],null],[10,\"placeholder\",\"What needs to be done?\"],[10,\"autofocus\",\"\"],[10,\"type\",\"text\"],[8],[9]],\"hasEval\":false}", "meta": { "moduleName": "client/templates/components/new-task-field.hbs" } });
});
define("client/templates/components/todo-listing", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "1hT9aqVv", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[8],[0,\"\\n  \"],[6,\"h3\"],[8],[0,\"\\n    \"],[6,\"input\"],[11,\"onclick\",[26,\"action\",[[21,0,[]],\"toggleComplete\"],null],null],[11,\"checked\",[26,\"if\",[[22,[\"isComplete\"]],true],null],null],[10,\"type\",\"checkbox\"],[8],[9],[0,\"\\n    \"],[1,[22,[\"todo\",\"text\"]],false],[0,\"\\n  \"],[9],[0,\"\\n  \"],[6,\"button\"],[11,\"onclick\",[26,\"action\",[[21,0,[]],\"deleteTodo\"],null],null],[8],[0,\"Delete\"],[9],[0,\"\\n  \"],[6,\"div\"],[8],[1,[22,[\"todo\",\"id\"]],false],[9],[0,\"\\n\"],[9]],\"hasEval\":false}", "meta": { "moduleName": "client/templates/components/todo-listing.hbs" } });
});
define("client/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "9KZXIYwV", "block": "{\"symbols\":[\"todoItem\"],\"statements\":[[4,\"each\",[[22,[\"model\"]]],null,{\"statements\":[[0,\"  \"],[1,[26,\"todo-listing\",null,[[\"todo\"],[[21,1,[]]]]],false],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "client/templates/index.hbs" } });
});


define('client/config/environment', [], function() {
  var prefix = 'client';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("client/app")["default"].create({"name":"client","version":"0.0.0+281c88eb"});
}
//# sourceMappingURL=client.map
