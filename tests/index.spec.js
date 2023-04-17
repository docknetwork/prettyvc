import {
  guessCredentialTemplate,
  objectToAttributesArray,
  renderVCHTML,
} from '../src/index';

describe('Index', () => {
  test('guessCredentialTemplate baseline', async () => {
    const template = guessCredentialTemplate({
      type: ['VerifiableCredential'],
    });
    expect(template).toEqual('credential');
  });

  test('guessCredentialTemplate diploma', async () => {
    const template = guessCredentialTemplate({
      type: ['VerifiableCredential', 'UniversityDegreeCredential'],
    });
    expect(template).toEqual('diploma');
  });

  test('guessCredentialTemplate custom', async () => {
    const template = guessCredentialTemplate(
      {
        type: ['VerifiableCredential', 'DebugCredential'],
      },
      {
        DebugCredential: 'debugtemplate',
      },
    );
    expect(template).toEqual('debugtemplate');
  });

  test('renderVCHTML renders liquid template', async () => {
    const { html } = await renderVCHTML({
      credentialSubject: { name: 'test' },
      prettyVC: {
        type: 'liquid',
        proof: '<div style="display:flex">{{credentialSubject.name}}</div>',
      },
    });
    expect(html).toEqual('<div style="display:flex">test</div>');
  });

  test('objectToAttributesArray', async () => {
    const subject = {
      name: 'testing',
      level1: {
        name: 'Internet Identity Workshop IIWXXXVI #36 2023A',
        level2: {
          name: 'Computer History Museum',
          level3: {
            name: 'level3',
          },
        },
      },
    };

    const result = objectToAttributesArray(subject);

    expect(result).toEqual([
      { name: 'Name', property: 'name', value: subject.name },
      {
        name: 'Level1 name',
        property: 'level1.name',
        value: subject.level1.name,
      },
      {
        name: 'Level2 name',
        property: 'level1.level2.name',
        value: subject.level1.level2.name,
      },
      {
        name: 'Level3 name',
        property: 'level1.level2.level3.name',
        value: subject.level1.level2.level3.name,
      },
    ]);
  });
});
