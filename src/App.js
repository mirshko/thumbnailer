import React, { Component, Fragment } from "react";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoUrl: "",
      videoWidth: "",
      aspectRatio: 9,
      buttonColor: "",
      previewThumbSrc: "",
      loading: false,
      error: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      error: false,
      loading: true,
      previewThumbSrc: "" // Reset visible thumbnail
    });

    const mediaId = this.state.videoUrl.match(/medias\/(\w{10})/)[1];
    const videoWidth = this.state.videoWidth;
    const videoHeight = Math.round(
      this.state.videoWidth / 16 * this.state.aspectRatio
    );

    fetch(
      `https://fast.wistia.com/oembed/?url=http://home.wistia.com/medias/${mediaId}&format=json&callback=?`
    )
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            loading: false,
            previewThumbSrc: videoWidth
              ? result.thumbnail_url.replace(
                  /\d+x\d+/,
                  `${videoWidth}x${videoHeight}`
                )
              : result.thumbnail_url
          });
        },
        error => {
          this.setState({
            loading: false,
            error: true
          });
        }
      );
  };

  render() {
    const {
      videoWidth,
      aspectRatio,
      previewThumbSrc,
      loading,
      error
    } = this.state;

    const videoHeight = Math.round(videoWidth / 16 * aspectRatio);

    return (
      <Fragment>
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
        </header>

        <main>
          <h3>Thumbnail Information</h3>

          <form onSubmit={this.handleSubmit}>
            <div>
              <label>
                Video URL
                <input
                  name="videoUrl"
                  id="videoUrl"
                  type="url"
                  value={this.state.videoUrl}
                  onChange={this.handleInputChange}
                  required
                  placeholder="https://account.wistia.com/medias/..."
                />
              </label>
            </div>

            <div>
              <label>
                Video Width
                <input
                  name="videoWidth"
                  id="videoWidth"
                  type="number"
                  value={this.state.videoWidth}
                  onChange={this.handleInputChange}
                  placeholder="1280"
                  min="32"
                />
              </label>
            </div>

            <div>
              <label>
                Aspect Ratio
                <select
                  name="aspectRatio"
                  id="aspectRatio"
                  value={this.state.aspectRatio}
                  onChange={this.handleInputChange}
                >
                  <option value="9">16:9</option>
                  <option value="10">16:10</option>
                </select>
              </label>
            </div>

            <div>
              <label>
                Video Height
                <input
                  value={videoHeight || "Automatic"}
                  placeholder="Automatic"
                  disabled
                />
              </label>
            </div>

            <div>
              <input
                type="submit"
                value={!loading ? "Get Thumbnail" : "Loading"}
              />
            </div>

            {error && <div>Something went wrong!</div>}
          </form>

          {previewThumbSrc && (
            <Fragment>
              <div>
                <pre>
                  <code>{previewThumbSrc}</code>
                </pre>
              </div>

              <div>
                <a href={previewThumbSrc} download>
                  <img alt="Wistia Thumbnail" src={previewThumbSrc} />
                </a>
              </div>
            </Fragment>
          )}
        </main>

        <footer>
          <p>
            A thing by <a href="https://www.reiner.io">Jeff Reiner</a>, check
            out the{" "}
            <a href="https://github.com/mirshko/thumbnailer.reiner.io">
              source code
            </a>{" "}
            on GitHub
          </p>
        </footer>
      </Fragment>
    );
  }
}

export default App;
