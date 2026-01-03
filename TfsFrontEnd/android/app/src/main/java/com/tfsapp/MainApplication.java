package com.tfsapp;

import com.facebook.react.PackageList;
import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import java.util.ArrayList;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        
        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }
        
       
        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, false);

    // 🚀 Initialize Fresco to prevent ImagePipeline crashes
    Fresco.initialize(this);

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      DefaultNewArchitectureEntryPoint.load();
    }

    // 🛠 Safe Flipper init (won't crash if unavailable or removed)
    if (BuildConfig.DEBUG) {
      try {
        Class<?> flipperClass = Class.forName("com.tfsapp.ReactNativeFlipper");
        flipperClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, this, getReactNativeHost().getReactInstanceManager());
      } catch (Exception e) {
        // Flipper not found or failed to load — ignore safely
      }
    }
  }
}