// A simple module to replace `Backbone.sync` with *localStorage*-based
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Generate four random hex digits.
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

// Our Store is represented by a single JS object in *localStorage*. Create it
// with a meaningful name, like the name you'd give a table.
var Store = function(name) {
    this.name = name;
    var store = localStorage.getItem(this.name);
    this.data = (store && JSON.parse(store)) || {};
};

_.extend(Store.prototype, {

    // Save the current state of the **Store** to *localStorage*.
    save: function() {
        localStorage.setItem(this.name, JSON.stringify(this.data));
    },

    // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
    // have an id of it's own.
    create: function(model) {
        if (!model.id) model.id = model.attributes.id = guid();
        this.data[model.id] = model;
        this.save();
        return model;
    },

    // Update a model by replacing its copy in `this.data`.
    update: function(model) {
        this.data[model.id] = model;
        this.save();
        return model;
    },

    // Retrieve a model from `this.data` by id.
    find: function(model) {
        return this.data[model.id];
    },

    // Return the array of all models currently in storage.
    findAll: function() {
        return _.values(this.data);
    },

    // Delete a model from `this.data`, returning it.
    destroy: function(model) {
        delete this.data[model.id];
        this.save();
        return model;
    }

});

// Override `Backbone.sync` to use delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
var LocalStorageSync = function(method, model, options) {

    var resp;
    var store = model.localStorage || model.collection.localStorage;

    switch (method) {
    case "read":    resp = model.id ? store.find(model) : store.findAll(); break;
    case "create":  resp = store.create(model);                            break;
    case "update":  resp = store.update(model);                            break;
    case "delete":  resp = store.destroy(model);                           break;
    }

    if (resp) {
        options.success(resp);
    } else {
        options.error("Record not found");
    }
};


// In memory Cache
// WIP
var MemoryCache = function () {    
    this._cache = {};
}

_.extend(MemoryCache.prototype, {
    all: function () {
        return this._cache;
    },

    exists: function (key) {
        return this.get(key) !== undefined;
    },

    get: function (key) {
        return this._cache[key];
    },

    set: function (key, value) {
        this._cache[key] = value;
    },

    reset: function (value) {
        this._cache = value;
    },

    clear: function (key) {
        this._cache[key] = undefined;
    }
});

/** 
 * WIP
 * Sync mechanism for models that are only required to be 
 * fetched from the server and not saved or updated.
 * Previously fetched models will be later fetched from in memory cache
 */
var ReadOnlyCachedSync = function(method, model, options) {

    var resp;
    var cache = model.cacheStorage || model.collection.cacheStorage;
    
    switch (method) {
    case "read":
        if (model.id) {
            if (cache.exists(model.id)) {
                resp = cache.get(model.id);
            } else {
                var super_success = options.success;
                options.success = function (resp, status, xhr) {
                    cache.set(model.id, resp);
                    super_success(resp, status, xhr);
                }
                return Backbone.sync(method, model, options);
            }
        } else {
            resp = cache.all();
            if (_.isEmpty(resp)) {
                var super_success = options.success;
                options.success = function (resp, status, xhr) {
                    cache.reset(resp);
                    super_success(resp, status, xhr);
                }
                return Backbone.sync(method, model, options);
            }            
        }

        break;

    case "create":
    case "update":
    case "delete":
        throw "ReadOnlyCachedStorage doesn't support model creation/updation/deletion";
        break;
    }

    if (resp) {
        options.success(resp);
    } else {
        options.error("Record not found");
    }
};
