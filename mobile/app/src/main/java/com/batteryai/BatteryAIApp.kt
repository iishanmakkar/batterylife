package com.batteryai

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class BatteryAIApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize AdMob, Analytics, etc.
    }
}
