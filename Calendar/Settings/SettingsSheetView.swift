import SwiftUI

struct SettingsSheetView: View {
    @ObservedObject private var notificationManager = EventNotificationManager.shared
    @State private var weatherAlertNotificationsEnabled =
        WeatherAlertNotificationManager.notificationsEnabled
    @AppStorage(EventSharePromptSettings.userDefaultsKey)
    private var eventSharePromptEnabled = true

    private let bottomContentInset: CGFloat

    init(bottomContentInset: CGFloat = 0) {
        self.bottomContentInset = bottomContentInset
    }

    var body: some View {
        Form {
            notificationSection

            if bottomContentInset > 0 {
                Section {
                    Color.clear
                        .frame(height: bottomContentInset)
                        .listRowInsets(EdgeInsets())
                        .listRowSeparator(.hidden)
                        .listRowBackground(Color.clear)
                        .accessibilityHidden(true)
                }
            }
        }
        .scrollContentBackground(.hidden)
        .background(Color.clear)
        .listRowBackground(Color.clear)
        .onAppear {
            weatherAlertNotificationsEnabled =
                WeatherAlertNotificationManager.notificationsEnabled
            notificationManager.refreshAuthorizationStatus()
        }
    }

    private var notificationSection: some View {
        Section {
            VStack(alignment: .leading, spacing: 10) {
                Toggle(isOn: notificationToggleBinding) {
                    HStack(spacing: 12) {
                        Image(systemName: notificationsToggleIsOn ? "bell.fill" : "bell.slash")
                            .font(.title3)
                            .foregroundColor(.blue)
                            .frame(width: 28, height: 28)

                        Text(LocalizedStringKey("Event Notifications"))
                            .font(.headline)
                    }
                }

                Divider()

                Toggle(isOn: weatherNotificationToggleBinding) {
                    HStack(spacing: 12) {
                        Image(
                            systemName: weatherNotificationsToggleIsOn
                                ? "exclamationmark.triangle.fill"
                                : "exclamationmark.triangle"
                        )
                        .font(.title3)
                        .foregroundColor(.orange)
                        .frame(width: 28, height: 28)

                        Text(LocalizedStringKey("Weather Alert Notifications"))
                            .font(.headline)
                    }
                }

                Divider()

                Toggle(isOn: eventSharePromptToggleBinding) {
                    HStack(spacing: 12) {
                        Image(
                            systemName: eventSharePromptEnabled
                                ? "square.and.arrow.up.fill"
                                : "square.and.arrow.up"
                        )
                        .font(.title3)
                        .foregroundColor(.blue)
                        .frame(width: 28, height: 28)

                        Text(LocalizedStringKey("Share Pop-up"))
                            .font(.headline)
                    }
                }

                if weatherAlertNotificationsEnabled
                    && !notificationManager.eventNotificationsEnabled
                    && !notificationManager.notificationsAllowed {
                    if notificationManager.canAskForPermission {
                        Text(LocalizedStringKey("Allow notifications so weather alerts can appear."))
                            .font(.footnote)
                            .foregroundColor(.secondary)
                    } else {
                        Text(LocalizedStringKey("Notifications are turned off for this app. To enable them go to: Settings -> Apps -> Cloud Calendars -> Notifications -> Allow Notifications."))
                            .font(.footnote)
                            .foregroundColor(.secondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }

                if notificationManager.eventNotificationsEnabled
                    && !notificationManager.notificationsAllowed {
                    if notificationManager.canAskForPermission {
                        Text(LocalizedStringKey("Allow notifications so event alerts can appear at the right time."))
                            .font(.footnote)
                            .foregroundColor(.secondary)
                    } else {
                        Text(LocalizedStringKey("Notifications are turned off for this app. To enable them go to: Settings -> Apps -> Cloud Calendars -> Notifications -> Allow Notifications."))
                            .font(.footnote)
                            .foregroundColor(.secondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }
            .padding(.vertical, 6)
            .listRowSeparator(.hidden)
            .listRowBackground(Color.clear)
        }
    }

    private var notificationsToggleIsOn: Bool {
        notificationManager.eventNotificationsEnabled
            && notificationManager.notificationsAllowed
    }

    private var notificationToggleBinding: Binding<Bool> {
        Binding(
            get: { notificationsToggleIsOn },
            set: { isOn in
                notificationManager.setEventNotificationsEnabled(isOn)
            }
        )
    }

    private var weatherNotificationsToggleIsOn: Bool {
        weatherAlertNotificationsEnabled && notificationManager.notificationsAllowed
    }

    private var weatherNotificationToggleBinding: Binding<Bool> {
        Binding(
            get: { weatherNotificationsToggleIsOn },
            set: { isOn in
                weatherAlertNotificationsEnabled = isOn

                Task {
                    await WeatherAlertNotificationManager.shared
                        .setNotificationsEnabled(isOn)
                }

                if isOn {
                    notificationManager.requestSystemNotificationAuthorizationIfNeeded()
                }
            }
        )
    }

    private var eventSharePromptToggleBinding: Binding<Bool> {
        Binding(
            get: { eventSharePromptEnabled },
            set: { isEnabled in
                eventSharePromptEnabled = isEnabled
                EventSharePromptSettings.setEnabled(isEnabled)
                if !isEnabled {
                    EventSharePromptManager.shared.dismiss()
                }
            }
        )
    }

}
