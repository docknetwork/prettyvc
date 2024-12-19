import sanitize from '../utils/sanitize';

export default function TemplateCredential({
  title, issuerName, subjectName, expiryDate, date, image, images, qrImage, attributes,
}) {
  const attributesTableRows = attributes.map((attribute) => (`
    <tr>
      <td><strong>${sanitize(attribute.name)}</strong></td>
      <td>${sanitize(attribute.value === 0 ? '0' : attribute.value)}</td>
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
          has issued a <strong>${sanitize(title)}</strong> to
        </p>
        <h3 class="prettyVC-diploma-subtitle">
          ${sanitize(subjectName)}
        </h3>
      ` : `
        <p class="prettyVC-diploma-subtext">
          has issued a <strong>${sanitize(title)}</strong>
        </p>
      `}

      ${attributes.length ? `
        <br />
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
        <div class="prettyVC-diploma-footersubject-wrap">
          ${image ? `
            <div class="prettyVC-diploma-logo">
              <img src="${sanitize(image)}" />
            </div>
          ` : ''}
          <div class="prettyVC-diploma-footersubject">
            <strong>${sanitize(title.substr(0, 42))}</strong>
            <span>Issued on: ${sanitize(date)}</span>
            ${expiryDate ? `
              <span>Expire at: ${sanitize(expiryDate)}</span>
            ` : ''}
          </div>
        </div>

        ${qrImage ? `
          <img src="${sanitize(qrImage)}" class="prettyVC-diploma-qrimage" />
        ` : ''}
      </div>
    </div>
  `;
}
