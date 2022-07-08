import Identicon from 'identicon.js'; // THINK: should this be a peer dep or user supplied method to generate?
import { Liquid } from 'liquidjs';
import sanitizeHtml from 'sanitize-html';
import jsSHA from 'jssha';

import templates from './templates';

const liquidEngine = new Liquid();

const typeToTemplateMap = {
  UniversityDegreeCredential: 'diploma',
  HackathonCredential: 'hackathon',
};

export const cleanHTML = (html) => sanitizeHtml(html, {
  allowedAttributes: {
    '*': ['style'],
    a: ['href', 'name', 'target'],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
  },
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function humanizeCamelCase(string) {
  let result;
  if (string.indexOf('-') === -1) {
    result = string.replace(/([A-Z])/g, ' $1').trim();
  } else {
    result = string.replace(/-/g, ' ').trim();
  }

  return capitalizeFirstLetter(result);
}
export function getTitleFromType({ type }) {
  let title;
  for (let i = 0; i < type.length; i++) {
    const t = type[i];
    if (t !== 'VerifiableCredential') {
      title = humanizeCamelCase(t);
      break;
    }
  }
  return title;
}
export function getTitle({ type, name, credentialSubject }, cutTitle = true) {
  const subjects = Array.isArray(credentialSubject) ? credentialSubject : [credentialSubject];
  let title = name || (subjects[0] && subjects[0].title);

  // Get title from type of credential
  if (!title && type && type.length) {
    title = getTitleFromType({ type });
  }

  if (title && cutTitle && title.length >= 30 && title.endsWith(' Credential')) {
    return title.substr(0, title.length - 11);
  }

  return title || 'Verifiable Credential';
}

function doDeepSearch(object, getVal) {
  const rootVal = getVal(object);
  if (rootVal) {
    return rootVal;
  }

  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const v = object[key];
    if (typeof v === 'object') {
      const val = doDeepSearch(v, getVal);
      if (val) {
        return val;
      }
    }
  }

  return null;
}

function getObjectName(object, getVal) {
  const name = doDeepSearch(object, getVal);
  return name || object.id || object.recipient;
}

function mapDIDIfKnown(string, didMap) {
  if (didMap && string.substr(0, 4) === 'did:') {
    return didMap[string] || string;
  }

  return string;
}

function getIssuerName({ issuer }, didMap) {
  if (typeof issuer === 'string') {
    return mapDIDIfKnown(issuer, didMap);
  }

  return mapDIDIfKnown(getObjectName(issuer, (s) => s.name), didMap);
}

function getLikelyImage(s) {
  if (!s) {
    return undefined;
  }
  const possibleImageKey = Object.keys(s).filter((b) => (b.toLowerCase().indexOf('image') > -1 || b.toLowerCase().indexOf('logo') > -1 || b.toLowerCase().indexOf('brandmark') > -1))[0];
  return s.image || s.logo || (possibleImageKey && s[possibleImageKey]);
}

function hashStr(str) {
  const sha = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' });
  sha.update(str);
  return sha.getHash('HEX');
}

function getCredentialImage({ issuer, credentialSubject }, generateImages) {
  const imagesList = [];

  function pushToList(s) {
    const r = getLikelyImage(s);
    if (r) {
      imagesList.push(r);
    }
    return null;
  }

  doDeepSearch(issuer, pushToList);
  doDeepSearch(credentialSubject, pushToList);

  const issuerImage = doDeepSearch(issuer, getLikelyImage)
    || (generateImages && (`data:image/png;base64,${new Identicon(hashStr(issuer.id || issuer), 128).toString()}`)) || null;
  const subjectImage = doDeepSearch(credentialSubject, getLikelyImage) || null;
  const mainImage = subjectImage || issuerImage || null;
  return {
    issuerImage, subjectImage, mainImage, imagesList,
  };
}

function extractHumanNameFields(s) {
  if (!s) {
    return undefined;
  }
  return s.name
    || (s.givenName ? (s.familyName ? `${s.givenName} ${s.familyName}` : s.givenName) : '')
    || s.assay
    || s.status
    || s.currentStatus
    || s.carrier
    || s.holder;
}

function extractNameFields(s) {
  if (!s) {
    return '';
  }

  // Try to extract based on most often used human readable fields for names
  const humanNames = extractHumanNameFields(s);
  if (humanNames) {
    return humanNames;
  }

  // Cant find by direct properties, so lets see if this has any name-like properties
  const possibleNameKey = Object.keys(s).filter((b) => b.toLowerCase().indexOf('name') > -1)[0];
  if (possibleNameKey) {
    return s[possibleNameKey];
  }

  return '';
}

function getSubjectName({ credentialSubject }, didMap) {
  const subjects = Array.isArray(credentialSubject) ? credentialSubject : [credentialSubject];
  return subjects.map((s) => s && mapDIDIfKnown(getObjectName(s, extractNameFields)), didMap).join(' & ');
}

function getSubjectDocuments({ credentialSubject }) {
  const subjects = Array.isArray(credentialSubject) ? credentialSubject : [credentialSubject];
  return subjects.map((s) => {
    const docs = [];
    if (s && typeof s === 'object') {
      Object.keys(s).forEach((k) => {
        if (typeof s[k] === 'object') {
          docs.push(s[k]);
        }
      });
    }
    return docs;
  });
}

export function guessCredentialTemplate({ type }, customTemplateMap = {}) {
  const lastType = type[type.length - 1];
  if (lastType && lastType.substr(lastType.length - 4) === 'Card') {
    return 'card';
  }
  return customTemplateMap[lastType] || typeToTemplateMap[lastType] || 'credential';
}

export function objectToAttributesArray(object, result = [], parentName = '') {
  const keys = Object.keys(object);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = object[key];
    if (value) {
      if (typeof value === 'object') {
        objectToAttributesArray(value, result, `${key} `);
      } else {
        result.push({
          name: humanizeCamelCase(parentName + key),
          property: parentName + key,
          value,
        });
      }
    }
  }

  return result;
}

