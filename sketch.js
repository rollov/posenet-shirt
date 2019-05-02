let video;
let poseNet;
let img;

function setup() {
    createCanvas(640, 480);
//    video = createCapture(VIDEO)
//    video.hide()

    img = document.getElementById("tshirt");

    poseNet = ml5.poseNet(modelReady);
    
    poseNet.on('pose', function (poses) {
        console.log(poses);
    });

}

function modelReady() {
    console.log("model ready")
    poseNet.singlePose(img);
}

function draw() {
    //image(video, 0, 0)
}
