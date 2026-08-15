import { bandAmplitudes } from "@wireframe/core";

export class AudioReactiveSource {
  constructor() {
    this.context = null;
    this.analyser = null;
    this.data = null;
    this.stream = null;
    this.node = null;
  }

  ensureAnalyser() {
    if (this.analyser) return;
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 512;
    this.data = new Uint8Array(this.analyser.frequencyBinCount);
  }

  async startMic() {
    this.stop();
    this.ensureAnalyser();
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.node = this.context.createMediaStreamSource(this.stream);
    this.node.connect(this.analyser);
  }

  async loadFile(file) {
    this.stop();
    this.ensureAnalyser();
    const buffer = await file.arrayBuffer(),
      audioBuffer = await this.context.decodeAudioData(buffer),
      source = this.context.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;
    source.connect(this.analyser);
    source.connect(this.context.destination);
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
    this.data = null;
  }

  sample() {
    if (!this.analyser || !this.node) return { active: false };
    this.analyser.getByteFrequencyData(this.data);
    return { active: true, ...bandAmplitudes(this.data) };
  }
}
