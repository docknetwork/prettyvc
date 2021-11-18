import sanitize from '../utils/sanitize';

export default function TemplateCredential({
  title, issuerName, subjectName, expiryDate, date, image, images, qrImage, attributes,
}) {
  const attributesTableRows = attributes.map((attribute) => (`
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

      ${subjectName ? `
        <p class="prettyVC-diploma-subtext">
          has issued a <strong>${sanitize(title)}</strong> credential to
        </p>
        <h3 class="prettyVC-diploma-subtitle">
          ${sanitize(subjectName)}
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
