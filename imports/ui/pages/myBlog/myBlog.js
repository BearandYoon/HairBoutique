import './myBlog.html'

import { Roles } from 'meteor/alanning:roles';
import { ROLES } from '/imports/api/users/users.js';

import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

Template.customer.rendered = function(){
    $('.ladda-button').ladda();
};


Template.customer.onCreated(function detailCustomerPageOnCreated() {
    // console.log('detailCustomerPageOnCreated');
    this.getCustomerId = () => FlowRouter.getParam('_id');
    this.state = new ReactiveDict();
    this.state.setDefault({
        customer: {}
    });

    window.scrollTo(0, 0);
});


Template.customer.onRendered(function detailCustomerOnRendered() {
    this.autorun(() => {
        if (this.subscriptionsReady()) {
            // console.log("detailCustomer - subscriptionsReady");

            if(this.getCustomerId())
            {// If edit
                let userTemp = Meteor.users.findOne({_id: this.getCustomerId()});
                if(userTemp) {
                    if (Roles.userIsInRole(userTemp._id, [ROLES.ADMIN], Roles.GLOBAL_GROUP)) {
                        userTemp.role = ROLES.ADMIN;
                    }

                    userTemp.email = userTemp.emails[0].address;
                    this.state.set('customer', userTemp);
                }
            }
            else {
            }
        }
    });
});


Template.customer.events({
});

Template.customer.helpers({
    // We use #each on an array of one item so that the "list" template is
    // removed and a new copy is added when changing lists, which is
    // important for animation purposes.
    pageTitle() {
        const instance = Template.instance();
        if(instance.getCustomerId()) {
            return "Customer Detail View"
        }
    },
    customer() {
        const instance = Template.instance();
        // console.log(instance.state.get('customer'));
        return instance.state.get('customer');
    },
    isDisabled() {
        const instance = Template.instance();
        if(instance.getCustomerId()) {
            return "readonly";
        } else {
            return "";
        }
    }
});
