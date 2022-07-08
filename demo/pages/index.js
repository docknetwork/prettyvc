import { useState, useEffect } from 'react';
import Slider, { SliderTooltip } from 'rc-slider';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';

// Styles for this page
import styles from '../styles/index.module.css';

// Import example JSONs and template list
import vcExamples from '../components/vc-examples';
import vcTemplates from '../../src/templates/index';

// Using getVCData instead of getVCHTML here so that we can override the template
import { getVCData, renderVCHTML, getTitle } from '../../src/index';

// We can supply a mapping of known DID human readable names
const didMap = {
  'did:web:vc.transmute.world': 'Prestigous University',
  'did:factom:5d0dd58757119dd437c70d92b44fbf86627ee275f0f2146c3d99e441da342d9f': 'Factom Issuer',
};

// Dynamically import json-editor component so SSR doesnt fail due to it
const JsonEditor = dynamic(() => import('../components/editor'), {
  ssr: false,
});

// React slider handle and tooltip
const { Handle } = Slider;
const handle = (props) => {
  const {
    value, dragging, index, ...restProps
  } = props;
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
  const [vcHTML, setVCHTML] = useState('');
  const templateKeys = Object.keys(vcTemplates);

  async function generateQRImage(credential) {
    return QRCode.toDataURL(credential.id);
  }

  async function onUpdateJSON() {
    const data = await getVCData(json, {
      template: selectedTemplate,
      generateQRImage,
      didMap,
    });
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

  async function handleSaveAsPNG() {
    const scaleTest = 4;
    const fontSize = 64 / scaleTest;
    const backgroundColor = '#ffffff';
    const node = document.getElementById('vc-render');
    const dataUrl = await toPng(node, {
      width: 2480 / scaleTest,
      height: 3508 / scaleTest,
      backgroundColor,
      fontEmbedCSS: {},
      style: {
        fontSize: `${fontSize}px`,
        backgroundColor,
      },
    });

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'credential.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function onUpdateData() {
    const html = await renderVCHTML(vcData);
    setVCHTML(html);
  }

  useEffect(() => {
    onUpdateJSON();
  }, [json, selectedTemplate]);

  useEffect(() => {
    onUpdateData();
  }, [vcData]);

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

        <button style={{ marginLeft: 'auto' }} onClick={handleSaveAsPNG}>
          Save as PNG
        </button>
      </div>
      <div className={styles.container}>
        <Head>
          <title>PrettyVC - Developed by Dock</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <meta name="description" content="Render pretty verifiable credentials demo" />
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
          id="prettyvc-renderer"
          className={styles.renderer}
          style={{ fontSize: renderSize }}>
          <div
            id="vc-render"
            style={{
              maxWidth: '38.75em', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}
            dangerouslySetInnerHTML={{ __html: vcHTML.html }}>
          </div>
        </main>
      </div>

      <footer className={styles.footer}>
        prettyvc developed by <a
          rel="noreferrer"
          target="_blank"
          href="https://www.dock.io">dock</a>&nbsp;|&nbsp;
          <a
            rel="noreferrer"
            target="_blank"
            href="https://www.npmjs.com/package/@docknetwork/prettyvc">
            get it on npm
          </a>
      </footer>
    </div>
  );
}
