export interface PrayerTimes {
    code: number;
    status: string;
    data: {
        date: {
            timestamp: number;
            date: string;
            weekday: string
        };
        timings: {
            Fajr: string;
            Sunrise: string;
            Dhuhr: string;
            Asr: string;
            Sunset: string;
            Maghrib: string;
            Isha: string;
        };
    };
}