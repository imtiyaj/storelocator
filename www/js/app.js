angular.module('ionic.example', ['ionic','ngAutocomplete'])

    .controller('MapCtrl', function($scope, $ionicLoading, $http,$compile) {
        $scope.options3 = {
            //types: '(cities)',
            country: 'in'         //Search only in India
            //types: 'establishment'
        };
        var storemarkers= [
            {
                lat: 13,
                long: 78.23,
                shopname: 'Biocon Pharma',
                phone: 9845334723,
                address:"213, 2n cross, Koramangala",
                city: 'Banglore'
            },
            {
                lat: 12.95,
                long: 77.6052,
                shopname: 'NGV Medicals',
                phone: 9845334432,
                address:"213, 2n cross, NGV Koramangala",
                city: 'Banglore'
            }
        ];
        var storesfound=[]
        var latlongPerUnitDistance = 111000 //meters
        //for 1km radius the difference bet center and lat long is 1000/111000 =1/111
        // find all the stores with <1/111 degree distance.
        //  them in new marker arrary and mark them.
        var radius= 1.00 //  .01 //approximated 1000/111000;
        var center  =new google.maps.LatLng(13, 78.232424241);

        var findStoresInRadius=function(center, radius) {
            for (var i = 0; i < storemarkers.length; i++) {
                if (testInRadius(center,storemarkers[i], radius)) {
                    console.log("store found")
                    console.log(storemarkers[i])
                    storesfound.push(storemarkers[i]);
                }     //radius in meter
            }
        }
        var testInRadius = function(center,store,radius){
            console.log("center position")

            console.log(center)
            if(Math.abs(store.lat - center.k)> radius) return
            if(Math.abs(store.long - center.B)> radius) return
            return true;
        }

        var myLatlng;
        document.addEventListener("deviceready", function() {
            //window.cache.clear( success, error );
            $scope.details1;
            $scope.result1;
            $scope.$watch('details1', function () {
                if ($scope.details1) {
                    console.log($scope.details1.geometry.location.lat(), $scope.details1.geometry.location.lng())
                    console.log($scope.details1.formatted_address)
                    console.log($scope.details1)
                    var myLatlng = new google.maps.LatLng($scope.details1.geometry.location.lat(),
                        $scope.details1.geometry.location.lng());
                    for (var i = 0; i < markers.length; i++) {
                        console.log("clearing marker")
                        console.log(markers[i])
                        markers[i].setMap(null);
                        markers.pop();
                    }
                    $scope.map.setCenter(myLatlng )
                    //setup a blue marker for the new search address.
                    setMarker(myLatlng,$scope.details1.formatted_address )
                    storesfound.length=0;

                    //set markers for stores..
                    console.log(myLatlng)
                    findStoresInRadius(myLatlng,radius);
                    for(var i = 0; i < storesfound.length; i++){
                        createMarker(storesfound[i]);
                    }
                }
            });
        })

        function initialize() {
            var myLatlng = center;

            var mapOptions = {
                center: myLatlng,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            $scope.map = map;

            findStoresInRadius(center,radius);

        }
        google.maps.event.addDomListener(window, 'load', initialize);
        var infoWindow = new google.maps.InfoWindow();

        var setMarker=function(lating, info)  {

            var marker = new google.maps.Marker({position:lating,map:$scope.map,title:info})
            infoWindow.setContent(info);
            infoWindow.open($scope.map, marker);

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent(info);
                infoWindow.open($scope.map, marker);
            });
            //markers.push(marker);   we don't want to remove these markers.

        }

        var markers=[];
        var createMarker = function (info) {

            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                shopname: info.shopname,
                phone: info.phone,
                address: info.address,
                city: info.city
            });

//            console.log("latlangobject")
//            var latlng
//            console.log(latlng=new google.maps.LatLng(info.lat, info.long))
//            console.log(latlng.k, latlng.B)


            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<h3>' + marker.shopname + '&nbsp' + marker.phone + '</h3>'
                    + '<hr>' + marker.address + '&nbsp' + marker.city);
                infoWindow.open($scope.map, marker);
            });
            markers.push(marker);
        }


        $scope.centerOnMe = function() {
            if(!$scope.map) {
                return;
            }

//            $scope.loading = $ionicLoading.show({
//                content: 'Getting current location...',
//                showBackdrop: false
//            });
            var options =  { timeout: 30000, enableHighAccuracy: false, maximumAge: 10000 };
            $scope.map.setCenter(new google.maps.LatLng(10, 79)) ;
            //navigator.geolocation.getCurrentPosition(function(pos) {     Not working..timing out on device
            navigator.geolocation.getCurrentPosition(function(pos) {
                console.log(pos);
                var mylating
                $scope.map.setCenter(mylating=new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                setMarker(mylating, "MyLocation")
                console.log("Your Location")
                console.log(mylating)
                //$scope.loading.hide();
                //$ionicLoading.hide();
                //clear markers
                for (var i = 0; i < markers.length; i++) {
                    console.log("clearing marker")
                    console.log(markers[i])
                    markers[i].setMap(null);
                    markers.pop();
                }
                storesfound.length=0;
                findStoresInRadius(mylating,radius);
                for(var i = 0; i < storesfound.length; i++){
                    createMarker(storesfound[i]);
                }
            }, function(error) {
                alert('code: '    + error.code    + '\n' +
                    'message: ' + error.message + '\n')
            }, options);
        };

        $scope.clickTest = function() {
            alert('Example of infowindow with ng-click')
        };

    });