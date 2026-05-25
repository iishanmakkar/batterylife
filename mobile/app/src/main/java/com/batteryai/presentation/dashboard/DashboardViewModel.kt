package com.batteryai.presentation.dashboard

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

data class DashboardState(
    val batteryLevel: Int = 84,
    val isCharging: Boolean = true,
    val healthPercent: Int = 98,
    val temperature: Float = 32.5f,
    val voltage: Float = 4.2f,
    val currentNow: Int = 1200
)

@HiltViewModel
class DashboardViewModel @Inject constructor() : ViewModel() {

    private val _state = MutableStateFlow(DashboardState())
    val state: StateFlow<DashboardState> = _state.asStateFlow()

    // Real implementation would collect from BatteryRepository Flow
}
