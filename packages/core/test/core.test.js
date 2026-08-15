import test from 'node:test';
import assert from 'node:assert/strict';
import { adjust, dither, getCharset, bandAmplitudes } from '../src/index.js';

test('brightness transform stays within byte range', () => {
  assert.equal(adjust(255,100,4),255); assert.equal(adjust(0,0,4),0);
});
test('dither preserves dimensions', () => {
  assert.equal(dither(new Float32Array(16).fill(120),4,4,'atkinson',.5).length,16);
});
test('custom charset falls back when empty', () => {
  assert.ok(getCharset('custom','').length > 8); assert.equal(getCharset('custom','XYZ'),'XYZ');
});
test('bandAmplitudes splits frequency data into low/mid/high thirds', () => {
  const data = new Uint8Array([0,0,0, 0,0,0, 255,255,255]);
  const bands = bandAmplitudes(data);
  assert.equal(bands.low,0); assert.equal(bands.mid,0); assert.equal(bands.high,1);
  assert.equal(bands.amplitude, 85/255);
  assert.deepEqual(bandAmplitudes(new Uint8Array(0)), {amplitude:0,low:0,mid:0,high:0});
});
