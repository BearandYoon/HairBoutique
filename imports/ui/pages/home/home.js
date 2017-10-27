import './home.html';
import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';
let Masonry = require('masonry-layout');

import { updateArticle } from '../../../api/articles/methods.js';
import { Articles } from "../../../api/articles/articles";
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

Template.home.onCreated(function homePageOnCreated() {
    console.log('homepage.onCreated');
    this.state = new ReactiveDict();
    window.scrollTo(0, 0);
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            this.state.set('articles', Articles.find().fetch());
        }
    });
});

Template.home.rendered = function(){
    $('.ladda-button').ladda();
};

Template.home.onRendered(function homePageOnRendered() {
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            let msnry = new Masonry( '.grid', {
                itemSelector: '.grid-item',
                columnWidth: 500,
                gutter: 25
            });
        }
    });
});

Template.home.events({});

Template.home.helpers({
    articles() {
        const instance = Template.instance();
        let myArticles = instance.state.get('articles');
        if (myArticles) {
            myArticles.map(function (article) {
                article.formatDate = monthNames[article.createdAt.getMonth()] + " " + article.createdAt.getDate() + ", " + article.createdAt.getFullYear();
            })
        }
        return myArticles;
    },
    userInfo() {
        return Meteor.user();
    }
});