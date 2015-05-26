module.exports = function (options) {
    var utils = require('gulp-util'),
        git = require('gulp-git'),
        exec = require('child_process').exec,
        fs = require('fs'),
        path = require('path'),
        gitUtils = require('../utils/git-utils.js');

    return {
        /* Initialize the master branch */
        init: function (callback) {
            utils.log("Initializing the master branch");

            git.init(function (err) {
                if (err) { return callback(err); }

                /* Use a .gitignore and a readme file to first initialize the branch */
                var readme = path.join(options.root, 'component_files', 'README.md'),
                    gitignore = path.join(options.root, 'project_files', 'gitignore');
                
                exec("cp " + gitignore + " " + path.join(options.processRoot, '.gitignore'), function (err) {
                    if (err) { return callback(err); }

                    exec("cp " + readme + " " + options.processRoot, function (err) {
                        if (err) { return callback(err); }

                        /* Commit previously added files */
                        var files = [
                            path.join(options.processRoot, '.gitignore'),
                            path.join(options.processRoot, 'README.md')];

                        gitUtils.addAndCommit(files, 'TheSmiths boilerplate', callback);
                    });
                });
            });
        },

        /* Checkout the master branch */
        checkout: function (callback) { 
            git.checkout('master', function (err) {
                if (err) { return callback(err); }
                git.exec({args: 'clean -df'}, callback);
            });
        },

        /* Commit everything on the branch master */
        addAndCommit: function (callback) {
            utils.log("Adding and commiting files on the master branch");

            var msg = 'Add autogenerated bootstrap project',
                files = ['./*'],
                addOptions = '--all';
            gitUtils.addAndCommit(files, msg, addOptions, callback);
        }
    };
};
