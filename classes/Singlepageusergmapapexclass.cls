/**
* @author: Kartheek T
* @date: 03/2023
*
* @group: Address
* @group-content: Address populate and calculate distance
*
* @description: Populate origin and destination address and calculate the distance between two address and travel time and travel cost.
*/
public with sharing class Singlepageusergmapapexclass {
    String vHash = 'S2FydGhlZWsgVGh1bW1hbGE=';

    /*******************************************************************************************************
    * @description: Method to call Google Map API and fetch the address recommendations 
    * @param: address name
    * @return: all the recomendate address
    */
    @AuraEnabled
    public static String getAddressRecommendations(String searchText){
        String apiKey = 'AIzaSyA7Xv1Wy18pk0S5Up7b4gsZvzut5PZqzxc';//YOUR_API_KEY
        String result = null;
        try{
            if(searchText != null){
                String apiUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + searchText.replace(' ', '%20') + '&key=' + apiKey; 
                system.debug('apiUrl-- '+apiUrl);
                HttpRequest req = new HttpRequest();
                req.setMethod('GET');
                req.setEndpoint(apiUrl);
                Http http = new Http();
                HttpResponse res = http.send(req);
                Integer statusCode = res.getStatusCode();
                if(statusCode == 200){
                    result = res.getBody();
                }
            }
        } catch(exception e){
            System.debug(e.getMessage());
        }
        return result;
    }
    
    //Method to call Google Map API and fetch the address details by placeId 
    @AuraEnabled
    public static String getAddressDetailsByPlaceId(String placeId){
        String apiKey = 'AIzaSyA7Xv1Wy18pk0S5Up7b4gsZvzut5PZqzxc';//YOUR_API_KEY
        String result = null;
        try{
            if(placeId != null){
                String apiUrl = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeId.replace(' ', '%20') + '&key=' + apiKey; 
                system.debug('apiUrl-- '+apiUrl);
                HttpRequest req = new HttpRequest();
                req.setMethod('GET');
                req.setEndpoint(apiUrl);
                Http http = new Http();
                HttpResponse res = http.send(req);
                Integer statusCode = res.getStatusCode();
                if(statusCode == 200){
                    result = res.getBody();
                }
            }
        } catch(exception e){
            System.debug(e.getMessage());
        }
        return result;
    }
    //Method to call Google Map API and fetch the address details by Source and destination geo codes
    @AuraEnabled
    public static list<WrapperClass> getAddressDistanceByLng(String sLat, String sLng, String dLat,String dLng){
        String apiKey = 'AIzaSyA7Xv1Wy18pk0S5Up7b4gsZvzut5PZqzxc';//YOUR_API_KEY
        String result = null;
        list<WrapperClass> wccList = new list<WrapperClass>();
        WrapperClass wc = new WrapperClass();
        try{
            if(sLat != null && sLng != null && dLat != null && dLng != null){
                String apiUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json' + '?origins=' + sLat+ ',' + sLng + '&destinations=' + dLat+ ',' + dLng + '&mode=driving' + '&sensor=false' + '&language=en' + '&units=imperial'+ '&key=' + apiKey; 
                System.debug('endUrl-- '+apiUrl);
                HttpRequest req = new HttpRequest();
                req.setMethod('GET');
                req.setEndpoint(apiUrl);
                Http http = new Http();
                HttpResponse res = http.send(req);
                Integer statusCode = res.getStatusCode();
                if(statusCode == 200){
                    result = res.getBody();
                    system.debug('result-- '+JSON.serialize(result));
                    Map<String,Decimal> costMap = new Map<String,Decimal>();
                    list<Cost_of_Travel_Rate_Per_Mile__mdt> mDataLists = [SELECT Cost_Per_Mile__c, Travel_Mode__c FROM Cost_of_Travel_Rate_Per_Mile__mdt];
                    for(Cost_of_Travel_Rate_Per_Mile__mdt mData : mDataLists){
                        costMap.put(mData.Travel_Mode__c,mData.Cost_Per_Mile__c);
                    }
                    DistanceMatrix dm = DistanceMatrix.parse(result);
                    wc.originAddress = string.join(dm.origin_addresses,', ');
                    wc.destinationAddress = string.join(dm.destination_addresses,', ');
                    wc.distance = dm.rows[0].elements[0].distance.text;
                    String distance = dm.rows[0].elements[0].distance.text;
                    String[] disArr = distance.split(' ');
                    Decimal driveCost = costMap.get('Driving') * Decimal.valueOf(disArr[0].remove(','));
                    wc.drivingCost = '$'+String.valueOf(driveCost.setscale(2));
                    Decimal flyCost = costMap.get('Flying') * Decimal.valueOf(disArr[0].remove(','));
                    wc.flyingCost = '$'+String.valueOf(flyCost.setscale(2));
                    wc.drivingTime = dm.rows[0].elements[0].duration.text;
                    wccList.add(wc);
                }
            }
        } catch(exception e){
            System.debug(e.getMessage());
        }
        System.debug('wc-- '+JSON.serialize(wc));

        return wccList;
    }

    public class WrapperClass{
        @AuraEnabled public string originAddress;
        @AuraEnabled public string destinationAddress;
        @AuraEnabled public string distance;
        @AuraEnabled public string drivingCost;
        @AuraEnabled public string drivingTime;
        @AuraEnabled public string flyingCost;
    }   
}