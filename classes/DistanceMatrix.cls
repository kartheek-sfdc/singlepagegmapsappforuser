public class DistanceMatrix {

        public List<String> destination_addresses;
        public List<String> origin_addresses;
        public List<Rows> rows;
        public String status;
        //Method to define main Elements
        public class Elements {
            public Distance distance;
            public Distance duration;
            public String status;
        }
        //Method to define Distance Elements
        public class Distance {
            public String text;
            public Integer value;
        }
        //Method to capture list of Elements
        public class Rows {
            public List<Elements> elements;
        }

        //Method to calculate distance
        public static DistanceMatrix parse(String json) {
            return (DistanceMatrix) System.JSON.deserialize(json, DistanceMatrix.class);
        }
    }