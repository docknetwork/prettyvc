import sanitize from '../utils/sanitize';

export default function TemplateDiploma({ title, issuerName, subjectName, date, image, documents }) {
  const subjectDocuments = (documents && documents[0]) || []; // Only one document/subject per diploma
  const degreeDocument = subjectDocuments.filter(d => (
    typeof d.type === 'string' && d.type.indexOf('Degree') !== -1
  ))[0];

  // Degree name is either in a degree document or taken from subject
  const degreeName = (degreeDocument && degreeDocument.name) || subjectName;

  // Diploma should be assigned to a person
  const personName = subjectName === degreeName ? 'Unknown person' : subjectName;

  return `
    <div class="prettyVC-diploma">
      <h2 class="prettyVC-diploma-title">
        ${sanitize(issuerName)}
      </h2>
      <p class="prettyVC-diploma-subtext">
        The faculty of the ${issuerName} with all the approbation of the board hereby admit
      </p>
      <h3 class="prettyVC-card-subtitle">
        ${sanitize(personName)}
      </h3>
      <div class="prettyVC-card-Issuer">
        ${sanitize(title)}
      </div>
      <div class="prettyVC-card-Footer">
        <div class="prettyVC-card-FooterSubject">
          <strong>${sanitize(subjectName)}</strong><br />
          ${sanitize(date)}
        </div>
        ${image ? `
          <div class="prettyVC-card-Logo">
            <img src="${sanitize(image)}" />
          </div>
        ` : ''}
      </div>
    </div>
  `;
}
