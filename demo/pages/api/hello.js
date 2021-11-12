import TemplateCard from '../../../templates/card';
import TemplateDiploma from '../../../templates/diploma';
import { getVCHTML } from '../../../index';
import uniDegree from '../../vc-examples/docs/edu/university-degree-verifiable-credential.json';

export default async function handler(req, res) {
  const vcHTML = await getVCHTML(uniDegree, {
    generateQR: true,
  });
  res.status(200).send(vcHTML);
}
