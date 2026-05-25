package com.batteryai.data.db

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "battery_logs")
data class BatteryLogEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val timestamp: Long,
    val level: Int,
    val status: Int,
    val temperature: Float,
    val voltage: Float,
    val isCharging: Boolean
)
