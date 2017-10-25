import './home.html';
import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';

import { updateArticle } from '../../../api/articles/methods.js';
import { Articles } from "../../../api/articles/articles";
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.home.onCreated(function homePageOnCreated() {
    console.log('homepage.onCreated');
    this.state = new ReactiveDict();
    window.scrollTo(0, 0);
});

Template.home.rendered = function(){
    $('.ladda-button').ladda();
};

Template.home.onRendered(function homePageOnRendered() {
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            console.log("homePage - subscriptionsReady = ", Articles.find().fetch());
            this.state.set('articles', Articles.find().fetch());
        }
    });
});

Template.home.events({});

Template.home.helpers({
    articles() {
        const instance = Template.instance();
        console.log('articles = ', instance.state.get('articles'));
        return instance.state.get('articles');
    }
});
