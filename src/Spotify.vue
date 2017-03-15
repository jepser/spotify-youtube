<template>
  <div>
    <div v-bind:class="{ spotify: true, 'is-selected': loadedSongs }">
      <div class="spotify__container">
        <div class="spotify__text">
          <h3>Awesome {{ userInfo.display_name }}, <br> now select the playlist you want to export</h3>
          <select name="" id="" v-on:change="searchSongs" v-model="selectedPlaylist">
            <option v-if="playlists.length == 0" value="0">Loading...</option>
            <option value="0">Select your playlist</option>
            <option v-for="playlist in playlists" v-bind:value="{ id: playlist.id, owner: playlist.owner.id, name: playlist.name }">{{ playlist.name }}</option>
          </select>
        </div>
      </div>
    </div>
    <youtube :songs="songs" :title="playlistTitle" :search="search"></youtube>
  </div>
</template>

<script>

import { getHashParams } from './scripts/utils'
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
      playlistTitle: '',
      currentPage: 1,
      userInfo : {},
      loadedSongs: false,
      apiUrl: 'https://api.spotify.com/v1',
      selectedPlaylist: 0,
      search: false,
      youtubePlaylist: {},
    }
  },
  mounted () {
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
          this.playlists = response.body.items
        }, (response) => {
          this.$router.push('/')
        })
      },
      setUserInfo () {
        return this.callApi('/me').then((response) => {
          this.userInfo = response.body
        })
      },
      parseSong (song) {
        const { track } = song
        const imagesInAlbum = track.album.images.length

        return {
          name: track.name,
          album : track.album.name,
          artists: track.artists.map((artist) => {
            return artist.name
          }),
          image: (imagesInAlbum > 0) ? track.album.images[imagesInAlbum - 1].url : '',
          videos: []
        }
      },
      searchSongs () {
        this.playlistTitle = this.selectedPlaylist.name
        // this.search = true
        return this.callApi('/users/' + this.selectedPlaylist.owner + '/playlists/' + this.selectedPlaylist.id + '/tracks').then((response) => {
          this.songs = response.body.items.map((song) => {
            return this.parseSong(song)
          })
          this.loadedSongs = true
        })
      }
  }
}
</script>

<style lang="sass">
  @import 'styles/variables';
  @import 'styles/spotify';
</style>
