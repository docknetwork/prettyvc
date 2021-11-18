import sanitize from '../utils/sanitize';

export default function TemplateCredential({
  title, issuerName, subjectName, expiryDate, date, image, images, qrImage, documents, attributes,
}) {
  console.log('attributes', attributes)

  const subjectDocuments = (documents && documents[0]) || []; // Only one document/subject per diploma
  const degreeDocument = subjectDocuments.filter((d) => (
    typeof d.type === 'string' && d.type.indexOf('Degree') !== -1
  ))[0];

  // Degree name is either in a degree document or taken from subject
  let degreeName = (degreeDocument && degreeDocument.name) || subjectName;

  // Diploma should be assigned to a person
  let personName = degreeDocument && subjectName === degreeName ? '' : subjectName;

  if (degreeName === personName && title) {
    degreeName = title;
  }

  if (personName === degreeName) {
    personName = '';
  }

  const attributesTableRows = attributes.map(attribute => (`
    <tr>
      <td>${attribute.name}</td>
      <td>${attribute.value}</td>
    </tr>
  `)).join('\n');

  return `
    <div class="prettyVC prettyVC-diploma">
      <img src="${sanitize(images.issuerImage || image)}" class="prettyVC-diploma-headerimage" />
      <h2 class="prettyVC-title prettyVC-diploma-title">
        ${sanitize(issuerName)}
      </h2>

      ${personName ? `
        <p class="prettyVC-diploma-subtext">
          has issued a <strong>${sanitize(title)}</strong> credential to
        </p>
        <h3 class="prettyVC-diploma-subtitle">
          ${sanitize(personName)}
        </h3>
      ` : ''}

      ${qrImage ? `
        <img src="${sanitize(qrImage)}" class="prettyVC-diploma-qrimage" />
      ` : ''}

      ${attributes.length ? `
        <table>
          <tr>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
          ${attributesTableRows}
        </table>
        <br />
      ` : ''}

      <div class="prettyVC-diploma-footer">
        <div class="prettyVC-diploma-footersubject">
          <strong>${sanitize(title)}</strong><br />
          Issued on: ${sanitize(date)}
          ${expiryDate ? `
            <br />
            Expire at: ${sanitize(expiryDate)}
          ` : ''}
        </div>
        ${image ? `
          <div class="prettyVC-diploma-logo">
            <img src="${sanitize(image)}" />
          </div>
        ` : ''}
      </div>
    </div>
  `;
}
