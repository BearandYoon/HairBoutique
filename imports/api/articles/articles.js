import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import { TAPi18n } from 'meteor/tap:i18n';
import faker from 'faker';
import { FilesCollection } from 'meteor/ostrio:files'

import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '../users/users.js';

class ArticlesCollection extends Mongo.Collection {
    insert(doc, callback) {
        const ourDoc = doc;
        ourDoc.createdAt = ourDoc.createdAt || new Date();
        const result = super.insert(ourDoc, callback);
        return result;
    }
    update(selector, modifier) {
        const result = super.update(selector, modifier);
        return result;
    }
    remove(selector, callback) {
        return super.remove(selector, callback);
    }
}

export const Articles = new ArticlesCollection('articles');

// Deny all client-side updates since we will be using methods to manage this collection
Articles.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Articles.schema = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    authorId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    likerCount: {
        type: Number,
        defaultValue: 0
    },
    followerCount: {
        type: Number,
        defaultValue: 0
    },
    viewerCount: {
        type: Number,
        defaultValue: 0
    },
    isShared: {
        type: Boolean,
        defaultValue: false
    },
    createdAt: {
        type: Date,
        denyUpdate: true
    }
});

Articles.attachSchema(Articles.schema);

Articles.publicFields = {
    title: 1,
    content: 1,
    authorId: 1,
    likerCount: 1,
    followerCount: 1,
    viewerCount: 1,
    isShared: 1,
    createdAt: 1
};

Factory.define('articles', Articles, {
    title: () => faker.lorem.words(),
    content: () => faker.lorem.words()
});

Articles.helpers({});
