export type BmoGender = 'boy' | 'girl';

export type BmoAccessory = 'none' | 'bowtie' | 'hairbow';

export type BmoTheme = 'classic' | 'pink' | 'blue' | 'purple' | 'gold';

export interface BmoCustomization {
  gender: BmoGender;
  accessory: BmoAccessory;
  theme: BmoTheme;
  name: string;
}

export type ScreenTimeoutOption = 0 | 30 | 60 | 120 | 180 | 300 | 600 | 900; // seconds (0 = Never)

export interface BmoPowerSettings {
  timeoutCharging: ScreenTimeoutOption; // seconds when plugged in
  timeoutBattery: ScreenTimeoutOption;  // seconds when on battery
}

export type AlarmSound = 'bmo_chime' | 'game_8bit' | 'sing_song' | 'digital';

export interface BmoAlarm {
  id: string;
  time: string; // "HH:MM"
  label: string;
  enabled: boolean;
  days: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat. Empty array = once
  sound: AlarmSound;
}
