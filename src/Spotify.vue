<template>
  <div>
    <div v-bind:class="{ spotify: true, 'is-selected': loadedSongs }">
      <div class="spotify__container">
        <div class="spotify__text">
          <h3>Awesome {{ userInfo.display_name }}, <br> now select the playlist you want to export</h3>
          <select name="" id="" v-on:change="searchSongs" v-model="selectedPlaylist">
            <option v-if="!playlists" value="0">Loading...</option>
            <option value="0">Select your playlist</option>
            <option v-for="playlist in playlists.items" v-bind:value="{ id: playlist.id, owner: playlist.owner.id }">{{ playlist.name }}</option>
          </select>
        </div>
      </div>
    </div>
    <youtube :songs="songs.items"></youtube>
  </div>
</template>

<script>

function getHashParams() {

    var hashParams = {};
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.hash.substring(1);

    while (e = r.exec(q))
       hashParams[d(e[1])] = d(e[2]);

    return hashParams;
}

import Youtube from './Youtube.vue'

export default {
  components: {
    Youtube
  },
  data () {
    return {
      token () {
        var hash = getHashParams()
        return hash.access_token || null
      },
      playlists: [],
      songs: [],
      currentPage: 1,
      userInfo : {},
      loadedSongs: false,
      apiUrl: 'https://api.spotify.com/v1',
      selectedPlaylist: 0,
      search: false
    }
  },
  ready () {
    this.getPlaylists()
    this.setUserInfo()
  },
  methods: {
      callApi (url) {
         var options = {
          headers: {
            'Authorization': 'Bearer ' + this.token()
          }
        }
        var requestUrl = this.apiUrl + url

        return this.$http.get(requestUrl, options)
      },
      getPlaylists (page) {
        return this.callApi('/me/playlists?limit=50').then((response) => {
          this.playlists = JSON.parse(response.body)
        }, (response) => {
          console.log(this.$router.go('/'))
        })
      },
      setUserInfo () {
        return this.callApi('/me').then((response) => {
          this.userInfo = JSON.parse(response.body)
        })
      },
      searchSongs () {
        return this.callApi('/users/' + this.selectedPlaylist.owner + '/playlists/' + this.selectedPlaylist.id + '/tracks').then((response) => {
          this.songs = JSON.parse(response.body)
          this.loadedSongs = true
        })
      }
  }
}
</script>

<style lang="sass">
  @import 'styles/variables';
  .spotify {
    background-color: $green;
    padding: 1px;
    @include vertical-container;
    height: 100vh;
    width: 100%;
    transition: height .6s ease-out;
    &__container {
      @include vertical-text;
    }
    &__text {
      max-width: $container-width;
      width: 100%;
      text-align: center;
      margin: 0 auto;
      padding: 40px;
    }
    h3 {
      border-bottom: 4px solid;
      padding: 0 0 20px;
      margin: 0 0 40px;
      font-weight: 400;
      line-height: 1.5;
    }
    &.is-selected {
      height: 220px;
    }
  }
</style>
