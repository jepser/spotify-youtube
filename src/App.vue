<template>
  <div id="app" class="intro">
    <div class="intro__content">
      <div class="intro__text">
          <svg width="62px" height="72px" viewBox="0 0 62 72" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs></defs>
            <g id="jepser-logo-container" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Menu" transform="translate(-52.000000, -22.000000)" stroke="#000000">
                    <g id="jepser-logo" transform="translate(53.000000, 23.000000)">
                        <path d="" id="Path-2" stroke-width="2"></path>
                        <polygon id="Path-3" stroke-width="1" points="35.644009 0.426295571 6.76012285 16.7859514 0.196913639 31.7522465 15.0248336 50.8396861 36.3788066 68.6695776 59.2651559 35.5204062 58.9371556 11.5827903"></polygon>
                        <polyline id="Path-4" stroke-width="1" points="6.92988863 17.4169676 29.7912536 31.9284185 16.3733505 51.3131084"></polyline>
                        <polyline id="Path-5" stroke-width="1" points="36.7497288 68.268546 27.7130641 53.4290947 16.4041005 51.4418741"></polyline>
                        <polyline id="Path-7" stroke-width="1" points="58.7597023 12.3182285 50.8229918 26.6964293 36.6760568 67.7880768"></polyline>
                        <path d="M58.6809054,36.3282351 L42.1563726,52.4984291" id="Path-8" stroke-width="1"></path>
                        <path d="M36,1 L50.6325055,26.6986155" id="Path-9" stroke-width="1"></path>
                        <path d="M50.5698452,26.9083714 L27.7463381,53.1766809" id="Path-10" stroke-width="1"></path>
                        <polyline id="Path-11" stroke-width="1" points="35.8191765 0.874267509 29.9683231 32.0354962 27.6935594 53.156559"></polyline>
                    </g>
                </g>
            </g>
        </svg>
        <p class="intro__presented">Presented by <br>Jepser Bernardino</p>
        <h3 class="intro__title">Convert Spotify to Youtube playlists</h3>
        <a v-on:click="loginSpotify" class="button button--green intro__login">Login to Spotify</a>
      </div>
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
  @include vertical-container;
  height: 100vh;
  width: 100%;
  &__content {
    @include vertical-text;
  }
  &__text {
    text-align: center;
    padding: 30px 0 0;
    margin: 0 auto;
    width: 100%;
    max-width: 600px;
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
    margin-top: -72px;
    * {
      stroke: $white;
    }
  }
}
</style>
