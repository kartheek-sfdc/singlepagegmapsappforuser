@isTest
public class MultiRequestMock implements HttpCalloutMock {
    Map<String, HttpCalloutMock> requests;
    //Method for multi request Mock
    public MultiRequestMock(Map<String, HttpCalloutMock> requests) {
        this.requests = requests;
    }
    //Method to capture http response
    public HTTPResponse respond(HTTPRequest req) {
	HttpCalloutMock mock = requests.get(req.getEndpoint());
	    if (mock != null) {
	        return mock.respond(req);
            } else {
     		System.assert(false, 'unexpected endpoint ' + req.getEndpoint());
                return null;
	    }
    }
}