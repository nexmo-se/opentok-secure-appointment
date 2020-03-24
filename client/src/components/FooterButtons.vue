<template>
  <div>
    <button type="button" class="btn btn-default" v-on:click="toggleAudio">
        <i v-if="hasAudio" class="material-icons">mic</i>
        
        <i v-else class="material-icons">mic_off</i>
    </button>
    <button type="button" class="btn btn-default" v-on:click="toggleVideo">
        <i v-if="hasVideo" class="material-icons">
            videocam
        </i>
        <i v-else class="material-icons">
            videocam_off
        </i>
    </button>
    <button type="button" class="btn btn-default" v-on:click="toggleScreensharing">
        <i v-if="isScreensharing"  class="material-icons">
            stop_screen_share
        </i>
        <i v-else class="material-icons">
            screen_share
        </i>
    </button>
  </div>
</template>

<script>
export default {
  name: "FooterButtons",
  props: {
    hasAudio: Boolean,
    hasVideo: Boolean,
    isScreensharing: Boolean,
    toggleAudio: Function,
    toggleVideo: Function,
    toggleScreensharing: Function
  },
  mounted(){
      //fa-microphone-slash
      // this.publisher.on('');
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#bottom-buttons{
      position: absolute;
      bottom: 10px;
      left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.7);
        z-index: 4;
        padding: 5px 25px;
        border-radius: 5px;
        display: flex;
        .material-icons {
            color: #fff;
        }
  }
</style>
