<template>
  <div class="video-conference-container">
    <waiting-room
      v-if="showWaitingRoom"
      :state="waitingRoomState"
    />
    <call
      v-else-if="showVideoCall"
      :api-key="apiKey"
      :session-id="sessionId"
      :token="token"
    />
    <div
      v-else
      class="loading-container"
    >
      <div
        class="spinner-border"
        role="status"
        style="width: 3rem; height: 3rem;"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
</template>
<script>
import { VIDEO_CALL_STATE } from "./../constants";
import WaitingRoom from "./WaitingRoom";
import Call from "./Call";

export default {
  name: "VideoCall",
  components: {
    WaitingRoom,
    Call
  },
  props: {
        originApiUrl: {
            type: String,
            default: ''
        }
    },
  data() {
    return {
      apiKey: null,
      sessionId: null,
      token: null,
      state: VIDEO_CALL_STATE.LOADING,
      waitingRoomState: null
    };
  },
  computed: {
    showWaitingRoom: function () {
      return this.state === VIDEO_CALL_STATE.WAITING;
    },
    showVideoCall: function () {
      return this.state === VIDEO_CALL_STATE.RUNNING;
    },
  },
  created() {},
  async mounted() {
      try {
        const result = (await this.$http.get(`${this.originApiUrl}/token/${this.$route.query.token}`)).data;
        const {apiKey, sessionId, token} = result;
        this.apiKey = apiKey;
        this.sessionId = sessionId;
        this.token = token;
        this.state = VIDEO_CALL_STATE.RUNNING;  
    } catch(err){
        console.log('API call error', err.response);
        if (err && err.response && err.response.data) {
            this.waitingRoomState = err.response.data;
        } else {
            this.waitingRoomState = {errCode: 5};
        }
        this.state = VIDEO_CALL_STATE.WAITING;
    }

  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.video-conference-container {
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #5f6062;
}
  .loading-container{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
  }
</style>
