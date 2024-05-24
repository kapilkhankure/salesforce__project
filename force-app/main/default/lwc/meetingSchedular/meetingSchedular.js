import { LightningElement, track } from 'lwc';
import getMeetingsByDate from '@salesforce/apex/njkhkd.getMeetingsByDate';
import getGuestDetailsByMeetingId from '@salesforce/apex/njkhkd.getGuestDetailsByMeetingId';
import { NavigationMixin } from 'lightning/navigation';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Meeting Date', fieldName: 'Meeting_Date__c', type: 'date' },
    { label: 'Priority', fieldName: 'Priority__c' },
    { label: 'Description', fieldName: 'Description__c' },
    {
        type: 'button',
        typeAttributes: { label: 'View Guests', name: 'view_guests', title: 'View Guests' }
    }
];

const GUEST_COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Title', fieldName: 'Title' }
];

export default class MeetingDetails extends LightningElement {
    @track meetings;
    @track guestDetails;
    @track selectedMeeting;

    columns = COLUMNS;
    guestColumns = GUEST_COLUMNS;

    handleDateChange(event) {
        const filterDate = event.target.value;
        getMeetingsByDate({ filterDate })
            .then(result => {
                this.meetings = result;
                this.selectedMeeting = null;
                this.guestDetails = null;
            })
            .catch(error => {
                console.error('Error fetching meetings: ', error);
            });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'view_guests') {
            const meetingId = row.Id;
            this.selectedMeeting = row;
            getGuestDetailsByMeetingId({ meetingId })
                .then(result => {
                    this.guestDetails = result;
                })
                .catch(error => {
                    console.error('Error fetching guest details: ', error);
                });
        }
    }

    handleRedirect() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.selectedMeeting.Id,
                objectApiName: 'Meeting__c',
                actionName: 'view'
            }
        });
    }
}
