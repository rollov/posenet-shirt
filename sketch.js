let video;
let poseNet;
let img;
let leftShoulderX = 0;
let leftShoulderY = 0;
let rightShoulderX = 0;
let rightShoulderY = 0;
let imageName = "model-tshirt";

function setup() {

    createCanvas(640, 480)
    video = createCapture(VIDEO)
    video.hide()

    //img = document.getElementById("tshirt");
    //img.hidden = true;
    //createCanvas(img.width, img.height);

 /*   loadImage(imageName + '.png', img => {
        image(img, 0, 0);
    }); */

    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', gotPoses)
}

function gotPoses(poses) {
    leftShoulderX = poses[0].pose.keypoints[5].position.x;
    leftShoulderY = poses[0].pose.keypoints[5].position.y;
    rightShoulderX = poses[0].pose.keypoints[6].position.x;
    rightShoulderY = poses[0].pose.keypoints[6].position.y;
}

function modelReady() {
    console.log("model ready");
    //poseNet.singlePose(video);
}

function draw() {
  background(220)
    noStroke();
    image(video, 0, 0)
    fill(0, 255, 255);
    ellipse(leftShoulderX, leftShoulderY, 10);
    ellipse(rightShoulderX, rightShoulderY, 10);
}
