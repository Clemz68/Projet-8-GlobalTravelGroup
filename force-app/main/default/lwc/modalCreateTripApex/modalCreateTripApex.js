import LightningModal from 'lightning/modal';

export default class ModalCreateTripApex extends LightningModal {

    statusOptions = [
        { label: 'Terminé', value: 'Terminé' },
        { label: 'En cours', value: 'En cours'},
        { label: 'A venir', value: 'A venir' },
        { label: 'Annulé', value: 'Annulé' },
    ];
    fieldsValues = {};

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
       this.fieldsValues = {...this.fieldsValues, [name]: value};
    };

    handleSaveClick() {
        // fermer le modal en renvoyant les données saisies
        let tripsString = JSON.stringify(this.fieldsValues);
        this.close(tripsString);
    }

    handleCancelClick() {
        this.close(null);
    }
}