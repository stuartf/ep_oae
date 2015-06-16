/*!
 * Copyright 2013 Apereo Foundation (AF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://www.osedu.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var _ = require('underscore');
var config = require(__dirname + '/../config');
var Crowdin = require('crowdin');
var fs = require('fs');
var temp = require('temp');

// Automatically track and cleanup files at exit
temp.track();

var crowdin = new Crowdin(config.crowdin);

// Download new translations
temp.mkdir('crowdin', function(err, dirPath) {
    // Download all the OAE translations
    crowdin.downloadToPath(dirPath).then(function(){
        // Copy the non-empty ep_oae bundles
        fs.readdir(dirPath + '/locales', function(err, files) {
            _.each(files, function(file) {
                fs.readFile(dirPath + '/locales/' + file, function(err, data) {
                    var translations = JSON.parse(data);
                    var notEmpty = _.values(translations).some(function(translation){
                        return translation !== '';
                    });
                    if (notEmpty){
                        fs.createReadStream(dirPath + '/locales/' + file).pipe(fs.createWriteStream(__dirname + '/../locales/' + file));
                    }
                });
            });
        });
    });
});
