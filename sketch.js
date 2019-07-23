let video;
let poseNet;
let img;
let leftShoulderX = 0;
let leftShoulderY = 0;
let rightShoulderX = 0;
let rightShoulderY = 0;
let shirtPath = "/images/tshirt.png";
let shirtShoulderWidth = 0;
let scaleFactor = 0;
let shirtConfig;
let radians = 0;

$.getJSON("shirtConfig.json", function(json) {
    shirtConfig = json.shirtConfig[0];
});

function preload() {
    img = loadImage(shirtPath);
}

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();

    //img = document.getElementById("tshirt");
    //img.hidden = true;
    //createCanvas(img.width, img.height);

 /*   loadImage(imageName + '.png', img => {
        image(img, 0, 0);
    }); */

    shirtShoulderWidth = shirtConfig.leftShoulder.x - shirtConfig.rightShoulder.x;
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
    if (poses.length > 0) {
        let newLX = poses[0].pose.keypoints[5].position.x;
        let newLY = poses[0].pose.keypoints[5].position.y;
        let newRX = poses[0].pose.keypoints[6].position.x;
        let newRY = poses[0].pose.keypoints[6].position.y;
        leftShoulderX = lerp(leftShoulderX, newLX, 0.1);
        leftShoulderY = lerp(leftShoulderY, newLY, 0.1);
        rightShoulderX = lerp(rightShoulderX, newRX, 0.1);
        rightShoulderY = lerp(rightShoulderY, newRY, 0.1);
        let b = leftShoulderX - rightShoulderX;
        let a = rightShoulderY - leftShoulderY;
        let c = calcHypotenuse(Math.abs(a), b);
        scaleFactor = calcScaleFactor(c);
        radians = calcRadians(a, c);
    }
}

function modelReady() {
    console.log("model ready");
}

function draw() {
    background(220);
    image(video, 0, 0);
    drawTShirt();
    drawKeypoints();
    drawSkeleton();
}

function drawTShirt() {
    let size;
    let posX;
    let posY;
    if (scaleFactor >= 1) {
        size = shirtConfig.size / scaleFactor;
        posX = rightShoulderX - (shirtConfig.rightShoulder.x / scaleFactor);
        posY = rightShoulderY - (shirtConfig.rightShoulder.y / scaleFactor);
    } else {
        size = shirtConfig.size * scaleFactor;
    }

    //push();
    //translate(posX, posY);
    //rotate(radians *-1);

    image(img, 0, 0, size, size);
    //pop();
}

function drawSkeleton() {
    stroke(126);
    line(leftShoulderX, leftShoulderY, rightShoulderX, rightShoulderY);
}

function drawKeypoints() {
    noStroke();
    fill(0, 255, 255);
    ellipse(leftShoulderX, leftShoulderY, 10);
    ellipse(rightShoulderX, rightShoulderY, 10);
}

function calcHypotenuse(a, b) {
  return Math.sqrt(a*a + b*b);
}

function calcScaleFactor(c) {
    return (shirtShoulderWidth * 1.0)/c
}

function calcRadians(a, c) {
    return Math.asin(a / c);
}

function toDegrees (angle) {
    return angle * (180 / Math.PI);
}