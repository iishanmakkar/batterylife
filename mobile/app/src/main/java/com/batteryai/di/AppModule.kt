package com.batteryai.di

import android.app.Application
import androidx.room.Room
import com.batteryai.data.db.BatteryDatabase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideBatteryDatabase(app: Application): BatteryDatabase {
        return Room.databaseBuilder(
            app,
            BatteryDatabase::class.java,
            "battery_ai_db"
        ).build()
    }

    @Provides
    @Singleton
    fun provideBatteryDao(db: BatteryDatabase) = db.batteryDao
}
