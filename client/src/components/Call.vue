<template>
    <div id="videos">
        <footer-buttons class="OT_ignore" id="bottom-buttons" 
        :hasAudio="publisherHasAudio"
        :hasVideo="publisherHasVideo"
        :toggleAudio="toggleAudio"
        :toggleVideo="toggleVideo"
        :toggleScreensharing="toggleScreensharing"
        :isScreensharing="publisherIsScreensharing"
        />
    </div>
</template>

<script>
import OT from "@opentok/client";
import FooterButtons from "./FooterButtons";

const initLayoutContainer = require('opentok-layout-js');
const layoutOptions = {
    maxRatio: 3/2,             // The narrowest ratio that will be used (default 2x3)
    minRatio: 9/16,            // The widest ratio that will be used (default 16x9)
    fixedRatio: false,         // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
    alignItems: 'center',      // Can be 'start', 'center' or 'end'. Determines where to place items when on a row or column that is not full
    bigClass: "OT_big",        // The class to add to elements that should be sized bigger
    bigPercentage: 0.8,         // The maximum percentage of space the big ones should take up
    bigFixedRatio: false,      // fixedRatio for the big ones
    bigAlignItems: 'center',   // How to align the big items
    smallAlignItems: 'center', // How to align the small row or column of items if there is a big one
    bigMaxRatio: 3/2,          // The narrowest ratio to use for the big elements (default 2x3)
    bigMinRatio: 9/16,         // The widest ratio to use for the big elements (default 16x9)
    bigFirst: true,            // Whether to place the big one in the top left (true) or bottom right
    animate: false,             // Whether you want to animate the transitions
    window,
    ignoreClass: 'OT_ignore',  // Elements with this class will be ignored and not positioned. This lets you do things like picture-in-picture
};

export default {
  name: "Call",
  components: {
    FooterButtons
  },
  props: {
      apiKey: String,
      sessionId: String,
      token: String,
  },
  data() {
    return {
      session: null,
      publisher: null,
      screen: null,
      publisherHasAudio: null,
      publisherHasVideo: null,
      publisherIsScreensharing: false,
      videoLayout: null,
      videoLayoutTimeout: null
    };
  },
  created() {},
  async mounted() {
    this.initializeSession();
  },
  methods: {
    initializeSession() {
      console.log('Initialize session element: ', document.getElementById("videos"))
      this.videoLayout = initLayoutContainer(document.getElementById("videos"), layoutOptions);
      this.registerLayoutUpdateOnResize();
      // Handle Tokbox Session
      this.session = OT.initSession(this.apiKey, this.sessionId);
      var subscriberOptions = {
        insertMode: "append",
        width: "100%",
        height: "100%",
        showControls: false,
      };
    var publisherOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        publishVideo: process.env.VUE_APP_ONLY_AUDIO,
        showControls:false
    };
	this.publisher = OT.initPublisher('videos', publisherOptions, (error) => {
        if (error) {
		    console.error('Publisher Error: ', error);
	    } else {
			// If the connection is successful, publish the publisher to the session
            console.log('Publisher Init');
		}
    });
    this.publisher.on('videoElementCreated', ()=> {
        console.log('Publisher videoElementCreated');
    })
    // Connect to the session
	this.session.connect(this.token, (error) => {
		if (error) {
		console.error(error);
	    } else {
			// If the connection is successful, publish the publisher to the session
			console.log('Session Connected');
			this.session.publish(this.publisher, (err)=> {
            if (err){
                console.log('Publish Error:', err);
            }
            console.log('Stream Published', this.publisher);
            this.publisherHasAudio = this.publisher.stream.hasAudio;
            this.publisherHasVideo =  this.publisher.stream.hasVideo;
            this.layoutUpdate();
            });
		}
    });
    
    this.session.on('streamCreated', (event)=> {
        const subscriber = this.session.subscribe(event.stream, 'videos', subscriberOptions, (err)=> {
        if (err){
            console.log('Subscriber Error:', err);
        }
         subscriber.on('videoElementCreated', (event)=> {
             console.log('Subscriber videoElementCreated', event);
             if (event.target && event.target.stream && event.target.stream.videoType === 'screen'){
                 document.getElementById(event.target.id).classList.add('OT_big');
             }
            this.layoutUpdate();
            })
            subscriber.on('destroyed', ()=> {
             console.log('Subscriber destroyed');
                this.layoutUpdate();
            })
        console.log('Stream subscriber', event.stream.id)
    });
    this.session.on('streamDestroyed', ()=>{
        this.layoutUpdate();
    })
    this.session.on('streamPropertyChanged', (event) => {
        console.log('streamPropertyChanged', event);
    })
    });
    },
    toggleAudio(){
        if (this.publisher && this.publisher.stream){
            const currentStatus = !this.publisher.stream.hasAudio;
            this.publisher.publishAudio(currentStatus);
            this.publisherHasAudio = currentStatus;
        }
    },
    toggleVideo(){
        if (this.publisher && this.publisher.stream){
            const currentStatus = !this.publisher.stream.hasVideo;
            this.publisher.publishVideo(currentStatus);
            this.publisherHasVideo = currentStatus;
        }
    },
    publishScreenSharing(){
        OT.checkScreenSharingCapability((response) => {
        if(!response.supported || response.extensionRegistered === false) {
            // This browser does not support screen sharing.
        } else {
            // Screen sharing is available. Publish the screen.
            var screenSharingOptions = {
                insertMode: 'append',
                width: '100%',
                height: '100%',
                videoSource: 'screen',
            };
            this.layoutUpdate();
            this.screen = OT.initPublisher('videos',
            screenSharingOptions,
            (error) => {
                if (error) {
                // Look at error.message to see what went wrong.
                } else {
                    this.session.publish(this.screen, (error) => {
                    if (error) {
                    // Look error.message to see what went wrong.
                    }
                    console.log('Screensharing published', this.screen);
                    document.getElementById(this.screen.id).classList.add('OT_big');
                    this.publisherIsScreensharing = true;
                    this.layoutUpdate();
                    this.screen.on('mediaStopped', () => {
                        // The user clicked stop.
                        this.publisherIsScreensharing = false;
                        this.layoutUpdate();
                    });

                    this.screen.on('streamDestroyed', (event) => {
                        if (event.reason === 'mediaStopped') {
                            this.publisherIsScreensharing = false;
                        } else if (event.reason === 'forceUnpublished') {
                            this.publisherIsScreensharing = false;
                        }
                        this.layoutUpdate();
                    });
                });
                }
            }
            );
        }
        })
    },
    unpublishScreenSharing(){
        this.session.unpublish(this.screen);
        this.screen = null;
        this.publisherIsScreensharing = false;
        this.layoutUpdate();
    },
    toggleScreensharing(){
        console.log('toggleScreensharing', this.publisherIsScreensharing)
        if (this.publisherIsScreensharing){
            this.unpublishScreenSharing();
        } else {
            this.publishScreenSharing();
        }
    },
    registerLayoutUpdateOnResize(){
        window.onresize = this.layoutUpdate;
    },
    layoutUpdate(){
        clearTimeout(this.videoLayoutTimeout);
        this.videoLayoutTimeout = setTimeout(()=> {
            this.videoLayout.layout();
        }, 100);
    }
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
  #videos{
      height:100%;
  }
}
</style>
