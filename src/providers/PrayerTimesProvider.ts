import * as vscode from "vscode";
import { PrayerTimes } from "../models/PrayerTimes";
import { GeoLocationProvider } from "./GeoLocationProvider";

export class PrayerTimesProvider {
    private readonly cacheKey = "prayerTimesCache";

    constructor(
        private readonly geoLocationProvider: GeoLocationProvider,
        private readonly globalState: vscode.Memento
    ) { }

    public async getPrayerTimes(): Promise<PrayerTimes> {
        const today = new Date().toISOString().split("T")[0];
        const cache = this.globalState.get<Record<string, PrayerTimes>>(this.cacheKey) ?? {};

        if (cache[today]) {
            return cache[today];
        }

        try {
            const location = await this.geoLocationProvider.getLocationFromIP();

            // Use aladhan.com API instead of pray.zone
            const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
                location.City
            )}&country=${encodeURIComponent(location.Country)}&method=14`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch prayer times: ${response.status}`);
            }

            const apiResponse = await response.json() as any;

            if (apiResponse.code !== 200 || !apiResponse.data) {
                throw new Error(`Invalid response from prayer times API: ${apiResponse.status || 'Unknown error'}`);
            }

            // Map to our model
            const prayerTimes: PrayerTimes = {
                code: apiResponse.code,
                status: apiResponse.status,
                data: {
                    date: {
                        timestamp: Number(apiResponse.data.date.timestamp),
                        date: apiResponse.data.date.gregorian.date,
                        weekday: apiResponse.data.date.gregorian.weekday.en,
                    },
                    timings: {
                        Fajr: apiResponse.data.timings.Fajr,
                        Sunrise: apiResponse.data.timings.Sunrise,
                        Dhuhr: apiResponse.data.timings.Dhuhr,
                        Asr: apiResponse.data.timings.Asr,
                        Sunset: apiResponse.data.timings.Sunset,
                        Maghrib: apiResponse.data.timings.Maghrib,
                        Isha: apiResponse.data.timings.Isha,
                    },
                },
            };

            cache[today] = prayerTimes;
            await this.globalState.update(this.cacheKey, cache);

            return prayerTimes;
        } catch (error) {
            console.error('Error fetching prayer times:', error);

            // If there's an error, create fallback data
            const fallback: PrayerTimes = {
                code: 0,
                status: "Error",
                data: {
                    date: {
                        timestamp: Date.now() / 1000,
                        date: today,
                        weekday: new Date().toLocaleDateString('en-US', { weekday: 'long' })
                    },
                    timings: {
                        Fajr: "--:--",
                        Sunrise: "--:--",
                        Dhuhr: "--:--",
                        Asr: "--:--",
                        Sunset: "--:--",
                        Maghrib: "--:--",
                        Isha: "--:--",
                    }
                }
            };

            return fallback;
        }
    }
}
