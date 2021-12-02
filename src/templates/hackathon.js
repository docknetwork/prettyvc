import sanitize from '../utils/sanitize';

export default function TemplateHackathon(data) {
  const {
    title, issuerName, issuer, subjectName,
    date, image, images, qrImage, attributes, documents,
  } = data;

  const eventDocument = documents[0] && documents[0][0];
  const eventName = eventDocument && eventDocument.name;
  const eventLogos = eventDocument && eventDocument.logos;

  return `
    <div class="prettyVC prettyVC-hackathon">
      <div class="prettyVC-hackathon-content">
        <img src="${images.mainImage}" width="100%" class="prettyVC-hackathon-headerimage" />

        <h2 class="prettyVC-hackathon-title">
          Certificate of Participation
          <br />
          <span>Issued By</span>
        </h2>

        <img src="${images.issuerImage}" class="prettyVC-hackathon-docklogo" />

        <p class="prettyVC-hackathon-subtext">
          A verifiable credential certificate for participating in<br />
          <strong>${eventName ? eventName : 'A Hackathon'}</strong>
        </p>

        ${issuer.countries ? `
          <div class="prettyvc-hackathon-countries">
            ${issuer.countries.map(country => `
              <img src="${country.logo}" alt="${country.name}" />
            `)}
          </div>
        ` : ''}

        <p class="prettyVC-hackathon-subtitle">
          Verifiable Credential<br />
          <span>Issued to</span>
        </p>

        <h3 class="prettyVC-hackathon-subtext">
          <strong>${sanitize(subjectName)}</strong>
          <br />

          ${attributes.map((attribute, index) => (attribute.name === 'Name' || index >= 3) ? '' : `
            <span>${attribute.name}</span>
            <br />
            <strong>${attribute.value}</strong>
            <br />
          `).join(' ')}
        </h3>

        <div class="prettyVC-hackathon-footer">
          <div class="prettyVC-hackathon-qr">
            ${qrImage ? `
              <img src="${sanitize(qrImage)}" class="prettyVC-hackathon-qrimage" />
            ` : ''}

            <strong>Verifiable Credential</strong>
            <span>Issued on:<br />${sanitize(date)}</span>
          </div>

          ${issuer.behalfOf ? `
            <div class="prettyVC-hackathon-logo">
              <span>ISSUED ON BEHALF OF</span>
              ${issuer.behalfOf.logo ? `
                <img src="${sanitize(issuer.behalfOf.logo)}" />
              ` : issuer.behalfOf.name}
            </div>
          ` : ''}
        </div>

        ${eventLogos ? `
          <img src="${eventLogos}" width="100%" class="prettyVC-hackathon-footerlogos" />
        ` : ''}
      </div>
    </div>
  `;
}
