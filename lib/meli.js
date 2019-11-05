

var needle = require('needle');
var config = require('../config.js').config;

/**
 *
 * MELI
 *
 * @constructor
 * @param {string|number} client_id
 * @param {string} client_secret
 * @param {string} [access_token]
 * @param {string} [refresh_token]
 */
var Meli = function (client_id, client_secret, access_token, refresh_token) {

    var _parameters = { // parametros que se enviarán de forma dinamica a la conexión por meli
        client_id: config.client_id,
        client_secret: config.client_secret,
        access_token: access_token,
        refresh_token: refresh_token
    };

    //console.log('parametros', _parameters);


  this.getAuthURL = function (redirect_uri) {

        var query = {
            response_type: 'code',
            client_id: _parameters.client_id,
            redirect_uri: redirect_uri
        };
        
        console.log(query);
          return config.auth_url + convertObjectToQueryString(query);
           };

    
    this.authorize = function (code, redirect_uri, callback) {
        var self = this;
        needle.post(config.oauth_url, {
            grant_type: 'authorization_code',
            client_id: _parameters.client_id,
            client_secret: _parameters.client_secret,
            code: code,
            redirect_uri: redirect_uri
        }, {
        }, function (err, res, body) {
            if (body) {
                _parameters.access_token = body.access_token;
                _parameters.refresh_token = body.refresh_token;
                _parameters.redirect_uri = redirect_uri;
            }
            callback(err, body);
        });
    };
   
    this.refreshAccessToken = function (callback) {
        var self = this;
        needle.post(config.oauth_url, {
            grant_type: 'refresh_token',
            client_id: _parameters.client_id,
            client_secret: _parameters.client_secret,
            refresh_token: _parameters.refresh_token
        }, {
        }, function (err, res, body) {
            if (body) {
                _parameters.refresh_token = body.refresh_token;
                _parameters.access_token = body.access_token;
            }
            callback(err, body);
        });
    };

    
    this.get = function (path, params, callback) {
        var cb = callback;
        if (!callback) cb = params;
        var query = (typeof(params) == 'object') ?
            convertObjectToQueryString(params) :
            convertObjectToQueryString({});


        path = config.api_root_url + (path.charAt(0) == '/' ? '' : '/') + path + query;
        //console.log(path);
        needle.get(path, {
        }, function (err, res, body) {
            //console.log(err, body);
            cb(err, res ? res.body : res);
        });
    };

   
    this.post = function (path, body, params, callback) {
        var cb = callback;
        if (!callback) cb = params;
        var query = (typeof(params) == 'object') ?
            convertObjectToQueryString(params) :
            convertObjectToQueryString({});

        path = config.api_root_url + (path.charAt(0) == '/' ? '' : '/') + path + query;
        //console.log(path);
        needle.post(path, body, {
            json: true,
            headers: {
                "Content-Type": "application/json"
            }
        }, function (err, res, body) {
            //console.log(err, body);

            cb(err, res ? res.body : res);
        });
    };

    this.upload = function (path, body, params, callback) {
        var cb = callback;
        if (!callback) cb = params;
        var query = (typeof(params) == 'object') ?
            convertObjectToQueryString(params) :
            convertObjectToQueryString({});

        path = config.api_root_url + (path.charAt(0) == '/' ? '' : '/') + path + query;
        //console.log(path);
        needle.post(path, body, {
            multipart: true
        }, function (err, res, body) {
            //console.log(err, body);

            cb(err, res ? res.body : res);
        });
    };

   
    this.put = function (path, body, params, callback) {
        var cb = callback;
        if (!callback) cb = params;
        var query = (typeof(params) == 'object') ?
            convertObjectToQueryString(params) :
            convertObjectToQueryString({});

        path = config.api_root_url + (path.charAt(0) == '/' ? '' : '/') + path + query;
        //console.log(path);
        needle.put(path, body, {
            json: true,
            headers: {
                "Content-Type": "application/json"
            }
        }, function (err, res, body) {
            //console.log(err, body);

            cb(err, res ? res.body : res);
        });
    };

    
    this.delete = function (path, params, callback) {
        var cb = callback;
        if (!callback) cb = params;
        var query = (typeof(params) == 'object') ?
            convertObjectToQueryString(params) :
            convertObjectToQueryString({});

        path = config.api_root_url + (path.charAt(0) == '/' ? '' : '/') + path + query;
        //console.log(path);
        needle.delete(path, {
            headers: {
                "Content-Type": "application/json"
            }
        }, function (err, res, body) {
            //console.log(err, body);

            cb(err, res ? res.body : res);
        });
    };

   
    var convertObjectToQueryString = function (obj) {
        // Clone the object obj and loose the reference
        obj = Object.create(obj);
        if (!obj.access_token && _parameters.access_token)
            obj.access_token = _parameters.access_token;
        var result = '?';
        for (var i in obj) {
            result += i + "=";
            if (obj[i] != undefined) {
                if (Array.isArray(obj[i])) {
                    result += obj[i].join() + "&";
                } else {
                    result += obj[i] + "&";
                }
            }
        }
        if (result[result.length - 1] == '&') {
            result = result.substr(0, result.length - 1);
        }
        if (result == '?')
            result = '';
        return result;
    }

};


exports.Meli = Meli;