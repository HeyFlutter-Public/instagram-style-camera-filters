var ball, paddle;
var paddleCollider
var minimumScale, maximumScale;
var colorToggle, scaleToggle;
var startPosition;
var delta = 0.0001;
var prevFaceVisible;

function resetBall() {
    ball.localPosition = new Vec3(0, 8, 15);
}

function onStart() {
    ball = Node.root.getChild('Ball');
    paddle = Node.root.getChild('Paddle');

    paddleCollider = Node.root.getChild('PaddleCollider');
    minimumScale = 1.9;
    maximumScale = 2.1;

    colorToggle = false;
    scaleToggle = false;
    
    prevFaceVisible = Context.isFaceVisible();
    if (prevFaceVisible)
        resetBall();
    else
        ball.enabled = false;
}


function onUpdate() {
    var faceVisible = Context.isFaceVisible();
    if (faceVisible) {
        if (!prevFaceVisible) {
            ball.enabled = true;
            resetBall();
        }
    } else if (prevFaceVisible)
        ball.enabled = false;
    if ((ball.positionOnScreen.x < -0.1 * Context.renderResolution.x) || (ball.positionOnScreen.x > 1.1 * Context.renderResolution.x) || (ball.positionOnScreen.y < -5 * Context.renderResolution.y) || (ball.positionOnScreen.y > 1.1 * Context.renderResolution.y))
        resetBall();
    prevFaceVisible = faceVisible;
     var local = ball.localScale;
     var newScale = new Vec3();
     ball.localScale = scaleToggle ? ball.localScale.sub(delta) : 
                                ball.localScale.add(delta);
 }

function onCollisionEnter(firstNode, secondNode){
    if (!checkIfCollidedWithPaddle(firstNode, secondNode)) return; 
   
    changePaddleColor();
    changeBallMinMaxScale();
    Utility.fireTrigger('hit');
}

function checkIfCollidedWithPaddle(firstNode, secondNode) {
    var collides = false;
    if (firstNode.equals(ball))
        collides = secondNode.equals(paddleCollider);
    else if (firstNode.equals(paddleCollider))
        collides = secondNode.equals(ball);
    return collides;
}

function changePaddleColor() {
    if (colorToggle) 
        Utility.changeParameter('Paddle', 'MeshRenderer',         
                               'u_color', 0.6, 0.1, 0.00, 1.0)
    else 
        Utility.changeParameter('Paddle', 'MeshRenderer', 
                                'u_color', 0.1, 0.6, 0.0, 1.0); 
    
    colorToggle = colorToggle ? false : true;
}

function changeBallMinMaxScale() {
    var newScale = scaleToggle ? minimumScale : maximumScale;
    Utility.changeParameter('Ball', null, 'scale', newScale, newScale, 
                            newScale);
    
    scaleToggle = scaleToggle ? false : true;
}

