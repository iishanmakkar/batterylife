package com.batteryai

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.batteryai.presentation.theme.BatteryAITheme
import com.batteryai.presentation.dashboard.DashboardScreen
import com.batteryai.services.BatteryMonitorService
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Start Foreground Service for Real-time Monitoring
        val serviceIntent = Intent(this, BatteryMonitorService::class.java)
        startService(serviceIntent) // or startForegroundService for Android O+

        setContent {
            BatteryAITheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    DashboardScreen()
                }
            }
        }
    }
}
