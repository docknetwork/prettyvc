import { guessCredentialTemplate } from '../src/index';

describe('Index', () => {
  test('guessCredentialTemplate baseline', async () => {
    const template = guessCredentialTemplate({
      type: ['VerifiableCredential']
    });
    expect(template).toEqual('credential');
  });

  test('guessCredentialTemplate diploma', async () => {
    const template = guessCredentialTemplate({
      type: ['VerifiableCredential', 'UniversityDegreeCredential']
    });
    expect(template).toEqual('diploma');
  });

  test('guessCredentialTemplate custom', async () => {
    const template = guessCredentialTemplate({
      type: ['VerifiableCredential', 'DebugCredential']
    }, {
      DebugCredential: 'debugtemplate'
    });
    expect(template).toEqual('debugtemplate');
  });

});
