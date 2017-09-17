<template>
  <div id="app">
    <div class="container">
      <h1 class="title">Wistia Thumbnail Generator</h1>
      <div class="content">
        <ol>
          <li>Enter the <strong>URL</strong> of the Wistia video e.g. <i>https://account.wistia.com/medias/...</i></li>
          <li>Enter desired thumbnail <strong>Width</strong>, and change the <strong>Aspect Ratio</strong> if needed (default is <i>16:9</i>)</li>
          <li>If desired; add a <strong>Color</strong> <i>(In hex format)</i> for the Wistia Play Button for the thumbnail</li>
        </ol>
      </div>
    </div>

    <div class="container">
      <h3 class="title is-4">Thumbnail Information</h3>

      <!-- FORM -->
      <form>
        <!-- URL -->
        <div class="field">
          <label class="label">Video URL</label>
          <div class="control">
            <input
              name="videoUrl"
              v-model="videoUrl"
              v-validate="'required|url'"
              v-bind:class="{ 'is-danger': errors.has('videoUrl') }"
              class="input"
              placeholder="https://account.wistia.com/medias/..."
            />
          </div>
          <p class="help is-danger" v-show="errors.has('videoUrl')">Please enter a valid URL</p>
        </div>

        <!-- WIDTH & HEIGHT & RATIO -->
        <div class="columns" style="margin-bottom: 0;">
          <!-- WIDTH -->
          <div class="column">
            <div class="field">
              <label class="label">Video Width</label>
              <div class="control is-expanded">
                <input
                  name="videoWidth"
                  v-model="videoWidth"
                  v-validate="'required|numeric'"
                  v-bind:class="{ 'is-danger': errors.has('videoWidth') }"
                  class="input"
                  placeholder="1280"
                />
              </div>
              <p class="help is-danger" v-show="errors.has('videoWidth')">Please specify the thumbnail width</p>
            </div>
          </div>

          <!-- RATIO -->
          <div class="column is-narrow">
            <div class="field">
              <label class="label">Aspect Ratio</label>
              <div class="control is-expanded">
                <span class="select is-fullwidth">
                  <select v-model="videoRatio">
                    <option value="9">16:9</option>
                    <option value="10">16:10</option>
                  </select>
                </span>
              </div>
            </div>
          </div>

          <!-- HEIGHT -->
          <div class="column">
            <div class="field">
              <label class="label">Height</label>
              <div class="control">
                <input
                  v-model="videoHeight"
                  class="input"
                  disabled
                  value="Automatic"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- PLAY BUTTON -->
        <div class="field">
          <label class="label">Play Button Color</label>
          <div class="control">
            <input
              name="buttonColor"
              v-model="buttonColor"
              v-validate="{ rules: { regex: /#[0-9A-Fa-f]{6}\b/} }"
              v-bind:class="{ 'is-danger': errors.has('buttonColor') }"
              maxlength="7"
              class="input"
              placeholder="#1b5faa"
            />
          </div>
          <p class="help is-danger" v-show="errors.has('buttonColor')">Please enter a valid hex color</p>
        </div>

        <!-- GET THUMBNAIL -->
        <div class="field">
          <div class="control">
            <button @click="getThumbnail()" type="button" v-bind:class="{ 'is-loading': loading }" v-bind:disabled="!videoUrl && !videoWidth" class="button is-primary">Get Thumbnail</button>
          </div>
        </div>
      </form>

      <div class="thumbnail-url">
        <pre v-clipboard="previewThumbSrc"><code v-text="previewThumbSrc"></code></pre>
      </div>

      <div class="thumbnail-preview">
        <a v-bind:href="previewThumbSrc" download>
          <img v-bind:src="previewThumbSrc">
        </a>
      </div>
    </div>

    <div class="container">
      <div class="content">
        <p>A thing by <a href="https://www.reiner.io">Jeff Reiner</a>, check out the <a href="https://github.com/mirshko/thumbnailer.reiner.io">source code</a> on GitHub</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'app',
  data () {
    return {
      videoUrl: '',
      videoWidth: '',
      videoRatio: '9', // 16:9 Aspect Ratio By Default
      thumbSrc: '',
      buttonColor: '',
      loading: false
    }
  },
  computed: {
    mediaId () {
      return this.videoUrl.match(/medias\/(\w{10})/)[1]
    },
    videoHeight () {
      let width = this.videoWidth
      const ratio = this.videoRatio

      width = Math.round((width / 16) * ratio)

      if (width === 0 || width === undefined) {
        return 'Automatic'
      } else {
        return width
      }
    },
    previewThumbSrc () {
      let src = this.thumbSrc
      let width = this.videoWidth
      let height = this.videoHeight
      let color = this.buttonColor

      if (color.search(/#[0-9A-Fa-f]{6}\b/) !== -1 && src && width) {
        return src.replace(/\d+x\d+/, width + 'x' + height) + `&image_play_button=true&image_play_button_color=${color.replace('#', '')}CC` // CC = 80% Opacity`
      } else if (src && width) {
        return src.replace(/\d+x\d+/, width + 'x' + height)
      } else {
        src = 'Thumbnail URL'
        return src
      }
    }
  },
  methods: {
    getThumbnail () {
      this.loading = true // Make Button Loading Spinner
      this.thumbSrc = '' // Clear Existing Thumbnail
      axios.get(`https://fast.wistia.com/oembed/?url=http://home.wistia.com/medias/${this.mediaId}&format=json&callback=?`)
        .then(res => {
          this.loading = false
          this.thumbSrc = res.data.thumbnail_url
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    }
  }
}
</script>

<style lang="postcss">
  @import "~bulma/css/bulma.css";

  .container {
    margin-top: 40px;
  }

  .thumbnail-url {
    margin-top: 40px;

    & pre {
      cursor: pointer;
      border-radius: 3px;
    }
  }

  .thumbnail-preview {
    margin-top: 40px;

    & img {

    }
  }
</style>
