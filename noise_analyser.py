import sounddevice as sd
import numpy as np
import pygame
import time
import sys


pygame.mixer.init()

def get_sonic_profile(duration=5, fs=44100):
    print(f"\n[LISTENING] Analyzing the city for {duration}s...")
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1)
    sd.wait()
    
    fft_data = np.abs(np.fft.rfft(recording.flatten()))
    freqs = np.fft.rfftfreq(len(recording.flatten()), 1/fs)
    lows = fft_data[(freqs >= 20) & (freqs <= 250)].mean()
    mids = fft_data[(freqs > 250) & (freqs <= 2000)].mean()
    highs = fft_data[(freqs > 2000)].mean()
    low_sensitivity = 1.65
    high_sensitivity = 1.65

    # can change these back to the ones above this just makes the microphone pick up lows/highs better
    extra_lows = lows * low_sensitivity
    extra_highs = highs * high_sensitivity

    if extra_lows > mids and extra_lows > extra_highs:
        return "low.mp3"
    elif extra_highs > mids:
        return "high.mp3"
    else:
        return "mid.mp3"

def main_loop():
    current_song = None
    
    try:
        while True:
            # Figure out what should play based on the noise
            suggested_song = get_sonic_profile()
           
           #add volume control?
            
        
            if suggested_song != current_song:
                print(f"--- NEW VIBE DETECTED: Switching to {suggested_song} ---")
                
                if pygame.mixer.music.get_busy():
                    pygame.mixer.music.fadeout(2000) 
                    time.sleep(2) 

                pygame.mixer.music.load(suggested_song)
                pygame.mixer.music.play(loops=-1, fade_ms=2000) 
                current_song = suggested_song
            else:
                print("--- STICKING WITH CURRENT VIBE ---")
            print("will check the city again in two minutes.")
            time.sleep(120) 

    except KeyboardInterrupt:
        print("\n[STOPPING] Shutting down the Urban Mixer...")
        pygame.mixer.music.stop()
        sys.exit()





# --- CONFIGURATION ---
BUFFER_SIZE = 5      # Remembers the last 5 checks to "smooth" the vibe
CHECK_INTERVAL = 5  # How many seconds to wait between city samples
pygame.mixer.init()

# Global memory for the "Smart Ear"
noise_history = [] 

def get_environment_data(duration=5, fs=44100):
    print(f"\n[LISTENING] Analyzing environment for {duration}s...")
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1)
    sd.wait()
    
    # 1. AUTO-VOLUME SENSOR (RMS)
    # Measures the physical energy of the sound
    rms = np.sqrt(np.mean(recording**2))
    # Maps noise to a volume scale (0.2 min to 1.0 max)
    # Adjust 0.04 if your mic is too sensitive or too quiet
    adaptive_vol = np.clip(rms / 0.04, 0.2, 1.0) 
    
    # 2. FREQUENCY SENSOR (FFT)
    fft_data = np.abs(np.fft.rfft(recording.flatten()))
    freqs = np.fft.rfftfreq(len(recording.flatten()), 1/fs)
    
    lows = fft_data[(freqs >= 20) & (freqs <= 250)].mean() * 1.65
    mids = fft_data[(freqs > 250) & (freqs <= 2000)].mean()
    highs = fft_data[(freqs > 2000)].mean() * 5.0
    
    return [lows, mids, highs], adaptive_vol

def main_loop():
    current_song = None
    print("Urban DJ Engine Started. Press Ctrl+C to stop.")
    
    try:
        while True:
            # Get fresh data from the street
            vibe_data, target_vol = get_environment_data()
            
            # Add this snapshot to our "Memory"
            noise_history.append(vibe_data)
            if len(noise_history) > BUFFER_SIZE:
                noise_history.pop(0)

            # Calculate the AVERAGE vibe over the last few minutes
            avg_vibe = np.mean(noise_history, axis=0)
            
            # Decision Logic based on the Smooth Average
            if avg_vibe[0] > avg_vibe[1] and avg_vibe[0] > avg_vibe[2]:
                suggested = "low.mp3"
            elif avg_vibe[2] > avg_vibe[1]:
                suggested = "high.mp3"
            else:
                suggested = "mid.mp3"

            # Apply the Adaptive Volume
            pygame.mixer.music.set_volume(target_vol)
            print(f"[VOL: {int(target_vol*100)}%] [VIBE: {suggested}]")

            # Transition Logic
            if suggested != current_song:
                print(f"--- TRANSITIONING TO: {suggested} ---")
                if pygame.mixer.music.get_busy():
                    pygame.mixer.music.fadeout(3000) # Smooth 3s fade out
                    time.sleep(3)
                
                pygame.mixer.music.load(suggested)
                pygame.mixer.music.play(loops=-1, fade_ms=3000) # Smooth 3s fade in
                current_song = suggested
            else:
                print("--- VIBE STABLE ---")

            time.sleep(CHECK_INTERVAL)

    except KeyboardInterrupt:
        print("\n[STOPPING] Shutting down...")
        pygame.mixer.music.stop()
        sys.exit()

if __name__ == "__main__":
    main_loop()