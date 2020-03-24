<template>
  <div class="waiting-room-container">
    <div v-if="state.errCode === 1">
      <p class="message-text">
        Your call is scheduled at : {{ formatDate(scheduledDate) }}
      </p>
      <p class="message-text">
        {{ errorMessage }}
      </p>
      <button
        type="button"
        class="btn btn-primary"
        @click="reloadPage"
      >
        <span>Reload page</span>
      </button>
    </div>
    <div v-else-if="state.errCode === 2">
      <p class="message-text">
        Your call is scheduled at : {{ formatDate(scheduledDate) }}
      </p>
      <p class="message-text">
        {{ errorMessage }}
      </p>
      <button
        type="button"
        class="btn btn-primary"
        @click="reloadPage"
      >
        <span>Reload page</span>
      </button>
    </div>
    <div v-else>
      <div class="message-text">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import {WAITING_ROOM_MESSAGE} from '../constants';
import moment from "moment";
export default {
  name: "WaitingRoom",
  props: {
    state: Object,
    date: String
  },
  data(){
      return {
          scheduledDate: null,
          errorMessage: ''
      }
  },
  mounted(){
      if (this.state.errCode === 1) {
        // too early
        this.errorMessage = WAITING_ROOM_MESSAGE.DATE_IS_BEFORE.message;
        this.scheduledDate = this.state.data;
      } else if (this.state.errCode === 2) {
        this.errorMessage = WAITING_ROOM_MESSAGE.EXPIRED_LINK.message;
        this.scheduledDate = this.state.data;
      } else {
        this.errorMessage = WAITING_ROOM_MESSAGE.NOT_VALID_LINK.message;
      }
  },
  methods: {
      reloadPage() {
          window.location.reload(true);
      },
      formatDate(date){
          return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.waiting-room-container {
  display: flex;
  width: 100%;
  padding: 20px;
  justify-content: center;
  align-items: center;
  height: 100%;
  .message-text {
    font-size: 1.5rem;
    color: #fff;
  }
}
</style>
