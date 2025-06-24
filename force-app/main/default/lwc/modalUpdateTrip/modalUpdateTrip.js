import LightningModal from 'lightning/modal';
import {api} from 'lwc';

export default class ModalUpdateTrip extends LightningModal {

    statusOptions = [
        { label: 'Terminé', value: 'Terminé' },
        { label: 'En cours', value: 'En cours'},
        { label: 'A venir', value: 'A venir' },
        { label: 'Annulé', value: 'Annulé' },
    ];
    fieldsValues = {};
    @api tripToUdpate;

    statusEdit;
    destinationEdit;
    startDateEdit;
    endDateEdit;
    numberOfParticipantsEdit;
    
        connectedCallback() {
                this.statusEdit = this.tripToUdpate.row.Status__c;
                this.destinationEdit = this.tripToUdpate.row.Destination__c;
                this.startDateEdit = this.tripToUdpate.row.Start_Date__c;
                this.endDateEdit = this.tripToUdpate.row.End_Date__c;
                this.numberOfParticipantsEdit = this.tripToUdpate.row.Number_of_Participants__c;
        }

    handleChange(event){

        console.log('event.detals.name '+event.target.name+' : '+event.target.value);
       
        if(event.target.name=='status'){
            console.log ('trip à update' + JSON.stringify(this.tripToUdpate, null, 2));
        console.log ('ligne à update' + this.tripToUdpate.row.Status__c);
            this.statusEdit = event.target.value;
        }

        if(event.target.name=='destination'){
            this.destinationEdit = event.target.value;
        }

        if(event.target.name=='startDate'){
            this.startDateEdit = event.target.value;
        }

        if(event.target.name=='endDate'){
            this.endDateEdit = event.target.value;
        }
        if(event.target.name=='numberOfParticipants'){
            this.numberOfParticipantsEdit = event.target.value;
        }
    }

    handleSaveClick() {
        // fermer le modal en renvoyant les données saisies
            this.fieldsValues = {
            id:this.tripToUdpate.row.Id,
            status:this.statusEdit,
            destination:this.destinationEdit,
            startDate:this.startDateEdit,
            endDate:this.endDateEdit,
            numberOfParticipants:this.numberOfParticipantsEdit
        };
        let tripsString = JSON.stringify(this.fieldsValues);
        this.close(tripsString);
    }

    handleCancelClick() {
        this.close(null);
    }
}