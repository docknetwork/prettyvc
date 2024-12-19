import {
  getVCData,
} from '../src/index';

describe('getVCData', () => {
  test('includes falsey attributes', async () => {
    const template = await getVCData({
      type: ['VerifiableCredential'],
      credentialSubject: {
        id: 'testid',
        attribEmpty: '',
        attribZero: 0,
        attribOne: 1,
      },
      issuer: 'test',
      issuanceDate: new Date().toISOString(),
    });

    expect(template.attributes).toEqual([
      { name: 'Id', property: 'id', value: 'testid' },
      { name: 'Attrib Empty', property: 'attribEmpty', value: '' },
      { name: 'Attrib Zero', property: 'attribZero', value: 0 },
      { name: 'Attrib One', property: 'attribOne', value: 1 },
    ]);
  });
});
