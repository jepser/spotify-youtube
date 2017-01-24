<template>
  <div class="youtube">
    <div class="youtube__container">
      <ul class="youtube__list">
        <li class="song" v-for="(song, i) in songs">
          <a class="song__delete" v-on:click.prevent="removeSong(i, $event)">×</a>
          <div class="song__image">
            <img v-bind:src="song.track.album.images[2].url" :alt="song.track.name">
          </div>
          <div class="song__details">
            <div class="song__title">{{ song.track.name }}</div>
            <span class="song__album"><span class="song__label">Album: </span> {{ song.track.album.name }}</span>
            <div class="song__artists">
              <span class="song__label">Artist: </span>
              <span class="song__artist">
                {{ getArtists(song.track.artists) }}
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
    <a class="youtube__search" v-on:click="searchOnYoutube" v-bind:class="{ 'is-visible': songs != undefined && songs.length > 0 && !searched }">{{ (searching) ? 'Searching...' : 'Search on Youtube' }}</a>
    <div v-bind:class="{ 'is-visible': searched, 'youtube__create': true }">
      <div class="create">
        <a class="create__link" v-on:click="createPlaylist">Create Playlist</a>
        <form v-if="create" v-on:submit.prevent="submitPlaylist">
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
      searched: false,
      searching: false,
      creating: false,
      exporting: false,
      exported: false,
      create: false,
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
      this.searched = false
      return val
    },
    exported(val) {
      if (val == true) {
        console.log('exported playlist')
        // window.location = 
      }
    }
  },
  methods: {
    searchOnYoutube () {
      gapi.client.load('youtube', 'v3', this.searchSongs)
      this.playlist.name = this.title
      this.searching = true
    },
    searchSongs () {
      gapi.client.setApiKey('AIzaSyDroJ4NHMwZJ7oG53CoRxpOOoa_jXweRJg')

      this.songs.forEach((v, i) => {
        let request = gapi.client.youtube.search.list({
          q: v.track.name + ' ' + v.track.artists[0].name,
          part: 'snippet',
          type: 'video'
        })

        return request.execute((response) => {
          const youtubeSongs = this.searchSong(response)
          v.videos = youtubeSongs

          this.$set(this.v, i, youtubeSongs[0].id)
        })

      })

      this.searched = true
      this.searching = false

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
      this.create = true
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

  @mixin button($bg, $color) {
    background-color: $bg;
    color: $color;
    width: 100%;
    padding: 12px;
    display: block;
    position: fixed;
    bottom: -50px;
    left: 0;
    text-align: center;
    transition: bottom .3s ease-out .6s;
    &:hover {
      cursor: pointer;
    }
    &.is-visible {
      bottom: 0;
    }
  }
  .youtube {
    background-color: $white;
    color: $black;
    padding: 1px 0;
    &__list {
      margin: 0 auto 50px;
      padding: 0;
      max-width: $container-width;
    }
    &__search {
      @include button($red, $white);
    }
    &__create {
      position: fixed;
      bottom: -50px;
      left: 0;
      width: 100%;
      background-color: $gray;
      color: $white;
      transition: bottom .3s ease-out .6s;
      &.is-visible {
        bottom: 0;
      }
    }
  }
  .song {
    list-style: none;
    margin: 0;
    padding: 20px;
    border-bottom: 4px solid $green;
    position: relative;
    @include clear;
    &__details {
      margin-left: 84px;
    }
    &__title {
      margin: 0 0 10px;
    }
    &__image {
      float: left;
      width: 64px;
      height: 64px;
    }
    &__label {
      text-transform: uppercase;
    }
    &__album {
      font-size: 12px;
      text-transform: uppercase;
      margin: 0 0 5px;
      display: inline-block;
    }
    &__artists {
      font-size: 12px;
      text-transform: uppercase;
    }
    &__delete {
      position: absolute;
      right: 0;
      top: 20px;
      padding: 1px 7px;
      background-color: #E1E1E1;
      opacity: 0;
      pointer-events: none;
      transition: opacity .3s ease;
    }
    &__youtube {
      padding: 20px 0 0;
      border-top: 4px solid $green;
      margin-top: 20px;
      display: none;
      li {
        list-style: none;
      }
      &.is-visible {
        display: block;
      }
    }
    &:hover {
      .song__delete {
        opacity: 1;
        pointer-events: auto;
      }
    }
  }
  .video {
    margin: 0 0 10px;
    @include clear;
    input {
      float: left;
      margin: 13px 10px 0 0;
    }
    &__link {
      color: $gray;
      text-decoration: none;
      @include clear;
    }
    &__title {
      line-height: 38px;
    }
    &__image {
      width: 50px;
      height: auto;
      float: left;
      margin: 0 10px 0 0;
    }
  }
  .create {
    &__link {
      text-align: center;
      padding: 12px 0;
      display: block;
    }
    form {
      border-top: 4px solid $white;
      max-width: $container-width;
      width: 100%;
      margin: 0 auto 0;
      padding: 30px 20px;
      text-align: left;  
    }
    label {
      font-size: 12px;
      display: block;
      margin-bottom: 5px;
    }
    &__link {
      color: $white;
      text-align: center;
      display: block;
    }
    &__name {
      border: none;
      background-color: transparent;
      border-bottom: 2px solid $white;
      color: $white;
      font-size: 18px;
      width: 50%;
      &:focus {
        outline: none;
      }
    }
    &__submit {
      background-color: $white;
      border: none;
      color: $gray;
      padding: 12px 20px;
      font-size: 18px;
      margin: 0 auto;
    }
  }

</style>
