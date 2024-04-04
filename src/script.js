const POINT_RADIUS = 70;
const SELECTED_BOX_OFFSET = 20;
const MINI_POINT_RADIUS = 20;

function fieldSwitcherEventHandlers() {
    // matchfield & skillsfield buttons
    const matchFieldButton = document.getElementById('match-field-button');
    const skillsFieldButton = document.getElementById('skills-field-button');
    const matchField = document.getElementById('match-field');

    matchFieldButton.addEventListener('click', () => {
        matchField.style.display = 'block';
    
    });

    skillsFieldButton.addEventListener('click', () => {
        matchField.style.display = 'none';
    });
}

function mediaControlEventHandlers() {
    // play, pause & reset buttons
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const resetButton = document.getElementById('reset-button');

    playButton.addEventListener('click', () => {
        playButton.style.display = 'none';
        pauseButton.style.display = 'block';
        console.log('play button pressed, pause button displayed');
    });

    pauseButton.addEventListener('click', () => {
        playButton.style.display = 'block';
        pauseButton.style.display = 'none';
        console.log('pause button pressed, play button displayed');
    });

    resetButton.addEventListener('click', () => {
        if (pauseButton.style.display === 'block') {
            playButton.style.display = 'block';
            pauseButton.style.display = 'none';
            console.log('reset button pressed, play button displayed');
        }
        console.log('reset button pressed');
    });
}

fieldSwitcherEventHandlers();
mediaControlEventHandlers();

// get canvas size
const fieldCanvas = document.getElementById('field-canvas');
const ctx = fieldCanvas.getContext('2d');

// resize the canvas to become a square
function resizeCanvasToImg() { // IMG MUST BE SQUARE
    let img = document.getElementById('match-field');
    fieldCanvas.width = img.naturalWidth;
    fieldCanvas.height = img.naturalHeight;
}

resizeCanvasToImg();

console.log("Canvas size:", fieldCanvas.width, fieldCanvas.height);

let mouseX = 0;
let mouseY = 0;

fieldCanvas.addEventListener('mousemove', (e) => {
    let rect = fieldCanvas.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width) * fieldCanvas.width - fieldCanvas.width / 2;
    mouseY = ((e.clientY - rect.top) / rect.height) * fieldCanvas.height - fieldCanvas.height / 2;

   console.log("Mouse position:", mouseX, mouseY); 
});

// Point class
class Point {
    constructor(x, y, theta=0) {
        this.x = x;
        this.y = y;
        this.theta = theta;
        this.updateCanvasPosition();
    }

    moveToPoint(x, y) {
        this.x = x;
        this.y = y;
        this.updateCanvasPosition();
    }

    updateCanvasPosition() {
        this._canvasX = this.x + fieldCanvas.width / 2;
        this._canvasY = this.y + fieldCanvas.height / 2;
    }

    rotate(theta) {
        this.theta += theta;
        this.theta %= (2 * Math.PI);
    }

    distanceTo_Squared(point) { // no sqrt calculations -- they are expensive
        return (this.x - point.x)**2 + (this.y - point.y)**2; // 0, 0 at center of canvas
    }

    angleTo(point) {
        return Math.atan2(point.y - this.y, point.x - this.x); // 0, 0 at center of canvas
    }

    isHovered() {
        return this.distanceTo_Squared(new Point(mouseX, mouseY)) < POINT_RADIUS ** 2; // squared distance
    }

