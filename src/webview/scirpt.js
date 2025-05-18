// Acquire the VS Code API
const vscode = acquireVsCodeApi();

// Track if we've received data
let hasReceivedData = false;

// Listen for messages from the extension
window.addEventListener("message", (event) => {
	const message = event.data;
	logDebug("Received message:", message.command);

	switch (message.command) {
		case "updatePrayerTimes":
			hasReceivedData = true;
			if (message.prayerTimes) {
				initializePrayerTimes(message.prayerTimes);
			} else {
				logDebug("Received updatePrayerTimes but no prayer data");
			}
			break;
		default:
			logDebug("Unknown command received:", message.command);
	}
});

// Set up event listeners when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
	const refreshButton = document.getElementById("refresh-button");
	if (refreshButton) {
		refreshButton.addEventListener("click", () => {
			vscode.postMessage({
				command: "refresh",
			});
		});
	} else {
		logDebug("Warning: Refresh button not found in DOM");
	}
	vscode.postMessage({
		command: "ready",
	});
});
