// PathTapAnim.js
// Version: 0.0.2
// Event: Lens Initialized
// Description: Plays a single animation on the character when they are tapped and is derived from TapAnim.js

//  @ui {"widget": "group_start", "label": "Tap Animation Settings"}
//  @input string tapAnimLayer
//  @input int tapLoops
//  @ui {"widget": "group_end"}
//  @input Component.ScriptComponent followPathScript
//  @input Asset.AudioTrackAsset tapAnimAudio

var tapAnimLayerPlaying = false;
var audioComponentTap = null;

// Setup the audio component if audio track defined
function audioSetup() {
    if (script.tapAnimAudio && !audioComponentTap) {
        audioComponentTap = script.getSceneObject().createComponent("Component.AudioComponent");
        audioComponentTap.audioTrack = script.tapAnimAudio;
    }
}

audioSetup();

// Function runs at start of lens
function onLensTurnOnEvent() {
    // Make sure to reset var in lens Turn On Event
    tapAnimLayerPlaying = false;
}
var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(onLensTurnOnEvent);

function onTap(eventData) {
    if (global.scene.getCameraType() == "back" && !tapAnimLayerPlaying && !script.followPathScript.api.inArrival) {
        if (script.tapAnimLayer && script.tapAnimLayer != "" && script.api.animMixer) {
            print("TapAnim: Tapped");
            tapAnimLayerPlaying = true;

            var animLayers = script.api.animMixer.getLayers();
            for (var i = 0; i < animLayers.length; i++) {
                animLayers[i].weight = 0.0;
                animLayers[i].stop();
            }

            if (script.api.animMixer.getLayer(script.api.idleAnimLayerName)) {
                script.api.animMixer.getLayer(script.api.idleAnimLayerName).weight = 0.0;
            }

            if (script.api.animMixer.getLayer(script.tapAnimLayer)) {
                script.api.animMixer.startWithCallback(script.tapAnimLayer, 0, script.tapLoops, tapAnimEndCallback);
                script.api.animMixer.getLayer(script.tapAnimLayer).weight = 1.0;
            }

            if (script.api.idleAnimAudio && script.api.idleAnimAudio.isPlaying()) {
                script.api.idleAnimAudio.stop(false);
            }

            playTapAnimAudio(audioComponentTap, script.tapLoops);
        }
    }
}
var tapEvent = script.createEvent("TapEvent");
tapEvent.bind(onTap);

function tapAnimEndCallback() {
    tapAnimLayerPlaying = false;
    script.api.animMixer.getLayer(script.tapAnimLayer).weight = 0.0;
    stopTapAnimAudio(audioComponentTap);
    script.api.idleAnimInitFunc();
}

function playTapAnimAudio(audioComponent, loops) {
    if (audioComponent) {
        if (audioComponent.isPlaying()) {
            audioComponent.stop(false);
        }
        audioComponent.play(loops);
    }
}

function stopTapAnimAudio(audioComponent) {
    if (audioComponent) {
        if (audioComponent.isPlaying()) {
            audioComponent.stop(false);
        }
    }
}
