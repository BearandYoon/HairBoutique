import './myArticle.html';
import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';
let Masonry = require('masonry-layout');

import { updateArticle } from '../../../api/articles/methods.js';
import { Articles } from "../../../api/articles/articles";
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

Template.myArticles.onCreated(function homePageOnCreated() {
    console.log('myArticle.onCreated');
    this.state = new ReactiveDict();
    window.scrollTo(0, 0);
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            this.state.set('articles', Articles.find({authorId: Meteor.userId()}).fetch());
        }
    });
});

Template.myArticles.rendered = function(){
    $('.ladda-button').ladda();
};

Template.myArticles.onRendered(function myArticlesPageOnRendered() {
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

Template.myArticles.events({
    'submit #new-article-form': function(event){
        event.preventDefault();
        let email = event.target.title.value;
        let passwd = event.target.content.value;
        $('.ladda-button').ladda('start');

        // console.log(event.target.shared.value);
        console.log(event.target.privateArticles);
        // Meteor.loginWithPassword(email, passwd, function(error){
        //     $('.ladda-button').ladda('stop');
        //
        //     if (error){
        //         console.log("login failed");
        //         swal({
        //             title: "Login Failed!",
        //             text: "Wrong username or password. Please try again!",
        //             type: "warning"
        //         });
        //         //template.find('#form-messages').html(error.reason);
        //     }else{
        //         console.log("login succeed");
        //         FlowRouter.go("/home");
        //     }
        // });
    },
});

Template.myArticles.helpers({
    articles() {
        const instance = Template.instance();
        let myArticles = {
            articles: instance.state.get('articles'),
            totalLiker: 0,
            totalViewer: 0,
            sharedArticles: 0,
            privateArticles: 0
        };
        if (myArticles.articles) {
            myArticles.articles.map(function (article) {
                article.formatDate = monthNames[article.createdAt.getMonth()] + " " + article.createdAt.getDate() + ", " + article.createdAt.getFullYear();
                myArticles.totalLiker += article.likerCount;
                myArticles.totalViewer += article.viewerCount;
                if (article.isShared) {
                    myArticles.sharedArticles++;
                } else {
                    myArticles.privateArticles++;
                }
            })
        }
        return myArticles;
    },
    userInfo() {
        return Meteor.user();
    }
});