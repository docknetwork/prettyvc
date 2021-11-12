import { useState, useEffect } from 'react';
import Head from 'next/head';
import Slider, { SliderTooltip } from 'rc-slider';
import styles from '../styles/index.module.css';

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

// import TemplateCard from '@docknetwork/prettyvc/templates/card';
// import TemplateDiploma from '@docknetwork/prettyvc/templates/diploma';
import TemplateCard from '../../templates/card';
import TemplateDiploma from '../../templates/diploma';
import vcTemplates from '../../templates/index';
import { getVCData, getTitle } from '../../index';

// We can supply a mapping of known DID human readable names
const didMap = {
  'did:web:vc.transmute.world': 'Prestigous University',
};

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

const templateKeys = Object.keys(vcTemplates);

const JsonEditor = dynamic(() => import('../components/editor'), {
  ssr: false,
});

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
  const [renderSize, setRenderSize] = useState(16);
  const [selectedTemplate, setTemplate] = useState();
  const [vcData, setVCData] = useState({});
  const vcHTML = vcData.template && vcTemplates[vcData.template](vcData);

  async function onUpdateJSON() {
    const data = await getVCData(json, {
      template: selectedTemplate,
      generateQR: true,
      didMap,
    });
    console.log('data', data)
    setVCData(data);
  }

  function handleJSONChange(v) {
    setJSON(v);
  }

  function handleSelectExample(e) {
    const idx = parseInt(e.target.value, 10);
    setExampleIndex(idx);
    setJSON(vcExamples[idx]);
  }

  function handleSelectTemplate(e) {
    setTemplate(e.target.value);
  }

  useEffect(() => {
    onUpdateJSON();
  }, [json, selectedTemplate]);

  return (
    <div className={styles.columnWrapper}>
      <div className={styles.controls}>
        <img className={styles.logo} src="https://uploads-ssl.webflow.com/5e97941735e37a5ef19d10aa/601483e72237f407809dcfbc_dock-logo-footer.png" />

        <div className={styles.selectControls}>
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
            <select value={selectedTemplate} onChange={handleSelectTemplate}>
              <option value="">
                Auto-template
              </option>
              {templateKeys.map((template, index) => (
                <option value={template} key={index}>
                  {template}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Slider
          min={8}
          max={64}
          defaultValue={renderSize}
          handle={handle}
          onChange={setRenderSize}
          style={{ maxWidth: '256px' }}
          className={styles.slider}
          />

        <button style={{ marginLeft: 'auto' }}>
          Save as PNG
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
            value={json}
            onChange={handleJSONChange}
          />
        </main>

        <main
          className={styles.renderer}
          style={{ fontSize: renderSize }}
          dangerouslySetInnerHTML={{ __html: vcHTML }}>
        </main>
      </div>

      <footer className={styles.footer}>
        footer
      </footer>
    </div>
  )
}
