import LightningModal from 'lightning/modal';
import {api} from 'lwc';

export default class ModalUpdateOpp extends LightningModal {

       stageOptions = [

        { label: 'Prospecting', value: 'Prospecting' },
        { label: 'Qualification', value: 'Qualification'},
        { label: 'Needs Analysis', value: 'Needs Analysis' },
        { label: 'Value Proposition', value: 'Value Proposition' },
        { label: 'Id. Decision Makers', value: 'Id. Decision Makers' },
        { label: 'Perception Analysis', value: 'Perception Analysis' },
        { label: 'Proposal/Price Quote', value: 'Proposal/Price Quote' },
        { label: 'Negotiation/Review	', value: 'Negotiation/Review	' },
        { label: 'Closed Won', value: 'Closed Won' },
        { label: 'Closed Lost', value: 'Closed Lost' },

    ];
    fieldsValues = {};
    @api oppToUdpate;

    stageEdit;
    closeDateEdit;
    amountEdit;
    destinationEdit;
    startDateEdit;
    endDateEdit;
    numberOfParticipantsEdit;
    
        connectedCallback() {

            this.stageEdit = this.oppToUdpate.row.StageName;
            this.closeDateEdit = this.oppToUdpate.row.CloseDate;
            this.amountEdit = this.oppToUdpate.row.Amount;
            this.destinationEdit = this.oppToUdpate.row.Destination__c;
            this.startDateEdit = this.oppToUdpate.row.Start_Date__c;
            this.endDateEdit = this.oppToUdpate.row.End_Date__c;
            this.numberOfParticipantsEdit = this.oppToUdpate.row.Number_of_Participants__c;
        }

    handleChange(event){

        console.log('event.detals.name '+event.target.name+' : '+event.target.value);
       
        if(event.target.name=='stage'){
        
            this.stageEdit = event.target.value;
        }

        if(event.target.name=='closeDate'){
        
            this.closeDateEdit = event.target.value;
        }

        if(event.target.name=='amount'){
        
            this.amountEdit = event.target.value;
        }

        if(event.target.name=='destination'){
        console.log ('opp à update' + JSON.stringify(this.oppToUdpate, null, 2));
        console.log ('ligne à update' + this.oppToUdpate.row.Status__c);
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

            stage:this.stageEdit,
            closeDate:this.closeDateEdit,
            amount:this.amountEdit,
            Id:this.oppToUdpate.row.Id,
            destination:this.destinationEdit,
            startDate:this.startDateEdit,
            endDate:this.endDateEdit,
            numberOfParticipants:this.numberOfParticipantsEdit
        };
        let oppsString = JSON.stringify(this.fieldsValues);
        this.close(oppsString);
    }

    handleCancelClick() {
        this.close(null);
    }
}