    draw(num=0) {
        // Draw the circle
        ctx.beginPath();
        ctx.arc(this._canvasX, this._canvasY, POINT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = 'purple';
        ctx.fill();
    
        // Draw the line
        ctx.beginPath();
        ctx.moveTo(
            this._canvasX + (POINT_RADIUS/3) * Math.cos(this.theta), 
            this._canvasY + (POINT_RADIUS/3) * Math.sin(this.theta)); // Start at the center of the circle (+ radius offset)
        ctx.lineTo(
            this._canvasX + POINT_RADIUS * Math.cos(this.theta), 
            this._canvasY + POINT_RADIUS * Math.sin(this.theta)
        ); // End at the edge of the circle at the angle theta
        ctx.strokeStyle = 'black'; // Set the color of the line
        ctx.lineWidth = 10; // Set the width of the line
        ctx.stroke(); // Draw the line

        // Draw the number
        ctx.fillStyle = 'white'; // Set the color of the text
        ctx.font = '80px Arial'; // Set the font size and family
        ctx.textAlign = 'center'; // Center the text
        ctx.textBaseline = 'middle'; // Vertically align the text
        ctx.fillText(num, this._canvasX, this._canvasY); // Draw the number
    
        // Draw the border
        ctx.beginPath();
        ctx.arc(this._canvasX, this._canvasY, POINT_RADIUS, 0, Math.PI * 2);
        ctx.strokeStyle = 'black'; // Set the color of the border
        ctx.lineWidth = 10; // Set the width of the border
        ctx.stroke(); // Draw the border
    }

    drawMini(num=0) {
        // Draw the circle
        ctx.beginPath();
        ctx.arc(this._canvasX, this._canvasY, MINI_POINT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = 'purple';
        ctx.fill();
    }

    drawLineTo(point) {
        ctx.beginPath();
        ctx.setLineDash([20, 20]); // Set the line dash pattern to create a dotted line
        ctx.moveTo(this._canvasX, this._canvasY);
        ctx.lineTo(point._canvasX, point._canvasY);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.setLineDash([]); // Reset the line dash pattern to solid line
    }

    drawSelectedBox() {
        ctx.beginPath();
        ctx.rect(
            this._canvasX - (POINT_RADIUS + SELECTED_BOX_OFFSET),
            this._canvasY - (POINT_RADIUS + SELECTED_BOX_OFFSET),
            (POINT_RADIUS + SELECTED_BOX_OFFSET) * 2,
            (POINT_RADIUS + SELECTED_BOX_OFFSET) * 2
        );
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 5;
        ctx.stroke();
    }
}


console.log("amogus")

let points = [];
points.push(new Point(0, 0, 0));


let selectedPoint = null; // Declare the selectedPoint variable outside of the animate function

fieldCanvas.addEventListener('mousedown', handleMouseDown);

function handleMouseDown(e) {
    
    if (e.button !== 0) return; // left mouse = 0, middle mouse = 1, right mouse = 2
    selectedPoint = points.find(point => point.isHovered());

    if (!selectedPoint) {
        let newPoint = new Point(mouseX, mouseY);
        points.push(newPoint);
        selectedPoint = newPoint;
    }

    fieldCanvas.addEventListener('mousemove', movePoint);
    fieldCanvas.addEventListener('wheel', changeAngle);
    fieldCanvas.addEventListener('mouseup', stopMovingPoint);
    window.addEventListener('keydown', handleKeyDown);
    robotX.addEventListener('input', updateRobotX);
    robotY.addEventListener('input', updateRobotY);
    robotAngle.addEventListener('input', updateRobotAngle);

    updateSidebar();
    console.log("mouse down, selecting point", points.indexOf(selectedPoint) + 1, ". Selected point:", selectedPoint);
}


function handleKeyDown(e) {
    // If the active element is a text input, return early
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.type === 'text') {
        return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
        removePoint(selectedPoint);
    }
}

function removePoint(point) {
    if (points.length > 1) {
        const index = points.indexOf(point);
        points.splice(index, 1);
        selectedPoint = null;
    }

    updateSidebar();
}

function movePoint() {
    if (selectedPoint) { // Check if selectedPoint is not null
        selectedPoint.moveToPoint(mouseX, mouseY);
    }

    updateSidebar();
    console.log("mouse move, moving point", points.indexOf(selectedPoint) + 1);
}

function stopMovingPoint() {
    fieldCanvas.removeEventListener('mousemove', movePoint);
    fieldCanvas.removeEventListener('mouseup', stopMovingPoint);

    console.log("mouse up, stopping event listening on point", points.indexOf(selectedPoint) + 1);
}

function changeAngle(e) {
    const oldTheta = selectedPoint.theta * 180 / Math.PI;

    if (selectedPoint && selectedPoint.isHovered()) {
        const direction = e.deltaY > 0 ? -1 : 1;
        selectedPoint.rotate(2 * direction * Math.PI / 180); // Rotate the selected point by 1 degree
    }

    updateSidebar();
    console.log("mouse wheel, changing angle of point", points.indexOf(selectedPoint) + 1, "from", oldTheta, "to", selectedPoint.theta * 180 / Math.PI);
}

// TODO - add redundancy checks: if the input is not a number, if the input is empty
function updateRobotX() {

    const xInputValue = constrainInputToField(parseFloat(robotX.value));
    
    if (selectedPoint) {
        selectedPoint.moveToPoint(convertFieldUnitsToPixel(xInputValue), selectedPoint.y);
    }

    updateSidebar();
    console.log("updating robot x to", robotX.value, ". Selected point:", points.indexOf(selectedPoint) + 1);
}

function updateRobotY() {
    const yInputValue = constrainInputToField(parseFloat(robotY.value));

    if (selectedPoint) {
        selectedPoint.moveToPoint(selectedPoint.x, convertFieldUnitsToPixel(yInputValue));
    }

    updateSidebar();
    console.log("updating robot y to", robotY.value, ". Selected point:", points.indexOf(selectedPoint) + 1);
}

// TODO - you have to type the number THEN the negative sign. FIX IT
function updateRobotAngle() {
    const angleInputValue = parseFloat(robotAngle.value) % 360;

    if (selectedPoint) {
        selectedPoint.theta = angleInputValue * Math.PI / 180;
    }

    updateSidebar();
    console.log("updating robot angle to", robotAngle.value, ". Selected point:", points.indexOf(selectedPoint) + 1);
}

function constrainInputToField(number) {
    return Math.max(-72, Math.min(72, number));
}

const robotX = document.getElementById('robot-x');
const robotY = document.getElementById('robot-y');
const robotAngle = document.getElementById('robot-angle');
const selectedVar = document.getElementById('selected-var');

function update() {
    function drawPoints() {
        ctx.clearRect(0, 0, fieldCanvas.width, fieldCanvas.height);

        points.forEach((point, index) => {
            if (index < points.length - 1) { // draw lines from point to point except for the last waypoint
                point.drawLineTo(points[index + 1]);
            }
            point.draw(index + 1); // draw all points w/ their respective numbers (index + 1)

            if (point === selectedPoint) {
                point.drawSelectedBox();
            }
        });

        requestAnimationFrame(update);
    }
    drawPoints();
} 

update();

function updateSidebar() {
    if (selectedPoint) {
        robotX.value = formatNumberWithCeiling(convertPixelToFieldUnits(selectedPoint.x));
        robotY.value = formatNumberWithCeiling(convertPixelToFieldUnits(selectedPoint.y));
        robotAngle.value = formatNumberWithCeiling(selectedPoint.theta * 180 / Math.PI);
        selectedVar.innerText = "Point " + (points.indexOf(selectedPoint) + 1);
    } else {
        robotX.value = '';
        robotY.value = '';
        robotAngle.value = '';
        selectedVar.innerText = "None";
    }
}

function convertPixelToFieldUnits(number) {
    return number * (144 / fieldCanvas.width); // fieldCanvas must be a square
}

function convertFieldUnitsToPixel(number) {
    return number * (fieldCanvas.width / 144); // fieldCanvas must be a square
}

function formatNumberWithCeiling(number, decimalPlaces=6) {
    // Round the number up to decimalPlaces decimal places
    let roundedNumber = Math.ceil(number * (10 ** decimalPlaces)) / (10 ** decimalPlaces);

    // Convert the rounded number to a string and trim trailing zeros
    let formattedNumber = roundedNumber.toString().replace(/(\.\d*?)0+$/, '$1');

    return formattedNumber;
}