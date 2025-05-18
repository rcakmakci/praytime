import Location from "../models/Location";
import * as vscode from "vscode";

interface GeoIPResponse {
    country_name?: string;
    country?: string;
    city?: string;
}

export class GeoLocationProvider {
    private cachedLocation: Location | null = null;
    private readonly defaultLocation: Location = {
        Country: "Turkey",
        City: "Istanbul"
    };

    constructor(private readonly globalState: vscode.Memento) {
        this.cachedLocation = this.globalState.get("location") as Location | null;
    }

    public setLocation(location: Location): void {
        this.cachedLocation = location;
        this.globalState.update("location", location);
    }

    public async getLocationFromIP(): Promise<Location> {
        if (this.cachedLocation) {
            return this.cachedLocation;
        }

        try {
            // Try multiple geolocation APIs in case one fails
            return await this.tryGeoLocationAPIs();
        } catch (error) {
            console.error('GeoLocationProvider:getLocation error, using default.', error);
            return this.defaultLocation;
        }
    }

    private async tryGeoLocationAPIs(): Promise<Location> {
        const apis = [
            'https://ipapi.co/json/',
            'https://ipinfo.io/json',
            'https://ip-api.com/json'
        ];

        for (const api of apis) {
            try {
                const response = await fetch(api, {
                    headers: { 'User-Agent': 'VSCode-PrayTime-Extension/0.0.1' }
                });

                if (!response.ok) {
                    continue;
                }

                const data = await response.json() as GeoIPResponse;

                // Handle different API response formats
                let country = '';
                let city = '';

                if (data.country_name) {
                    country = data.country_name;
                    city = data.city || '';
                } else if (data.country) {
                    country = data.country;
                    city = data.city || '';
                }

                if (country && city) {
                    const location: Location = {
                        Country: country,
                        City: city,
                    };
                    this.setLocation(location);
                    return location;
                }
            } catch (e) {
                console.warn(`Failed to fetch from ${api}:`, e);
                // Continue to the next API
            }
        }

        // If all APIs fail, use default
        throw new Error('All geolocation APIs failed');
    }
}

