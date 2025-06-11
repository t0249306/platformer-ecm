class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private muted = false
  private volume = 0.7

  constructor() {
    if (typeof window !== "undefined") {
      this.loadSounds();
    }
  }

  private loadSounds() {
    this.registerSound("coin", "./sounds/coin.mp3")
    this.registerSound("jump", "./sounds/jump.wav")
    this.registerSound("death", "./sounds/death.mp3")
    this.registerSound("win", "./sounds/win.wav")
  }

  private registerSound(name: string, url: string) {
    const audio = new Audio(url)
    audio.preload = "auto"
    audio.volume = this.volume
    this.sounds.set(name, audio)
  }

  public play(name: string) {
    if (this.muted) return

    const sound = this.sounds.get(name)
    if (sound) {
      sound.currentTime = 0
      sound.volume = this.volume
      sound.play().catch((error) => {
        console.error(`Error playing sound ${name}:`, error)
      })
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted
  }

  public isMuted(): boolean {
    return this.muted
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    this.sounds.forEach((sound) => {
      sound.volume = this.volume
    })
  }

  public getVolume(): number {
    return this.volume
  }
}

export const soundManager = new SoundManager()