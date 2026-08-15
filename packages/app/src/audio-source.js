import { bandAmplitudes } from "@wireframe/core";

export class AudioReactiveSource {
  constructor() {
    this.context = null;
    this.analyser = null;
    this.gain = null;
    this.data = null;
    this.stream = null;
    this.node = null;
    this.muted = false;
    this.loop = true;
  }

  ensureAnalyser() {
    if (this.analyser) return;
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 512;
    this.data = new Uint8Array(this.analyser.frequencyBinCount);
    this.gain = this.context.createGain();
    this.gain.gain.value = this.muted ? 0 : 1;
    this.gain.connect(this.context.destination);
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.gain) this.gain.gain.value = muted ? 0 : 1;
  }

  setLoop(loop) {
    this.loop = loop;
    if (this.node && "loop" in this.node) this.node.loop = loop;
  }

  async startMic() {
    this.stop();
    this.ensureAnalyser();
    if (this.context.state === "suspended") this.context.resume().catch(() => {});
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.node = this.context.createMediaStreamSource(this.stream);
    this.node.connect(this.analyser);
  }

  async loadFile(file, { onEnded } = {}) {
    this.stop();
    this.ensureAnalyser();
    if (this.context.state === "suspended") this.context.resume().catch(() => {});
    const buffer = await file.arrayBuffer(),
      audioBuffer = await this.context.decodeAudioData(buffer),
      source = this.context.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = this.loop;
    source.connect(this.analyser);
    source.connect(this.gain);
    source.onended = () => {
      if (this.node === source) this.node = null;
      onEnded?.();
    };
    source.start();
    this.node = source;
  }

  stop() {
    this.node?.disconnect?.();
    this.node?.stop?.();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.node = null;
    this.stream = null;
  }

  destroy() {
    this.stop();
    this.context?.close();
    this.context = null;
    this.analyser = null;
    this.gain = null;
    this.data = null;
  }

  sample() {
    if (!this.analyser || !this.node) return { active: false };
    this.analyser.getByteFrequencyData(this.data);
    return { active: true, ...bandAmplitudes(this.data) };
  }
}
