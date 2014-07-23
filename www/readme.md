cordova create storelocator com.ariemtech.storelocator StoreLocator
cd storelocator
cordova platform add ios android

cordova plugin add org.apache.cordova.geolocation
config.xml
  <feature name="Geolocation">
        <param name="android-package" value="org.apache.cordova.geolocation.GeoBroker" />
    </feature>


Copied css file js directory lib directory and corodva cordovaunder www

Add to platforms/android/src/com/ariemtech/storelocator/StoreLocator.java
import android.webkit.WebView;
