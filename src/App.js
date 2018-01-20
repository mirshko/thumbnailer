import React, { Component } from 'react'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      videoUrl: '',
      videoWidth: '',
      aspectRatio: 9,
      buttonColor: '',
      previewThumbSrc: '',
      loading: false,
      error: false
    }

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({
      error: false,
      loading: true,
      previewThumbSrc: '' // Reset visible thumbnail
    })

    const mediaId = this.state.videoUrl.match(/medias\/(\w{10})/)[1]
    const videoWidth = this.state.videoWidth
    const videoHeight = Math.round((this.state.videoWidth / 16) * this.state.aspectRatio)

    fetch(`https://fast.wistia.com/oembed/?url=http://home.wistia.com/medias/${mediaId}&format=json&callback=?`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            loading: false,
            previewThumbSrc: videoWidth ? result.thumbnail_url.replace(/\d+x\d+/, `${videoWidth}x${videoHeight}`) : result.thumbnail_url
          })
        },
        (error) => {
          this.setState({
            loading: false,
            error: true
          })
        }
      )
  }

  render () {
    const {
      videoWidth,
      aspectRatio,
      previewThumbSrc,
      loading,
      error
    } = this.state

    const videoHeight = Math.round((videoWidth / 16) * aspectRatio)

    return (
      <div className='container grid-lg'>
        <header>
          <div style={{paddingTop: '3rem'}}>
            <h1>Wistia Thumbnail Generator</h1>
            <div>
              <ol>
                <li>Enter the <strong>URL</strong> of the Wistia video e.g. <i>https://<strong>my-account</strong>.wistia.com/medias/...</i></li>
                <li>Enter desired thumbnail <strong>Width</strong>, and change the <strong>Aspect Ratio</strong> if needed (default is <i>16:9</i>)</li>
                {/* <li>If desired; add a <strong>Color</strong> <i>(In hex format)</i> for the Wistia Play Button for the thumbnail</li> */}
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
                      type="url"
                      value={this.state.videoUrl}
                      onChange={this.handleInputChange}
                      required
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
                            type="number"
                            value={this.state.videoWidth}
                            onChange={this.handleInputChange}
                            placeholder='1280'
                            min='32'
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
                            value={videoHeight || 'Automatic'}
                            placeholder='Automatic'
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="form-group">
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
                  </div> */}

                  <div className='form-group' style={{marginTop: '.8rem'}}>
                    <input className={loading ? 'btn btn-primary loading' : 'btn btn-primary'} type='submit' value='Get Thumbnail'/>
                  </div>

                  {error && (
                    <div style={{
                      position: 'fixed',
                      top: '24px',
                      right: '24px',
                      width: 'inherit',
                      padding: '.3rem .6rem'
                    }} class="toast toast-error">
                      Something went wrong!
                    </div>
                  )}
                </form>
              </div>
            </div>

            { previewThumbSrc && (
              <div>
                <div style={{marginTop: '3rem'}}>
                  <pre><code style={{
                    padding: '12px 16px'
                  }}>{previewThumbSrc}</code></pre>
                </div>

                <div style={{marginTop: '3rem'}}>
                  <a href={previewThumbSrc} style={{boxShadow: 'none'}} download>
                    <img style={{maxWidth: '100%'}} src={previewThumbSrc} />
                  </a>
                </div>
              </div>
            )}
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