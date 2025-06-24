import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class ModalCreateTrip extends LightningModal {

    @api options = [];
    newTripId; 

    handleCloseClick() {
        this.close('canceled');
  }

handleSuccess(event) {
        this.newTripId = event.detail.id;
    if (this.newTripId) {
        this.close('success');
    }
}
}