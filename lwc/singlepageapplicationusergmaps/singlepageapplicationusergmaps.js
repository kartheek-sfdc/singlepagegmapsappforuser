import { LightningElement } from 'lwc';
import getAddressRecommendations from '@salesforce/apex/Singlepageusergmapapexclass.getAddressRecommendations';
import getAddressDetailsByPlaceId from '@salesforce/apex/Singlepageusergmapapexclass.getAddressDetailsByPlaceId';
import getAddressDistanceByLng from '@salesforce/apex/Singlepageusergmapapexclass.getAddressDistanceByLng';

const columns = [
    { label: 'Origin Address', fieldName: 'originAddress',wrapText: true },
    { label: 'Destination Address', fieldName: 'destinationAddress',wrapText: true },
    { label: 'Distance', fieldName: 'distance',wrapText: true },
    { label: 'Driving Cost', fieldName: 'drivingCost',wrapText: true},
    { label: 'Driving TravelTime', fieldName: 'drivingTime',wrapText: true},
    { label: 'Flying Cost', fieldName: 'flyingCost',wrapText: true},
];
export default class Singlepageapplicationusergmaps extends LightningElement {
    showSpinner = false;
    addressRecommendations = null;
    selectedAddress = '';
    addressDetail = {};

    addressRecommendationsDestination = null;
    selectedAddressDestination = '';
    addressDetailDestination = {};
    sourceLat;
    sourceLng;
    destinationLat;
    destinationLng;
    tableData = [];
    tableColumns = columns;
    isTableShow = false;

    get hasRecommendations() {
        return (this.addressRecommendations !== null /*&& this.addressRecommendations.length > 0*/);
    }

    get hasRecommendationsDestination() {
        return (this.addressRecommendationsDestination !== null);
    }
    
    handleChange(event) {
        //event.preventDefault();
        let searchText = event.target.value;
        console.log('searchText-- '+searchText);
        if (searchText) 
            this.getAddressRecommendations(searchText);
        else 
            this.addressRecommendations = null;
    }

    handleChangeDestination(event) {
        //event.preventDefault();
        let searchText = event.target.value;
        console.log('searchText-- '+searchText);
        if (searchText) 
            this.getAddressRecommendationsDestination(searchText);
        else 
            this.addressRecommendationsDestination = null;
    }
 
    getAddressRecommendationsDestination(searchText) {
        getAddressRecommendations({ searchText: searchText })
            .then(response => {
                response = JSON.parse(response);
                console.log('response-- '+JSON.stringify(response));
                let addressRecommendationsDestination = [];
                console.log('test1');
                response.predictions.forEach(prediction => {
                    addressRecommendationsDestination.push({
                        main_text: prediction.structured_formatting.main_text,
                        secondary_text: prediction.structured_formatting.secondary_text,
                        place_id: prediction.place_id,
                    });
                });
                console.log('test2');
                this.addressRecommendationsDestination = addressRecommendationsDestination;
                console.log('test3');
            }).catch(error => {
                console.log('error : ' + JSON.stringify(error));
            });
    }

    getAddressRecommendations(searchText) {
        getAddressRecommendations({ searchText: searchText })
            .then(response => {
                response = JSON.parse(response);
                console.log('response-- '+JSON.stringify(response));
                let addressRecommendations = [];
                console.log('test1');
                response.predictions.forEach(prediction => {
                    addressRecommendations.push({
                        main_text: prediction.structured_formatting.main_text,
                        secondary_text: prediction.structured_formatting.secondary_text,
                        place_id: prediction.place_id,
                    });
                });
                console.log('test2');
                this.addressRecommendations = addressRecommendations;
                console.log('test3');
            }).catch(error => {
                console.log('error : ' + JSON.stringify(error));
            });
    }
 
