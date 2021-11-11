import { useState } from 'react';;
import Head from 'next/head';
import Image from 'next/image';
import Slider, { SliderTooltip } from 'rc-slider';
import styles from '../styles/Home.module.css';

import dynamic from 'next/dynamic';

import uniDegree from '../vc-examples/docs/edu/university-degree-verifiable-credential.json';
import bolCredential from '../vc-examples/docs/crude/examples/v1.0/bill-of-lading-verifiable-credential-v1.0.json';
import crudeInspectionDegree from '../vc-examples/docs/crude/examples/v1.0/crude-inspection-verifiable-credential-v1.0.json';
import crudeProduct from '../vc-examples/docs/crude/examples/v1.0/crude-product-verifiable-credential-v1.0.json';
import qpInbond from '../vc-examples/docs/crude/examples/v1.0/qp-inbond-verifiable-credential-v1.0.json';
import cmtrDegree from '../vc-examples/docs/cmtr/examples/v0.2/cmtr-verifiable-credential-v0.2.json';
import covidTest1 from '../vc-examples/docs/covid-19/v2/qSARS-CoV-2-Rapid-Test-Credential.json';
import covidTest2 from '../vc-examples/docs/covid-19/v2/qSARS-CoV-2-Travel-Badge-Credential.json';
import covidTest3 from '../vc-examples/docs/covid-19/v1/verifiable-credential.json';
import prcCredential from '../vc-examples/docs/prc/danube/prc.json';

import TemplateCard from '@docknetwork/prettyvc/templates/card';

import Identicon from 'identicon.js';
import jsSHA from 'jssha';

const vcExamples = [
  uniDegree,
  bolCredential,
  crudeInspectionDegree,
  crudeProduct,
  qpInbond,
  cmtrDegree,
  prcCredential,
  covidTest1,
  covidTest2,
  covidTest3,
];

const vcTemplates = [{
  name: 'Card',
  method: TemplateCard,
}, {
  name: 'Diploma',
  method: TemplateCard,
}];

const JsonEditor = dynamic(() => import('../components/editor'), {
  ssr: false,
});

function getTitle({ type, name }, cutTitle = true) {
  let title = name;

  // Get title from type of credential
  if (!title && type && type.length) {
    for (let i = 0; i < type.length; i++) {
      let t = type[i];
      if (t !== 'VerifiableCredential') {
        if (t.indexOf('-') === -1) {
          title = t.replace(/([A-Z])/g, ' $1').trim();
        } else {
          title = t.replace(/\-/g, ' ').trim();
        }
        break;
      }
    }
  }

  if (cutTitle && title.length >= 30 && title.endsWith(' Credential')) {
    return title.substr(0, title.length - 11)
  }

  return title;
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
}

function getObjectName(object, getVal) {
  const name = doDeepSearch(object, getVal);
  return name || object.id || object.recipient;
}

function getIssuerName({ issuer }) {
  if (typeof issuer === 'string') {
    return issuer;
  }

  return getObjectName(issuer, s => s.name);
}

function getLikelyImage(s) {
  const possibleImageKey = Object.keys(s).filter(s => (s.toLowerCase().indexOf('image') > -1 || s.toLowerCase().indexOf('brandmark') > -1))[0];
  return s.image || s.logo || (possibleImageKey && s[possibleImageKey]);
}

function getIssuerHash(issuer) {
  const ll = issuer.split(':');
  return ll[ll.length - 1];
}

function hashStr(str) {
  const sha = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' });
  sha.update(str);
  return sha.getHash('HEX');
}

function getCredentialImage({ issuer, credentialSubject }) {
  const issuerImage = doDeepSearch(issuer, getLikelyImage);
  const subjectImage = doDeepSearch(credentialSubject, getLikelyImage);
  return issuerImage || subjectImage || (`data:image/png;base64,` + new Identicon(hashStr(issuer.id || issuer), 128).toString());
}

function extractHumanNameFields(s) {
  return s.name ||
    (s.givenName ? (s.familyName ? `${s.givenName} ${s.familyName}` : s.givenName) : '') ||
    s.assay ||
    s.status ||
    s.currentStatus;
}

function extractNameFields(s) {
  // Try to extract based on most often used human readable fields for names
  const humanNames = extractHumanNameFields(s);
  if (humanNames) {
    return humanNames;
  }

  // Cant find by direct properties, so lets see if this has any name-like properties
  const possibleNameKey = Object.keys(s).filter(s => s.toLowerCase().indexOf('name') > -1)[0];
  if (possibleNameKey) {
    return s[possibleNameKey];
  }
}

function getSubjectName({ credentialSubject }) {
  const subjects = Array.isArray(credentialSubject) ? credentialSubject : [credentialSubject];
  return subjects.map(s => getObjectName(s, extractNameFields)).join(' & ');
}

function getVCData(credential) {
  if (!credential) {
    return {};
  }

  const title = getTitle(credential);
  const subjectName = getSubjectName(credential);
  const issuerName = getIssuerName(credential);
  const image = getCredentialImage(credential);
  const issuanceDate = new Date(credential.issuanceDate);
  const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const date = formatter.format(issuanceDate);
  return { title, subjectName, issuerName, date, image };
}

const { Handle } = Slider;

const handle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <SliderTooltip
      prefixCls="rc-slider-tooltip"
      overlay={`Size: ${value}`}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};

export default function Home() {
  const [json, setJSON] = useState(vcExamples[0]);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [renderSize, setRenderSize] = useState(32);
  const vcData = getVCData(json);

  function handleSelectExample(e) {
    const idx = parseInt(e.target.value, 10);
    setExampleIndex(idx);
    setJSON(vcExamples[idx]);
  }

  function handleSelectTemplate(e) {
    const idx = parseInt(e.target.value, 10);

  }

  return (
    <div className={styles.columnWrapper}>
      <div className={styles.controls}>
        <img className={styles.logo} src="https://uploads-ssl.webflow.com/5e97941735e37a5ef19d10aa/601483e72237f407809dcfbc_dock-logo-footer.png" />
        <div className={styles.selectWrapper} style={{ marginRight: '16px' }}>
          <select value={exampleIndex} onChange={handleSelectExample}>
            <option value="" disabled>
              Select an example credential
            </option>
            {vcExamples.map((example, index) => (
              <option value={index} key={index}>
                {getTitle(example)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.selectWrapper} style={{ marginRight: '16px' }}>
          <select value={0} onChange={handleSelectTemplate}>
            <option value="" disabled>
              Select a template
            </option>
            {vcTemplates.map((template, index) => (
              <option value={index} key={index}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <Slider min={8} max={64} defaultValue={renderSize} handle={handle} onChange={setRenderSize} style={{ maxWidth: '256px' }} />

        <button style={{ marginLeft: 'auto' }}>
          Save as PNG
        </button>

        <button style={{ marginLeft: '10px' }}>
          Save as PDF
        </button>
      </div>
      <div className={styles.container}>
        <Head>
          <title>PrettyVC - Dock</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <meta name="description" content="Generated by create next app" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat|Nunito Sans"/>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <JsonEditor
            allowedModes={['tree', 'code']}
            value={json}
            onChange={setJSON}
          />
        </main>

        <main
          className={styles.renderer}
          style={{ fontSize: renderSize }}
          dangerouslySetInnerHTML={{ __html: TemplateCard(vcData) }}>
        </main>
      </div>

      <footer className={styles.footer}>
        footer
      </footer>
    </div>
  )
}
