<template>
  <div class="youtube">
    <div class="youtube__container">
      <ul class="youtube__list">
        <li class="song" v-for="(i, song) in songs">
          <a class="song__delete"></a>
          <div class="song__image">
            <img v-bind:src="song.track.album.images[2].url" alt="{{ song.track.name }}">
          </div>
          <div class="song__title">{{ song.track.name }}</div>
          <ul class="song__youtube" >
          {{ videos }}
            <!-- {{ videos[song.track.id] }} -->
            <li class="video" v-for="video in videos[i]">
              <!-- <input type="radio" v-model=""> -->
              {{ video }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
    {{ videos }}
  </div>
</template>

<script>

export default {
  props: [
    'songs',
    'search'
  ],
  data () {
    return {
      videos: []
    }
  },
  ready () {
  },
  watch: {
    search (val) {
      if (val === true) {
        this.searchOnYoutube()
      }
    }
  },
  methods: {
    searchOnYoutube () {
      gapi.client.load('youtube', 'v3', this.searchSongs)
      this.search = false
    },
    searchSongs () {
      gapi.client.setApiKey('AIzaSyDroJ4NHMwZJ7oG53CoRxpOOoa_jXweRJg')
      this.songs.forEach((v, i) => {
        console.log(this.songs[i])
        var request = gapi.client.youtube.search.list({
          q: v.track.name + ' ' + v.track.artists[0].name,
          part: 'snippet'
        })

        request.execute((response) => {
          return this.searchSong(response, v.track.id)
        })
      })
    },
    searchSong (videos, songIndex) {

      if(videos.items.length > 0) {

        var $this = this
        console.log(this.videos)
        // this.videos.push('hola')
        this.videos[songIndex] = []
        videos.items.forEach((video, i) => {
          $this.videos[songIndex].push({
            id: video.id.videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.default.url
          })

          return video  
        })
        
      }
      
    }
  }
}
</script>

<style lang="sass">
  @import 'styles/variables';

  .youtube {
    background-color: $white;
    color: $black;
    &__list {
      margin: 0;
    }
  }
  .song {
    list-style: none;
    @include clear;
  }
</style>
