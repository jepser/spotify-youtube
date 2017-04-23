<template>
  <div>
    <div class="youtube" v-if="songs.length">
      <div class="youtube__container">
        <ul class="youtube__list">
          <li class="song" v-for="(song, i) in songs">
            <a class="song__delete" v-on:click.prevent="removeSong(i, $event)">×</a>
            <div class="song__image">
              <img v-bind:src="song.image" :alt="song.name">
            </div>
            <div class="song__details">
              <div class="song__title">{{ song.name }}</div>
              <span class="song__album"><span class="song__label">Album: </span> {{ song.album }}</span>
              <div class="song__artists">
                <span class="song__label">Artist: </span>
                <span class="song__artist">
                  {{ song.artists.join(', ') }}
                </span>
              </div>
            </div>
            <ul :class="{ 'song__youtube': true, 'is-visible' : song.videos.length > 0 }" >
              <li class="video" v-for="(video, videoIndex) in song.videos">
                <input type="radio" v-model="v[i]" :id="video.id" :value="video.id">
                <a :href="'https://www.youtube.com/watch?v=' + video.id" target="_blank" class="video__link">
                  <img v-bind:src="video.thumbnail" :alt="video.title" class="video__image">
                  <span class="video__title">{{ video.title }}</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <a
      class="action--search"
      v-on:click="searchOnYoutube"
      v-bind:class="{ 'is-visible': songs != undefined && songs.length > 0 && !state.searched }">
        {{ (state.searching) ? 'Searching...' : 'Search on Youtube' }}
    </a>
    <div v-bind:class="{ 'is-visible': state.searched, 'action--create': true }">
      <div class="create">
        <a class="create__link" v-on:click="createPlaylist">{{ state.exported ? 'Playlist created' : 'Create Playlist' }}</a>
        <form v-if="state.create && !state.exported" v-on:submit.prevent="submitPlaylist">
          <label for="playlist-name">Playlist name</label>
          <input type="text" class="create__name" v-model="playlist['name']" id="playlist-name">
          <p>{{ songs.length }} {{ songs.length == 1 ? 'song' : 'songs'  }} will be exported.</p>
          <button class="create__submit">
            Let's do this!
            <span v-bind:style="{ display: (state.exporting) ? 'inline-block': 'none' }">{{ songsExported + '/' + songs.length }}</span>
          </button>
        </form>
        <div class="exported" v-if="state.exported">
          <p>Awesome! Your new {{ playlist.title }} playlist is ready, <a :href="playlist.url">check it out!</a></p>
          <p>Thanks for you using it, <a :href="'https://twitter.com/intent/tweet?text=I created a playlist from Spotify to Youtube, create yours!&hashtags=spotifty,youtube&url=' + encodeURIComponent('http://spotify-youtube.jepser.com')" onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');return false;" target="_blank">now spead the word :)</a></p>
          <a v-on:click="startAgain" class="exported__button">Do you want to create another one?</a>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>

import tracking from  './scripts/tracking'

export default {
  props: [
    'songs',
    'search',
    'title'
  ],
  data () {
    return {
      videos: {},
      v: [],
      state: {
        searched: false,
        searching: false,
        create: false,
        creating: false,
        exporting: false,
        exported: false,
      },
      playlistId: 0,
      songsExported: 1,
      playlist : {
        name: '',
        id: 0,
        url: ''
      }
    }
  },
  mounted () {
  },
  watch: {
    songs (val) {
      this.state.searched = false
      return val
    }
  },
  methods: {
    searchOnYoutube () {
      gapi.client.load('youtube', 'v3', this.searchSongs)
      this.playlist.name = this.title
      this.state.searching = true
    },
    searchSongs () {
      gapi.client.setApiKey('AIzaSyDroJ4NHMwZJ7oG53CoRxpOOoa_jXweRJg')

      this.songs.forEach((v, i) => {

        if (v.artists.length == 0) return

        let request = gapi.client.youtube.search.list({
          q: v.name + ' ' + v.artists[0],
          part: 'snippet',
          type: 'video'
        })

        return request.execute((response) => {
          const youtubeSongs = this.searchSong(response)
          v.videos = youtubeSongs

          this.$set(this.v, i, youtubeSongs[0].id)
        })

      })

      tracking.event({
        eventAction: 'search_youtube',
        eventLabel: this.playlist.name,
        eventValue: this.songs.length
      })

      this.state.searched = true
      this.state.searching = false

    },
    startAgain () {
      window.location.reload()
    },
    removeSong (index, e) {
      this.songs.splice(index, 1)
    },
    searchSong (videos, songIndex) {

      if(videos.items.length > 0) {
        return videos.items.map((video, i) => {
            return {
              id: video.id.videoId,
              title: video.snippet.title,
              thumbnail: (video.snippet.thumbnails && video.snippet.thumbnails.default.url) || false
            }
        })
      }
    },
    authorizeApp(request, success, fail) {
      gapi.auth.authorize({
        client_id: '148887276127-dm6ujk208s652dgvv5novlpmigfdf691.apps.googleusercontent.com', 
        scope: 'https://www.googleapis.com/auth/youtube', 
        immediate: false
      }, (authResponse) => {
        if(authResponse.access_token){
          request.execute(success)
        }
      })
    },
    createPlaylist() {
      this.state.create = true

      tracking.event({
        eventAction: 'create_start'
      })
    },
    submitPlaylist() {
      var request = gapi.client.youtube.playlists.insert({
        part: 'snippet,status',
        resource: {
          snippet: {
            title: this.playlist.name || 'Spotify to Youtube playlist',
            description: 'This playlist has been created with http://spotify-youtube.jepser.com.'
          },
          status: {
            privacyStatus: 'public'
          }
        }
      })

      this.authorizeApp(request, (response) => {
        var result = response.result
        if (result) {
          this.playlist.id = result.id
          this.playlist.url = 'https://www.youtube.com/playlist?list=' + result.id
          this.addSongs(this.playlist.id, this.v, 0)
          this.state.exporting = true

          tracking.event({
            eventAction: 'create_end',
            eventLabel: this.playlist.name,
            eventValue: result.id
          })
        } else {
          console.error('The is an error', response)
        }
      }, () => {

      })
    },
    addSongs(playlistId, songs, index) {
      var details = {
        videoId: songs[index],
        kind: 'youtube#video'
      }
      var request = gapi.client.youtube.playlistItems.insert({
        part: 'snippet',
        resource: {
          snippet: {
            playlistId: playlistId,
            resourceId: details
          }
        }
      })

      return request.execute((response) => {
        if(index < songs.length - 1) {
          this.songsExported = index + 1
          this.addSongs(playlistId, songs, ++index)
        } else {
          this.state.exporting = false
          this.state.exported = true
        }
      })
    }
  }
}
</script>

<style lang="sass">
  @import 'styles/variables';
  @import 'styles/mixins';
  @import 'styles/youtube';
  @import 'styles/action';
</style>
