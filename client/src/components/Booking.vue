<template>
  <span>
    <div>
      <b-button
        id="show-btn"
        style="margin-top: 2%"
        variant="success"
        @click="$bvModal.show('new-appointment-modal')"
      >
        New Appointment
      </b-button>
      <b-modal
        id="new-appointment-modal"
        size="lg"
        title="New Appointment"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleSubmit"
      >
        <span>
          <form ref="form">
            <b-form-group
              label="Name"
              label-for="name-input"
              invalid-feedback="Name is required"
            >
              <b-form-input
                id="name-input"
                v-model="appointmentDetails.name"
              />
            </b-form-group>
            <label for="datepicker">Choose a date</label>
            <b-form-datepicker
              id="datepicker"
              v-model="appointmentDetails.date"
              class="mb-2"
            />
            <label for="timepicker">Choose time</label>
            <b-form-timepicker
              id="timepicker"
              v-model="appointmentDetails.time"
              :now-button="true"
              locale="en"
              class="mb-2"
            />
            <b-form-checkbox
              v-show="smsSupported === 'true'"
              id="sendsmscheckbox"
              v-model="sendSMS"
              value="send"
              unchecked-value="dont_send"
            >
              Send SMS with link
            </b-form-checkbox>
            <b-form-input
              v-show="sendSMS === 'send' && smsSupported === 'true'"
              id="number-input"
              v-model="phonenumber"
              placeholder="Phone number to send to"
              class="mt-2"
            />
          </form>
        </span>
      </b-modal>
    </div>
    <div class="appointments-table">
      <b-table
        striped
        hover
        responsive="sm"
        :fields="tableHeaders"
        :items="tableItems"
      >
        <template v-slot:cell(guestURL)="row">
          <div>
            <span>Copy Guest URL</span>
            <b-button
              v-clipboard:success="onCopy"
              v-clipboard:copy="row.item.guestURL"
              size="sm"
              class="ml-2"
            >
              <span class="material-icons">
                file_copy
              </span>
            </b-button>
          </div>
        </template>
        <template v-slot:cell(hostURL)="row">
          <div>
            <span>Copy Host URL</span>
            <b-button
              v-clipboard:success="onCopy"
              v-clipboard:copy="row.item.hostURL"
              size="sm"
              class="ml-2"
            >
              <i class="material-icons">
                file_copy
              </i>
            </b-button>
          </div>
        </template>
      </b-table>
    </div>
  </span>
</template>

<script>
  /* import VueTableDynamic from "vue-table-dynamic"; */
  import moment from "moment";
  import {
    BButton,
    BModal,
    BFormInput,
    BFormGroup,
    BFormDatepicker,
    BFormTimepicker
  } from "bootstrap-vue";

  export default {
    name: "Demo",
    components: {
      /* VueTableDynamic, */
      BButton,
      BModal,
      BFormInput,
      BFormGroup,
      BFormDatepicker,
      BFormTimepicker
    },
    props: {
        originApiUrl: {
            type: String,
            default: ''
        }
    },
    data() {
      return {
        apppointmentList: [],
        appointmentDetails: {},
        tableItems: [],
        tableHeaders: [
          "index",
          "appointmentName",
          "date",
          "time",
          "hostURL",
          "guestURL"
        ],
        smsSupported: "true",
        sendSMS: "send",
        phonenumber: ""
      };
    },
    async mounted() {
      await this.fetchAppointments();
      this.updateTable();

      // TODO - Add fetch messaging channels
    },
    methods: {
      async fetchAppointments() {
        this.apppointmentList = (
          await this.$http.get(`${this.originApiUrl}/appointment/list`)
        ).data;
      },
      updateTable() {
        this.tableItems = [];
        this.apppointmentList.forEach((appointment, index) => {
          const date = new Date(appointment.date);
          // TODO - create 'copy' in gust and host url
          this.tableItems.push({
            index: index + 1,
            appointmentName: appointment.name,
            date: this.formatDate(date),
            time: this.formatTime(date),
            hostURL: `${this.originApiUrl}/video?token=${appointment.hostToken}`,
            guestURL: `${this.originApiUrl}/video?token=${appointment.guestToken}`,
          });
        });
      },
      async handleSubmit() {
        console.log(
          `Form submit details: ${JSON.stringify(
            this.appointmentDetails
          )}, number: ${this.phonenumber}`
        );

        const number = this.phonenumber;
        const shouldSendSMS = this.sendSMS;

        try {
          const dateValue = new Date(this.appointmentDetails.date);
          dateValue.setHours(
            this.appointmentDetails.time.substring(0, 2),
            this.appointmentDetails.time.substring(3, 5),
            0,
            0
          );

          const body = {
            date: dateValue.toISOString(),
            name: this.appointmentDetails.name
          };

          const result = await this.$http.post(
            `${this.originApiUrl}/appointment`,
            body
          );
          this.$swal("Success", "The appointment has been scheduled!", "success");
          await this.fetchAppointments();
          this.updateTable();
          this.sendAppointmentMessage(result.data, number, shouldSendSMS);
        } catch (err) {
          this.$swal(
            "Failure",
            `Cancellation has failed with error ${err}`,
            "error"
          );
        }
      },
      resetModal() {
        this.appointmentDetails = {};
        this.sendSMS = "send";
        this.phonenumber = "";
      },
      // Only SMS is supported for now
      async sendAppointmentMessage(appointment, number, shouldSendSMS) {
        const date = this.formatDate(appointment.date);
        const time = this.formatTime(appointment.date);
        if (shouldSendSMS === "send") {
          let template = process.env.VUE_APP_SMS_TEMPLATE;
          template = template.replace("{date}", date);
          template = template.replace("{time}", time);
          template = template.replace("{link}", `${this.originApiUrl}/video?token=${appointment.guestToken}`);

          const body = {
            channel: "SMS",
            to: number,
            params: {
              text: template
            }
          };

          try {
            const result = await this.$http.post(
              `${this.originApiUrl}/message`,
              body
            );
            this.$swal("Success", "SMS Sent successfully!", "success");
          } catch (err) {
            this.$swal(
              "Failure",
              `SMS sending has failed with error ${err}`,
              "error"
            );
          }
        }
      },
      formatDate(date) {
        return moment(date).format("dddd, MMMM Do YYYY");
      },
      formatTime(date) {
        return moment(date).format("h:mm:ss a");
      },
      onCopy: function(e) {
        alert("Link copied: " + e.text);
      }
    }
  };
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .appointments-table {
    width: 90%;
    margin: auto;
    margin-top: 2rem;
  }
</style>
