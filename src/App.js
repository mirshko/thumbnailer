import React, { Component } from 'react'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      videoUrl: '',
      videoWidth: '',
      aspectRatio: 9,
      videoHeight: '',
      buttonColor: '',
      previewThumbSrc: 'Thumbnail URL',
      editedThumbSrc: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleVideoHeight () {
    this.setState(
      { videoHeight: this.state.videoHeight },
      () => { this.state.videoHeight = Math.round((this.state.videoWidth / 16) * this.state.aspectRatio) }
    )
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleThumbnail (response) {
    this.state.previewThumbSrc = response
  }

  handleSubmit = (e) => {
    e.preventDefault()

    let mediaId = this.state.videoUrl.match(/medias\/(\w{10})/)

    fetch(`https://fast.wistia.com/oembed/?url=http://home.wistia.com/medias/${mediaId}&format=json&callback=?`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            previewThumbSrc: result.thumbnail_url
          })
        }, (error) => {
          this.setState({
            error
          })
        }
      )
  }

  render () {
    return (
      <div className='container grid-lg'>
        <header>
          <div style={{paddingTop: '3rem'}}>
            <h1>Wistia Thumbnail Generator</h1>
            <div>
              <ol>
                <li>Enter the <strong>URL</strong> of the Wistia video e.g. <i>https://account.wistia.com/medias/...</i></li>
                <li>Enter desired thumbnail <strong>Width</strong>, and change the <strong>Aspect Ratio</strong> if needed (default is <i>16:9</i>)</li>
                <li>If desired; add a <strong>Color</strong> <i>(In hex format)</i> for the Wistia Play Button for the thumbnail</li>
              </ol>
            </div>
          </div>
        </header>

        <main>
          <div style={{paddingTop: '1.5rem'}}>
            <h3>Thumbnail Information</h3>

            <div className='columns'>
              <div className='column'>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" for="videoUrl">Video URL</label>
                    <input
                      className='form-input'
                      name='videoUrl'
                      id='videoUrl'
                      value={this.state.videoUrl}
                      onChange={this.handleInputChange}
                      placeholder='https://account.wistia.com/medias/...'
                    />
                  </div>

                  <div className='form-group'>
                    <div className='columns'>
                      <div className='column col-sm-12'>
                        <div className="form-group">
                          <label className="form-label" for="videoWidth">Video Width</label>
                          <input
                            className="form-input"
                            name='videoWidth'
                            id="videoWidth"
                            value={this.state.videoWidth}
                            onChange={this.handleInputChange, this.handleVideoHeight}
                            placeholder='1280'
                          />
                        </div>
                      </div>

                      <div className='column col-sm-12'>
                        <div className="form-group">
                          <label className="form-label" for="aspectRatio">Aspect Ratio</label>
                          <select
                            className='form-select'
                            name="aspectRatio"
                            id='aspectRatio'
                            value={this.state.aspectRatio}
                            onChange={this.handleInputChange}
                          >
                            <option value='9'>16:9</option>
                            <option value='10'>16:10</option>
                          </select>
                        </div>
                      </div>

                      <div className='column col-sm-12'>
                        <div className="form-group">
                          <label className="form-label" for="videoHeight">Video Height</label>
                          <input
                            className="form-input"
                            name='videoHeight'
                            id='videoHeight'
                            value={this.state.videoHeight}
                            placeholder='Automatic'
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" for="buttonColor">Play Button Color</label>
                    <input
                      className="form-input"
                      name='buttonColor'
                      id='buttonColor'
                      value={this.state.buttonColor}
                      onChange={this.handleInputChange}
                      maxLength='7'
                      placeholder='#fafafa'
                      pattern='#[0-9A-Fa-f]{6}\b'
                    />
                  </div>

                  <div className='form-group' style={{marginTop: '.8rem'}}>
                    <input className='btn btn-primary' type='submit' value='Submit'/>
                  </div>
                </form>
              </div>
            </div>

            <div style={{marginTop: '3rem'}}>
              <pre><code style={{
                padding: '12px 16px'
              }}>{this.state.previewThumbSrc}</code></pre>
            </div>

            <div style={{marginTop: '3rem'}}>
              <a href={this.state.previewThumbSrc} style={{boxShadow: 'none'}} download>
                <img src={this.state.previewThumbSrc} />
              </a>
            </div>
          </div>
        </main>

        <footer>
          <div style={{marginTop: '3rem'}}>
            <p>A thing by <a href="https://www.reiner.io">Jeff Reiner</a>, check out the <a href="https://github.com/mirshko/thumbnailer.reiner.io">source code</a> on GitHub</p>
          </div>
        </footer>
      </div>
    )
  }
}

export default App
