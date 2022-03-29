import sanitize from '../utils/sanitize';

export default function TemplateCard({
  title, issuerName, subjectName, date, image,
}) {
  return `
    <div class="prettyVC prettyVC-card">
      <h2 class="prettyVC-title prettyVC-card-title">
        ${sanitize(title)}
      </h2>
      <div class="prettyVC-card-issuer">
        <svg width="1em" height="1em" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.5791 10.8154H4.60449C4.6875 10.8154 4.74609 10.835 4.80469 10.8984L5.53223 11.6211C6.20117 12.29 6.84082 12.2852 7.50977 11.6211L8.23242 10.8984C8.2959 10.835 8.35449 10.8154 8.4375 10.8154H9.46289C10.4053 10.8154 10.8594 10.3564 10.8594 9.41406V8.38867C10.8594 8.30566 10.8838 8.24707 10.9424 8.18848L11.665 7.46094C12.334 6.79688 12.334 6.15234 11.665 5.4834L10.9424 4.76074C10.8789 4.69727 10.8594 4.63867 10.8594 4.56055V3.53516C10.8594 2.59277 10.4053 2.13379 9.46289 2.13379H8.4375C8.35449 2.13379 8.2959 2.10938 8.23242 2.05078L7.50977 1.32812C6.84082 0.654297 6.20117 0.65918 5.53223 1.33301L4.80469 2.05078C4.74609 2.10938 4.6875 2.13379 4.60449 2.13379H3.5791C2.63672 2.13379 2.18262 2.58301 2.18262 3.53516V4.56055C2.18262 4.63867 2.1582 4.70215 2.09961 4.76074L1.37695 5.4834C0.703125 6.15234 0.708008 6.79688 1.37695 7.46094L2.09961 8.18848C2.1582 8.24707 2.18262 8.30566 2.18262 8.38867V9.41406C2.18262 10.3564 2.63672 10.8154 3.5791 10.8154ZM5.98145 8.92578C5.7666 8.92578 5.59082 8.82324 5.43457 8.6377L4.29199 7.26562C4.17969 7.13379 4.13086 7.00684 4.13086 6.86523C4.13086 6.5625 4.375 6.32324 4.67773 6.32324C4.85352 6.32324 4.98535 6.3916 5.11719 6.55273L5.97168 7.59766L7.87109 4.5752C8.00293 4.37012 8.15918 4.2627 8.35449 4.2627C8.64746 4.2627 8.91113 4.47754 8.91113 4.78027C8.91113 4.90234 8.8623 5.03906 8.7793 5.16113L6.50879 8.62793C6.38184 8.81348 6.19629 8.92578 5.98145 8.92578Z" fill="#10B981"/>
        </svg>
        ${sanitize(issuerName)}
      </div>
      <div class="prettyVC-card-footer">
        <div class="prettyVC-card-footersubject">
          <strong>${sanitize(subjectName)}</strong><br />
          ${sanitize(date)}
        </div>
        ${image ? `
          <div class="prettyVC-card-logo">
            <img src="${sanitize(image)}" />
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

TemplateCard.orientation = 'landscape';