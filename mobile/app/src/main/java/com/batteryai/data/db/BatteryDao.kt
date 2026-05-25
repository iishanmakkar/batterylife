package com.batteryai.data.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface BatteryDao {
    @Insert
    suspend fun insertLog(log: BatteryLogEntity)

    @Query("SELECT * FROM battery_logs ORDER BY timestamp DESC LIMIT :limit")
    fun getRecentLogs(limit: Int): Flow<List<BatteryLogEntity>>
}