    handleAddressRecommendationSelectDestination(event) {
        //event.preventDefault();
        let placeId = event.currentTarget.dataset.value;
        console.log('placeId-- '+placeId);
        this.addressRecommendationsDestination = null;
        this.selectedAddressDestination = '';
        getAddressDetailsByPlaceId({ placeId: placeId })
            .then(response => {
                response = JSON.parse(response);
                this.destinationLat = response.result.geometry.location.lat;
                this.destinationLng = response.result.geometry.location.lng;
                console.log('response address after select- '+JSON.stringify(response));
                response.result.address_components.forEach(address => {
                    let type = address.types[0];
                    switch (type) {
                        case 'premise':
                            this.selectedAddressDestination = this.selectedAddressDestination + ' ' + address.long_name;
                            this.addressDetailDestination.premise = address.long_name;
                            break;
                        case 'locality':
                            this.selectedAddressDestination = this.selectedAddressDestination + ' ' + address.long_name;
                            this.addressDetailDestination.city = address.long_name;
                            break;
                        case 'country':
                            this.selectedAddressDestination = this.selectedAddressDestination + ' ' + address.long_name;
                            this.addressDetailDestination.country = address.long_name;
                            break;
                        case 'administrative_area_level_1':
                            this.selectedAddressDestination = this.selectedAddressDestination + ' ' + address.short_name;
                            this.addressDetailDestination.state = address.short_name;
                            break;
                        case 'postal_code':
                            this.selectedAddressDestination = this.selectedAddressDestination + ' ' + address.long_name;
                            this.addressDetailDestination.postalCode = address.long_name;
                            break;
                        case 'sublocality_level_2':
                            this.selectedAddressDestination = this.selectedAddressDestination + ' ' + address.long_name;
                            this.addressDetailDestination.subLocal2 = address.long_name;
                            break;
                        case 'sublocality_level_1':
                            this.selectedAddressDestination = this.selectedAddressDestination + ' ' + address.long_name;
                            this.addressDetailDestination.subLocal1 = address.long_name;
                            break;
                        case 'street_number':
                            this.selectedAddressDestination = this.selectedAddressDestination + ' ' + address.long_name;
                            this.addressDetailDestination.streetNumber = address.long_name;
                            break;
                        case 'route':
                            this.selectedAddressDestination = this.selectedAddressDestination + ' ' + address.short_name;
                            this.addressDetailDestination.route = address.short_name;
                            break;
                        default:
                            break;
                    }
                });
            })
            .catch(error => {
                console.log('error : ' + JSON.stringify(error));
            });
    }
    

    handleAddressRecommendationSelect(event) {
        //event.preventDefault();
        let placeId = event.currentTarget.dataset.value;
        console.log('placeId-- '+placeId);
        this.addressRecommendations = null;
        this.selectedAddress = '';
        getAddressDetailsByPlaceId({ placeId: placeId })
            .then(response => {
                response = JSON.parse(response);
                console.log('response address after select- '+JSON.stringify(response));
                this.sourceLat = response.result.geometry.location.lat;
                this.sourceLng = response.result.geometry.location.lng;
                response.result.address_components.forEach(address => {
                    let type = address.types[0];
                    switch (type) {
                        case 'premise':
                            this.selectedAddress = this.selectedAddress + ' ' + address.long_name;
                            this.addressDetail.premise = address.long_name;
                            break;
                        case 'locality':
                            this.selectedAddress = this.selectedAddress + ' ' + address.long_name;
                            this.addressDetail.city = address.long_name;
                            break;
                        case 'country':
                            this.selectedAddress = this.selectedAddress + ' ' + address.long_name;
                            this.addressDetail.country = address.long_name;
                            break;
                        case 'administrative_area_level_1':
                            this.selectedAddress = this.selectedAddress + ' ' + address.short_name;
                            this.addressDetail.state = address.short_name;
                            break;
                        case 'postal_code':
                            this.selectedAddress = this.selectedAddress + ' ' + address.long_name;
                            this.addressDetail.postalCode = address.long_name;
                            break;
                        case 'sublocality_level_2':
                            this.selectedAddress = this.selectedAddress + ' ' + address.long_name;
                            this.addressDetail.subLocal2 = address.long_name;
                            break;
                        case 'sublocality_level_1':
                            this.selectedAddress = this.selectedAddress + ' ' + address.long_name;
                            this.addressDetail.subLocal1 = address.long_name;
                            break;
                        case 'street_number':
                            this.selectedAddress = this.selectedAddress + ' ' + address.long_name;
                            this.addressDetail.streetNumber = address.long_name;
                            break;
                        case 'route':
                            this.selectedAddress = this.selectedAddress + ' ' + address.short_name;
                            this.addressDetail.route = address.short_name;
                            break;
                        default:
                            break;
                    }
                });
            })
            .catch(error => {
                console.log('error : ' + JSON.stringify(error));
            });
    }

    handleCalculate(){
        this.showSpinner = true;
        this.isTableShow = true;
        console.log('selectedAddress-- '+this.selectedAddress);
        console.log('source -- lat  '+this.sourceLat+'  --- lng-- '+this.sourceLng);
        console.log('selectedAddressDestination-- '+this.selectedAddressDestination);
        console.log('destination -- lat  '+this.destinationLat+'  --- lng-- '+this.destinationLng);
        this.tableData = [];
        getAddressDistanceByLng({ sLat: this.sourceLat , sLng: this.sourceLng , dLat: this.destinationLat , dLng: this.destinationLng })
            .then(response => {
                //response = JSON.parse(response);
                console.log('response distance-- '+JSON.stringify(response));
                this.tableData = response;
                console.log('this.tableData -- '+JSON.stringify(this.tableData));
                this.showSpinner = false;
            }).catch(error => {
                console.log('error : ' + JSON.stringify(error));
                this.showSpinner = false;
            });
    }
}