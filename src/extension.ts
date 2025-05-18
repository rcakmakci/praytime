import * as vscode from 'vscode';
import { GeoLocationProvider } from './providers/GeoLocationProvider';
import { PrayerTimesProvider } from './providers/PrayerTimesProvider';
import { PrayerViewProvider } from './providers/PrayerViewProvider';

// Singleton instances
let prayerProvider: PrayerTimesProvider;
let geoProvider: GeoLocationProvider;
let prayerViewProvider: PrayerViewProvider;

// Track the WebView panel
let prayerViewRegistration: vscode.Disposable | undefined;

export async function activate(context: vscode.ExtensionContext) {
    console.log('PrayTime extension activating...');

    // Initialize providers
    geoProvider = new GeoLocationProvider(context.globalState);
    prayerProvider = new PrayerTimesProvider(geoProvider, context.globalState);
    prayerViewProvider = new PrayerViewProvider(context);

    // Register the WebView provider
    prayerViewRegistration = vscode.window.registerWebviewViewProvider(
        'prayerTimesView',
        prayerViewProvider
    );

    context.subscriptions.push(prayerViewRegistration);

    // Register refresh command
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.refreshPrayerTimes', () => refreshPrayerTimes())
    );

    // Wait a bit to ensure WebView is properly initialized before sending data
    setTimeout(async () => {
        await refreshPrayerTimes();
        console.log('PrayTime extension activated successfully');
    }, 1500);
}

async function refreshPrayerTimes() {
    try {
        console.log('Refreshing prayer times...');
        const prayerTimes = await prayerProvider.getPrayerTimes();
        console.log('Prayer times fetched successfully');

        // Send updated prayer times to WebView
        prayerViewProvider.updatePrayerTimes(prayerTimes);
    } catch (err) {
        console.error('Namaz vakitleri alınamadı:', err);
        vscode.window.showErrorMessage('Namaz vakitleri alınamadı');
    }
}

export function deactivate() {
    console.log('PrayTime extension deactivating...');

    // Clean up resources
    if (prayerViewRegistration) {
        prayerViewRegistration.dispose();
        prayerViewRegistration = undefined;
    }
}
