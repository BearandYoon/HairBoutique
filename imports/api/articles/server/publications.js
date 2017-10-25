/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Articles } from '../articles.js';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish("articles", function () {
    if (!this.userId) {
        this.ready();
        return;
    }
    console.log('================ ', this.userId);
    return Articles.find({});
});

Meteor.publish("articleSingle", function (params) {
    new SimpleSchema({
        articleId: { type: String },
    }).validate(params);

    if(!this.userId) {
        this.ready();
        return;
    }

    const { articleId } = params;
    return Articles.find({_id: articleId});
});