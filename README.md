# PrettyVC - Render pretty verifiable credentials

This library aims to solve the problem of presenting verifiable credentials to the user in a a pretty, readable and informative way. It takes a credential's JSON and makes several guesses as to what content to show based on type, document property names and more. You can check out a demo at [https://docknetwork.github.io/prettyvc/](https://docknetwork.github.io/prettyvc/)

Please feel free to submit example credential JSON and templates, the more we have the more robust the library can become.

## Features
- Renderer agnostic (React, SSR, headless)
- Works well with html-pdf and html-to-image
- Easily customizable CSS
- Multiple templates and template deduction
- Generates identicon images if none can be found
- Generates QR codes of the credential ID URI

## Usage

Install through your favorite package manager:

`yarn add @docknetwork/prettyvc` or `npm install @docknetwork/prettyvc`

Once installed, basic usage is simple:
```
import { getVCHTML } from '@docknetwork/prettyvc';

const options = { generateQR: true };
const vcHTML = await getVCHTML(credentialJSON, options);
// append vcHTML in your body
```

If using a framework like NextJS or webpack, you must either build your own CSS rules or import the templates:
```
import '@docknetwork/prettyvc/styles/card.css';
import '@docknetwork/prettyvc/styles/diploma.css';
```

If using NodeJS/SSR and dont wish to serve CSS files, you will need to use a package such as [juice](https://github.com/Automattic/juice) to embed CSS styles into style tags.

`getVCHTML` will return the credential HTML with CSS classes, you must write your own wrapper for whatever purpose you need. In the NextJS example we have a simple wrapper that supplies a font size to scale the credential.

See the NextJS/React [example here](./demo).

If you wish to get just the data and do the rendering yourself instead of injecting sanitized HTML (if you are using React Native for example), you can use the method `getVCData`:
```
import { getVCData } from '@docknetwork/prettyvc';

const options = { generateQR: true };
const vcData = await getVCData(credentialJSON, options);
console.log('vcData', vcData);
```

## Todo
- Add tests going through each credential and ensure it outputs the correct fields we'd expect to see as a human
- Demo script for creating PDF credentials
- Report template that renders tables (see CMTR example)
- Document options
- Add more credentials
