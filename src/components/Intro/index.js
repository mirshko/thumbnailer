import React from "react";

const Intro = () => (
  <header>
    <h1>Wistia Thumbnail Generator</h1>
    <ol>
      <li>
        Enter the <strong>URL</strong> of the Wistia video e.g.{" "}
        <i>
          https://<strong>my-account</strong>.wistia.com/medias/...
        </i>
      </li>
      <li>
        Enter desired thumbnail <strong>Width</strong>, and change the{" "}
        <strong>Aspect Ratio</strong> if needed (default is <i>16:9</i>)
      </li>
    </ol>
    <p>Here is an example video to test this out with should you need a place to start: <code>https://home.wistia.com/medias/e4a27b971d</code></p>
  </header>
);

export default Intro;
