import sanitize from '../utils/sanitize';

export default function TemplateDiploma({
  title, issuerName, subjectName, expiryDate, date, image, images, qrImage, documents,
}) {
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

  return `
    <div class="prettyVC prettyVC-diploma">
      <img src="${sanitize(images.issuerImage || image)}" class="prettyVC-diploma-headerimage" />
      <h2 class="prettyVC-title prettyVC-diploma-title">
        ${sanitize(issuerName)}
      </h2>
      <p class="prettyVC-diploma-subtext">
        has issued a <strong>${sanitize(degreeName || title)}</strong> to
      </p>

      <br />
      <h3 class="prettyVC-diploma-subtitle">
        ${sanitize(personName || 'Unnamed Person')}
      </h3>
      <br />

      ${qrImage ? `
        <img src="${sanitize(qrImage)}" class="prettyVC-diploma-qrimage-center" />
      ` : ''}

      <div class="prettyVC-diploma-footer">
        <div class="prettyVC-diploma-footersubject-wrap">
          <div class="prettyVC-diploma-footersubject">
            <strong>${sanitize(title)}</strong>
            <span>Issued on: ${sanitize(date)}</span>
            ${expiryDate ? `
              <span>Expire at: ${sanitize(expiryDate)}</span>
            ` : ''}
          </div>
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
