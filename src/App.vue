<template>
  <div id="app" class="intro">
    <div class="intro__content">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="136.152px" height="156.2px" viewBox="0 0 136.152 156.2" enable-background="new 0 0 136.152 156.2" xml:space="preserve" class="diamond">
        <g id="Diamond">
          <polygon fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="0,72.7 36.2,117.3 68,72.7 14.9,39"></polygon>
          <polygon fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="63.2,121.8 36.2,117.2 68,72.7"></polygon>
          <polygon fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="82,0 68,72.7 63.2,121.8 115.2,62.7"></polygon>
          <polygon fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="115.2,62.7 136.2,26.7 82,0"></polygon>
          <polygon fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="83.1,156.2 115.2,62.7 63.2,121.8"></polygon>
          <polygon fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="135.2,81.3 135.2,26.3 115,62.7 93.7,124.2"></polygon>
          <polygon fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="14.9,39 82,0 68,72.7"></polygon>
          <polygon fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="83.1,156.2 36.2,117.2 63.2,121.8"></polygon>
          <polygon fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="94.1,124.2 135.7,81.3 84.1,155.8"></polygon>

        </g>
      </svg>
      <p class="intro__presented">Presented by <br>Jepser Bernardino</p>
      <h3 class="intro__title">Convert Spotify to Youtube playlists</h3>
      <a v-on:click="loginSpotify" class="button button--green intro__login">Login to Spotify</a>
    </div>
  </div>
</template>

<script>

var serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export default {
  data () {
    return {
      spotifyLink () {
        let spotifyArgs = {
          'client_id' : '0d263f59d2d74d0e98c65b67d78f7314',
          'response_type' : 'token',
          'redirect_uri' : window.location.origin + '/spotify',
          'scopes' : 'playlist-read-private',
          'show_dialog': false
        }
        return 'https://accounts.spotify.com/authorize?' + serialize(spotifyArgs)
      }
    }
  },
  methods: {
      loginSpotify () {
        window.location = this.spotifyLink()
      }
  }
}
</script>

<style lang="sass">
@import 'styles/variables';

html {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
body {
  @extend html;
  font-family: 'Roboto Condensed', sans-serif;
  background-color: $gray;
  color: $white;
}
.button {
  padding: 20px 50px;
  text-align: center;
  display: inline-block;
  text-transform: uppercase;
  font-weight: 300;
  font-size: 22px;
  &:hover {
    cursor: pointer;
  }
  &--green {
    background-color: $green;
    color: $white;
  }
}
.intro {
  text-align: center;
  padding: 30px 0 0;
  margin: 0 auto;
  width: 100%;
  max-width: 600px;
  &__content {
    
  }
  &__presented {
    font-size: 16px;
    text-transform: uppercase;
    font-weight: 300;
  }
  &__title {
    font-size: 36px;
    font-weight: 300;
    border-bottom: 2px solid $white;
    border-top: 2px solid $white;
    margin: 30px 0;
    padding: 20px 0;
  }
  &__login {
  }
  svg {
    polygon {
      stroke: $white;
    }
  }
}
</style>
