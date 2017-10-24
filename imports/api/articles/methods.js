import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Roles } from 'meteor/alanning:roles';
import { Articles } from './articles.js';

export const insertArticle = new ValidatedMethod({
    name: 'articles.insert',
    validate: Articles.simpleSchema().pick(['title', 'content', 'authorId']).validator({ clean: true, filter: false }),
    run({ title, content, authorId }) {
        if(!this.userId) {
            throw new Meteor.Error("articles.insert", "Not authorized to insert the article");
        }

        const article = {
            title,
            content,
            authorId
        };
        return Articles.insert(article);
    }
});

export const updateArticle = new ValidatedMethod({
    name: 'articles.update',
    validate: Articles.simpleSchema().pick(['_id', 'title', 'content', 'authorId',
        'likerCount', 'followerCount', 'viewerCount', 'isShared']).validator({ clean: true, filter: false }),
    run({ _id, title, content, authorId, likerCount, followerCount, viewerCount, isShared }) {

        if (this.userId !== authorId) {
            throw new Meteor.Error("articles.update", "Not authorized to update the article");
        }

        Articles.update(_id, {
            $set: {
                title: (_.isUndefined(title) ? null : title),
                content: (_.isUndefined(content) ? null : content),
                authorId: (_.isUndefined(authorId) ? null : authorId),
                likerCount: (_.isUndefined(likerCount) ? null : likerCount),
                followerCount: (_.isUndefined(followerCount) ? null : followerCount),
                viewerCount: (_.isUndefined(viewerCount) ? null : viewerCount),
                isShared: (_.isUndefined(isShared) ? null : isShared)
            }
        });
    }
});

export const removeArticle = new ValidatedMethod({
    name: 'articles.remove',
    validate: new SimpleSchema({
        _id: Articles.simpleSchema().schema('_id')
    }).validator({ clean: true, filter: false }),
    run({ _id }) {

        if (this.userId !== _id) {
            throw new Meteor.Error("articles.update", "Not authorized to delete the article");
        }
        Articles.remove(_id);
    }
});

// Get article of all method names on Articles
const ARTICLE_METHODS = _.pluck([
    insertArticle,
    updateArticle,
    removeArticle
], 'name');

if (Meteor.isServer) {
    // Only allow 5 article operations per connection per second
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(ARTICLE_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}
