var OnBeforeActions;
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import common
import '../../ui/common/footer.js';
import '../../ui/common/ibox-tools.js';
import '../../ui/common/navigation.js';
import '../../ui/common/page-heading.js';
import '../../ui/common/right-sidebar.js';
import '../../ui/common/top-navbar.js';

// Import Layouts
import '../../ui/layouts/blank.js';
import '../../ui/layouts/main.js';
import '../../ui/layouts/not-found.html';

import '../../ui/pages/home/home.js';
import '../../ui/pages/forgotpassword/forgotPassword.js';
import '../../ui/pages/landing/landing.js';
import '../../ui/pages/login/login.js';
import '../../ui/pages/register/register.js';

import '../../ui/pages/profile/profile.js';
import '../../ui/pages/profile/settings.js';

import '../../ui/pages/customers/customers.js';
import '../../ui/pages/customers/editCustomer.js';
import '../../ui/pages/customer/customer.js';

import '../../ui/pages/myArticle/myArticle.js';

import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';


FlowRouter.wait();

Tracker.autorun(() => {
    // wait on roles to intialise so we can check is use is in proper role
    if (Roles.subscription.ready() && !FlowRouter._initialized) {
        FlowRouter.initialize()
    }
});

export const LoggedInSubs = new SubsManager();
export const ArticleSubs = new SubsManager();

let PublicGroup = FlowRouter.group();

let LoggedInGroup = FlowRouter.group({
    triggersEnter: [function(context, redirect) {
        if (!Meteor.userId()) {
            let route = FlowRouter.current();
            if(route.route.name != 'login')
            {
                Session.set("redirectAfterLogin", route.path);
                redirect('/login');
            }
        }
    }]
});

let NonLoggedInGroup = FlowRouter.group({
    triggersEnter: [function(context, redirect) {
        if (Meteor.userId()) {
            redirect('/home');
        }
    }]
});

let AdminGroup = FlowRouter.group({
    prefix: "/admin",
    triggersEnter: [function(context, redirect) {
        if (!Meteor.userId()) {
            let route = FlowRouter.current();
            if(route.route.name != 'login') {
                Session.set("redirectAfterLogin", route.path);
                redirect('/login');
            }
        }
        else {
            if (!Roles.userIsInRole(Meteor.userId(), [ROLES.ADMIN], Roles.GLOBAL_GROUP)) {
                redirect('/home');
            }
        }
    }]
});


PublicGroup.route('/', {
    action: function() {
        BlazeLayout.render("blankLayout", {content: "landing"});
    }
});


NonLoggedInGroup.route('/login', {
    action: function() {
        BlazeLayout.render("mainLayout", {not_logged_content: "login"});
    }
});


NonLoggedInGroup.route('/forgotPassword', {
    action: function() {
        BlazeLayout.render("mainLayout", {not_logged_content: "forgotPassword"});
    }
});


NonLoggedInGroup.route('/register', {
    action: function() {
        BlazeLayout.render("mainLayout", {not_logged_content: "register"});
    }
});

LoggedInGroup.route('/home', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "home"});
    },
    subscriptions: function(params, queryParams) {
        this.register('articles', ArticleSubs.subscribe('articles'));
    }
});


LoggedInGroup.route('/dashboard', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "dashboard"});
    }
});

LoggedInGroup.route('/profile', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "profile"});
    }
});


LoggedInGroup.route('/settings', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "settings"});
    }
});

LoggedInGroup.route('/myArticles', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "myArticles"});
    },
    subscriptions: function(params, queryParams) {
        this.register('articles', ArticleSubs.subscribe('articles'));
    }
});

AdminGroup.route('/customers', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "customers"});
    }
});

AdminGroup.route('/customers/new', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "editCustomer"});
    }
});

AdminGroup.route('/customers/:_id/edit', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "editCustomer"});
    },
    subscriptions: function(params, queryParams) {
        this.register('userSingle', LoggedInSubs.subscribe('userSingle', {userId: params._id}));
    }
});

AdminGroup.route('/customers/:_id/detail', {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "customer"});
    },
    subscriptions: function(params, queryParams) {
        this.register('userSingle', LoggedInSubs.subscribe('userSingle', {userId: params._id}));
    }
});

FlowRouter.notFound = {
    action: function() {
        BlazeLayout.render("mainLayout", {content: "notFound", not_logged_content: "notFound"});
    }
};