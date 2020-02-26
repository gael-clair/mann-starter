/* eslint-disable @typescript-eslint/no-var-requires */
import { Test, TestingModule } from '@nestjs/testing';

import { Resource } from '@app/api/resource/models';

describe('DatabaseModule', () => {
  let app: TestingModule;
  let module: any;

  beforeEach(async () => {
    const { DatabaseModule } = require('@app/core/database');
    app = await Test.createTestingModule({ imports: [DatabaseModule] }).compile();
    module = app.get(DatabaseModule);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  describe('forRoot()', () => {
    let module: any;

    beforeEach(async () => {
      jest.resetModules();
      jest.mock('@app/resources', () => ({}));
      const { DatabaseModule } = require('@app/core/database');
      app = await Test.createTestingModule({ imports: [DatabaseModule] }).compile();
      module = app.get(DatabaseModule);
    });

    it('should return a module with no import if no resource exists', () => {
      const moduleForRoot = module.constructor.forRoot();

      expect(moduleForRoot.imports).toEqual([]);
    });
  });

  describe('forRoot()', () => {
    let module: any;

    beforeEach(async () => {
      jest.resetModules();
      jest.mock('@app/resources', () => ({ RESOURCE: new Resource('test', 'test', 'tests') }));
      const { DatabaseModule } = require('@app/core/database');
      app = await Test.createTestingModule({ imports: [DatabaseModule] }).compile();
      module = app.get(DatabaseModule);
    });

    it('should return a module importing MongooseModule when at least one resource exists', () => {
      const moduleForRoot = module.constructor.forRoot();

      expect(moduleForRoot.imports.length).toBe(1);
    });
  });
});
