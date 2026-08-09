import assert from 'node:assert/strict';
import test from 'node:test';
import { createCompactMapEventDto } from '../src/events.ts';

test('createCompactMapEventDto emits MapLibre 6 sourcedata fields', () => {
  const dto = createCompactMapEventDto({
    type: 'sourcedata',
    dataType: 'source',
    isSourceLoaded: true,
    sourceId: 'weather',
    sourceDataType: 'content',
    sourceDataChanged: true,
    tile: { tileID: { canonical: { z: 5, x: 10, y: 12 } } },
  });

  assert.equal(dto.type, 'sourcedata');
  assert.equal(dto.dataType, 'source');
  assert.equal(dto.sourceId, 'weather');
  assert.equal(dto.sourceDataType, 'content');
  assert.equal(dto.sourceDataChanged, true);
  assert.deepEqual(dto.tile, { z: 5, x: 10, y: 12 });
  assert.equal(dto.newProjection, null);
  assert.equal(dto.id, null);
});

test('createCompactMapEventDto maps styleimagemissing id', () => {
  const dto = createCompactMapEventDto({ type: 'styleimagemissing', id: 'icon-fire' });
  assert.equal(dto.type, 'styleimagemissing');
  assert.equal(dto.id, 'icon-fire');
});

test('createCompactMapEventDto maps projectiontransition', () => {
  const dto = createCompactMapEventDto({
    type: 'projectiontransition',
    newProjection: { type: 'globe' },
  });
  assert.equal(dto.type, 'projectiontransition');
  assert.deepEqual(dto.newProjection, { type: 'globe' });
});
