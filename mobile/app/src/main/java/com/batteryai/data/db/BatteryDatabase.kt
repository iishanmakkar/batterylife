package com.batteryai.data.db

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [BatteryLogEntity::class], version = 1, exportSchema = false)
abstract class BatteryDatabase : RoomDatabase() {
    abstract val batteryDao: BatteryDao
}
