<template>
  <div class="spotify">
    <div class="spotify__container">
      <h3>Awesome {{ userInfo.display_name }}, now select the playlist you want to export</h3>
      <select name="" id="" v-on:change="searchSongs" v-model="selectedPlaylist">
        <option v-if="!playlists" value="0">Loading...</option>
        <option v-for="playlist in playlists.items" v-bind:value="{ id: playlist.id, owner: playlist.owner.id }">{{ playlist.name }}</option>
      </select>
      <a href="" v-on:click="activateSearch" class="button button--youtube">Search on youtube</a>
      <!-- <a v-on:click="loginSpotify" class="button button-green">Login to Spotify</a> -->
    </div>
  </div>
  <youtube :songs="songs.items" :search.sync="search"></youtube>
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
        return hash.access_token
      },
      playlists: false,
      songs: [],
      currentPage: 1,
      userInfo : {},
      loadedSongs: false,
      apiUrl: 'https://api.spotify.com/v1',
      selectedPlaylist: '',
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
        return this.callApi('/me/playlists').then((response) => {
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
        })
      },
      activateSearch (e) {
        e.preventDefault()

        this.search = true
      }
  }
}
</script>

<style lang="sass">
  @import 'styles/variables';
  .spotify {
    background-color: $green;
    padding: 1px;
    // min-height: 100vh;
    &__container {
      max-width: 600px;
      width: 100%;
      margin: 0 auto;
    }
  }
</style>
