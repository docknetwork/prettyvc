import { guessCredentialTemplate, renderVCHTML } from '../src/index';

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

  test('renderVCHTML renders liquid template', async () => {
    const { html } = await renderVCHTML({
      credentialSubject: { name: 'test' },
      prettyVC: {
        type: 'liquid',
        proof: '<div style="display:flex">{{credentialSubject.name}}</div>'
      }
    });
    expect(html).toEqual('<div style="display:flex">test</div>');
  });
});

