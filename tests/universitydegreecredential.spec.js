import { getVCData } from '../src/index';
import uniDegree from '../demo/vc-examples-dock/university-degree-verifiable-credential.json';

describe('getVCData - UniversityDegreeCredential', () => {
  let vcData;
  beforeAll(async () => {
    vcData = await getVCData(uniDegree, {
      generateQR: false,
      generateImages: false,
    });
  });

  test('Defaults to diploma template', async () => {
    expect(vcData.template).toEqual('diploma');
  });

  test('Has correct title', async () => {
    expect(vcData.title).toEqual('University Degree Credential');
  });

  test('Has correct date', async () => {
    expect(vcData.date).toEqual('March 10, 2020');
  });

  test('Has correct issuer name', async () => {
    expect(vcData.issuerName).toEqual('did:web:vc.transmute.world');
  });

  test('Has correct subject name', async () => {
    expect(vcData.subjectName).toEqual('Bachelor of Science and Arts');
  });

  test('Has correct documents', async () => {
    expect(vcData.documents.length).toEqual(1); // One subject
    expect(vcData.documents[0].length).toEqual(1); // One document for that subject
    expect(vcData.documents[0][0].type).toEqual('BachelorDegree');
    expect(vcData.documents[0][0].name).toEqual('Bachelor of Science and Arts');
  });

  test('Has correct images', async () => {
    expect(vcData.images.issuerImage).toEqual(null);
    expect(vcData.images.subjectImage).toEqual(null);
    expect(vcData.images.mainImage).toEqual(null);
  });

  test('Has correct attributes', async () => {
    expect(vcData.attributes.length).toEqual(3);
    expect(vcData.attributes[0].name).toEqual('Id');
    expect(vcData.attributes[1].name).toEqual('Degree type');
    expect(vcData.attributes[2].name).toEqual('Degree name');
  });
});
