<template>
  <div class="youtube">
    <div class="youtube__container">
      <ul class="youtube__list">
        <li class="song" v-for="(i, song) in songs">
          <a class="song__delete"></a>
          <div class="song__image">
            <img v-bind:src="song.track.album.images[2].url" :alt="song.track.name">
          </div>
          <div class="song__details">
            <div class="song__title">{{ song.track.name }}</div>
            <span class="song__album"><span class="song__label">Album: </span> {{ song.track.album.name }}</span>
            <div class="song__artists">
              
            </div>
            <div class="song__artists">
              <span class="song__label">Artist: </span>
              <span class="song__artist" v-for="(i, artist) in song.track.artists">
                {{ artist.name }}
              </span>
            </div>
          </div>
          <ul class="song__youtube" >
            <!-- {{ videos[song.track.id] }} -->
            <li class="video" v-for="video in videos[song.track.id]">
              <input type="radio" v-model="v[song.track.id]" :value="video.id">
              <a href="" class="video__link">
                <img v-bind:src="video.thumbnail" :alt="video.title" class="video__image">
                <span class="video__title">{{ video.title }}</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <a class="youtube__search" v-on:click="searchOnYoutube" v-bind:class="{ 'is-visible': songs != undefined && songs.length > 0 && !searched }">Search on Youtube</a>
    <a v-bind:class="{ 'is-visible': searched }" class="playlist__create">Create Playlist</a>
  </div>
</template>

<script>

export default {
  props: [
    'songs'
  ],
  data () {
    return {
      videos: {},
      v: {},
      searched: false,
    }
  },
  ready () {
  },
  watch: {
    search (val) {
      if (val === true) {
        this.searched = false
        this.searchOnYoutube()
      }
    },
  },
  methods: {
    searchOnYoutube () {
      console.log('searchOnYoutube')
      gapi.client.load('youtube', 'v3', this.searchSongs)
    },
    searchSongs () {
      gapi.client.setApiKey('AIzaSyDroJ4NHMwZJ7oG53CoRxpOOoa_jXweRJg')
      console.log('searchSongs')
      // this.searched = true
      let youtubeVideos = {}

      this.songs.forEach((v, i) => {
        let request = gapi.client.youtube.search.list({
          q: v.track.name + ' ' + v.track.artists[0].name,
          part: 'snippet'
        })

        request.execute((response) => {
          youtubeVideos[v.track.id] = this.searchSong(response)
        })

      })
      console.log(youtubeVideos, 'searchSongs')
      this.videos = youtubeVideos
      return this.videos
      
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
      margin: 0 auto;
      padding: 0;
      max-width: $container-width;
    }
    &__search {
      @include button($red, $white);
    }
    &__create {
      @include button($gray, $white);
    }
  }
  .song {
    list-style: none;
    margin: 20px 0;
    padding: 0 0 20px;
    border-bottom: 4px solid $green;
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
    &__youtube {
      padding: 20px 0 0;
      border-top: 4px solid $green;
      margin-top: 20px;
      li {
        list-style: none;
      }
    }
  }
  .video {
    margin: 0 0 10px;
    &__link {
      color: $gray;
      text-decoration: none;
      display: inline-block;
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

</style>
