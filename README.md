# PrettyVC - Render pretty verifiable credentials

This library aims to solve the problem of presenting verifiable credentials to the user in a a pretty, readable and informative way. It takes a credential's JSON and makes several guesses as to what content to show based on type, document property names and more. You can check out a demo at [https://docknetwork.github.io/prettyvc/](https://docknetwork.github.io/prettyvc/)

Please feel free to submit example credential JSON and templates, the more we have the more robust the library can become.

## Features
- Renderer agnostic (React, SSR, headless)
- Works well with html-pdf and html-to-image
- Easily customizable CSS
- Multiple templates and template deduction
- Generates QR codes

## Todo
- Add tests going through each credential and ensure it outputs the correct fields we'd expect to see as a human