// TODO: Add config options like useidenticons and allow user to specify properties to look for in subject name, issuer name etc
export async function getVCData(credential, options = {}) {
  if (!credential) {
    return {};
  }

  const {
    generateImages = true,
    generateQRImage = null,
    didMap = null,
    locale = 'en-US',
  } = options;

  // Type validation
  if (generateQRImage && typeof generateQRImage !== 'function') {
    throw new Error('generateQRImage must be an async function');
  }

  const title = getTitle(credential);
  const humanizedType = getTitleFromType(credential);
  const documents = getSubjectDocuments(credential); // Identify documents in the subject, such as "degree.name"
  const subjectName = getSubjectName(credential, didMap);
  const issuerName = getIssuerName(credential, didMap);
  const images = getCredentialImage(credential, generateImages);
  const issuanceDate = new Date(credential.issuanceDate);
  const expirationDate = credential.expirationDate && new Date(credential.expirationDate);
  const formatter = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  const date = formatter.format(issuanceDate);
  const expirationDateStr = expirationDate ? formatter.format(expirationDate) : '';
  const qrImage = generateQRImage && (await generateQRImage(credential));

  const template = options.template || guessCredentialTemplate(credential, options.typeToTemplateMap || {});

  const attributes = objectToAttributesArray(credential.credentialSubject);

  const subjects = Array.isArray(credential.credentialSubject) ? credential.credentialSubject : [credential.credentialSubject];

  return {
    ...credential,

    humanizedType,
    title,
    subjectName,
    issuerName,
    date,
    image: images.mainImage,
    images,
    documents,
    template,
    qrImage,
    attributes,
    subjects,

    // Dates
    issuanceDate,
    expirationDate,
    expirationDateStr,
    dateStr: date,
  };
}

async function renderLiquidTemplate(templateContents, data) {
  const tpl = liquidEngine.parse(templateContents);
  const result = await liquidEngine.render(tpl, data);
  return cleanHTML(result);
}

export async function renderVCHTML(data, options = {}) {
  if (data.prettyVC) {
    const { type, proof } = data.prettyVC;
    if (type === 'liquid') {
      return {
        html: await renderLiquidTemplate(proof, data),
        orientation: 'landscape', // TODO: could we set this based on the type or remove it?
        templateId: type,
      };
    }
  }

  const templateId = data.template || 'card';
  const customTemplates = options.templates || {};
  const templateFn = customTemplates[templateId] || templates[templateId];
  const orientation = templateFn.orientation || 'portrait';
  return {
    html: templateFn(data),
    orientation,
    templateId,
  };
}

export async function getVCHTML(credential, options) {
  const data = await getVCData(credential, options);
  return await renderVCHTML(data, options);
}
