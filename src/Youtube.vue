<template>
  <div class="youtube">
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
              <a href="" class="video__link">
                <img v-bind:src="video.thumbnail" :alt="video.title" class="video__image">
                <span class="video__title">{{ video.title }}</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <a class="youtube__search" v-on:click="searchOnYoutube" v-bind:class="{ 'is-visible': songs != undefined && songs.length > 0 && !state.searched }">{{ (state.searching) ? 'Searching...' : 'Search on Youtube' }}</a>
    <div v-bind:class="{ 'is-visible': state.searched, 'youtube__create': true }">
      <div class="create">
        <a class="create__link" v-on:click="createPlaylist">Create Playlist</a>
        <form v-if="state.create" v-on:submit.prevent="submitPlaylist">
          <label for="playlist-name">Playlist name</label>
          <input type="text" class="create__name" v-model="playlist['name']" id="playlist-name">
          <p>{{ songs.length }} {{ songs.length == 1 ? 'song' : 'songs'  }} will be exported.</p>
          <button class="create__submit">
            Let's do this!
            <span v-bind:style="{ display: (exporting) ? 'block': 'none' }">{{ songsExported + '/' + songs.length }}</span>
          </button>
        </form>
      </div>
    </div>
    
  </div>
</template>

<script>

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
    },
    // exported(val) {
    //   if (val == true) {
    //     console.log('exported playlist')
    //     // window.location = 
    //   }
    // }
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

      this.state.searched = true
      this.state.searching = false

    },
    getArtists(artists) {
      const artistNames = artists.map((artist) => {
        return artist.name
      })

      return artistNames.join(', ')
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
          this.addSongs(this.playlist.id, this.v, 0)
          this.exporting = true
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
          this.exporting = false
          this.exported = true
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
</style>
