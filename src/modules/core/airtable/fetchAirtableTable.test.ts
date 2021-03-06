import waitFor from '@/utils/waitFor';
import { CUSTOMER2 } from '../testing/mocks/mockedRawAirtableDataset';
import hybridCache from '../vercelCache/hybridCache';
import { reset as cacheReset } from '../vercelCache/memoryCacheStorage';
import fetchAirtableTable from './fetchAirtableTable';

/**
 * @group integration
 * @group utils
 */
describe(`utils/api/fetchAirtable.ts`, () => {
  beforeEach(() => {
    global.console = global.muteConsole();
  });

  const expectedShape = {
    records: [
      CUSTOMER2,
    ],
  };
  const expectedShapeWithoutOptionalFields = {
    records: [
      {
        ...CUSTOMER2,
        fields: { // Only list required fields, so that if Airtable API doesn't return optional fields, then the test still passes
          theme: CUSTOMER2.fields.theme,
          ref: CUSTOMER2.fields.ref,
        },
      },
    ],
  };

  describe(`fetchAirtableTable`, () => {
    describe(`should fetch correctly`, () => {
      test(`when not using any option`, async () => {
        expect(await fetchAirtableTable('Customer')).toMatchOneOf([
          expectedShape,
          expectedShapeWithoutOptionalFields,
        ]);
      });
    });

    describe(`should not fetch multiple times in a row but rely on the cache instead`, () => {
      beforeEach(() => {
        cacheReset();
      });

      test(`when using the default TTL`, async () => {
        const counterCacheMissBefore = require('../vercelCache/memoryCacheStorage').counterCacheMiss;
        const counterCacheFoundBefore = require('../vercelCache/memoryCacheStorage').counterCacheFound;
        const counterCacheSetBefore = require('../vercelCache/memoryCacheStorage').counterCacheSet;
        let counterDataResolverCalls = 0;

        // The first call should yield a cache miss and a cache set
        expect(await hybridCache('CustomerTable', async () => {
          ++counterDataResolverCalls;
          return await fetchAirtableTable('Customer');
        })).toMatchOneOf([
          expectedShape,
          expectedShapeWithoutOptionalFields,
        ]);
        expect(counterDataResolverCalls).toEqual(1); // Should be called to resolve data
        // The second call should yield a cache found
        expect(await hybridCache('CustomerTable', async () => {
          ++counterDataResolverCalls;
          return await fetchAirtableTable('Customer');
        })).toMatchOneOf([
          expectedShape,
          expectedShapeWithoutOptionalFields,
        ]);
        expect(counterDataResolverCalls).toEqual(1); // Shouldn't be called but use data from cache instead

        const counterCacheMissAfter = require('../vercelCache/memoryCacheStorage').counterCacheMiss;
        const counterCacheFoundAfter = require('../vercelCache/memoryCacheStorage').counterCacheFound;
        const counterCacheSetAfter = require('../vercelCache/memoryCacheStorage').counterCacheSet;
        expect(counterCacheMissAfter).toEqual(counterCacheMissBefore + 1); // Cache should have been missed only once, during first call
        expect(counterCacheFoundAfter).toEqual(counterCacheFoundBefore + 1); // Cache should have been found only once, during second call
        expect(counterCacheSetAfter).toEqual(counterCacheSetBefore + 1); // Cache should have been set only once, during first call
      });

      describe(`should fetch multiple times and miss the cache`, () => {
        test(`when using TTL of 1 second and waiting more than 1 second between calls`, async () => {
          const counterCacheMissBefore = require('../vercelCache/memoryCacheStorage').counterCacheMiss;
          const counterCacheFoundBefore = require('../vercelCache/memoryCacheStorage').counterCacheFound;
          const counterCacheSetBefore = require('../vercelCache/memoryCacheStorage').counterCacheSet;
          let counterDataResolverCalls = 0;

          // The first call should yield a cache miss and a cache set
          expect(await hybridCache('CustomerTable', async () => {
            ++counterDataResolverCalls;
            return await fetchAirtableTable('Customer');
          }, { ttl: 1 })).toMatchOneOf([
            expectedShape,
            expectedShapeWithoutOptionalFields,
          ]);
          expect(counterDataResolverCalls).toEqual(1); // Should be called to resolve data
          // The second call should yield a cache found
          await waitFor(1001);
          expect(await hybridCache('CustomerTable', async () => {
            ++counterDataResolverCalls;
            return await fetchAirtableTable('Customer');
          }, { ttl: 1 })).toMatchOneOf([
            expectedShape,
            expectedShapeWithoutOptionalFields,
          ]);
          expect(counterDataResolverCalls).toEqual(2); // Should have been called to resolve data again

          const counterCacheMissAfter = require('../vercelCache/memoryCacheStorage').counterCacheMiss;
          const counterCacheFoundAfter = require('../vercelCache/memoryCacheStorage').counterCacheFound;
          const counterCacheSetAfter = require('../vercelCache/memoryCacheStorage').counterCacheSet;
          expect(counterCacheMissAfter).toEqual(counterCacheMissBefore + 1); // Cache should have been missed only once, during first call
          expect(counterCacheFoundAfter).toEqual(counterCacheFoundBefore + 1); // Cache should have been found only once, during second call (but was not used because expired)
          expect(counterCacheSetAfter).toEqual(counterCacheSetBefore + 2); // Cache should have been set twice, during first call (cache miss) and second call (TTL expired)
        });
      });
    });
  });
});
