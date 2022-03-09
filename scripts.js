document.addEventListener("DOMContentLoaded", () => {
	const gridEl = document.querySelector(".grid");
	const scoreEl = document.querySelector("#score");
	const startBtn = document.querySelector("#startBtn");
	const resetBtn = document.querySelector("#resetBtn");
	const width = 10;
	let timerId;
	let score = 0;
	const colors = ["#008000", "#33FFF1", "#61FF33", "#E333FF", "#E7FF33"];

	// setting the 200 divs
	for (let i = 0; i < 220; i++) {
		const block = document.createElement("div");

		gridEl.appendChild(block);

		if (i >= 200) {
			block.classList.add("taken");
			gridEl.appendChild(block);
		}
	}

	let squares = Array.from(document.querySelectorAll(".grid div"));

	// Mini-grid display
	const miniGrid = document.querySelector(".miniGrid");

	for (let j = 0; j < 16; j++) {
		const miniBlock = document.createElement("div");

		miniGrid.appendChild(miniBlock);
	}

	const displaySquares = document.querySelectorAll(".miniGrid div");
	const displayWidth = 4;
	let displayIndex = 0;
	let nextRandom = 0;

	// the mini Tetrominos
	const upNext = [
		[1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
		[0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
		[1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
		[0, 1, displayWidth, displayWidth + 1], // oTetromino
		[1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
	];

	// display the shape in the mini-grid display
	const displayShape = () => {
		//  removes tetromino from the mini-grid
		displaySquares.forEach((square) => {
			square.classList.remove("tetromino");
			square.style.backgroundColor = "";
		});
		upNext[nextRandom].forEach((index) => {
			displaySquares[displayIndex + index].classList.add("tetromino");
			displaySquares[displayIndex + index].style.backgroundColor =
				colors[random];
		});
	};

	// The Tetrominoes
	const lTetrimino = [
		[1, width + 1, width * 2 + 1, 2],
		[width, width + 1, width + 2, width * 2 + 2],
		[1, width + 1, width * 2 + 1, width * 2],
		[width, width * 2, width * 2 + 1, width * 2 + 2],
	];

	const zTetromino = [
		[0, width, width + 1, width * 2 + 1],
		[width + 1, width + 2, width * 2, width * 2 + 1],
		[0, width, width + 1, width * 2 + 1],
		[width + 1, width + 2, width * 2, width * 2 + 1],
	];

	const tTetromino = [
		[1, width, width + 1, width + 2],
		[1, width + 1, width + 2, width * 2 + 1],
		[width, width + 1, width + 2, width * 2 + 1],
		[1, width, width + 1, width * 2 + 1],
	];

	const oTetromino = [
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
		[0, 1, width, width + 1],
	];

	const iTetromino = [
		[1, width + 1, width * 2 + 1, width * 3 + 1],
		[width, width + 1, width + 2, width + 3],
		[1, width + 1, width * 2 + 1, width * 3 + 1],
		[width, width + 1, width + 2, width + 3],
	];

	const theTetrominoes = [
		lTetrimino,
		zTetromino,
		tTetromino,
		oTetromino,
		iTetromino,
	];

	console.log(theTetrominoes);

	let currentPosition = 4;
	let currentRotation = 0;

	// randomly select a Tetromino and its first rotation
	let random = Math.floor(Math.random() * theTetrominoes.length);

	let current = theTetrominoes[random][currentRotation];

	console.log(current);

	//  draw the rotation
	const draw = () => {
		current.forEach((index) => {
			squares[currentPosition + index].classList.add("tetromino");
			squares[currentPosition + index].style.backgroundColor = colors[random];
		});
	};

	// undraw the tetromino
	const undraw = () => {
		current.forEach((index) => {
			squares[currentPosition + index].classList.remove("tetromino");
			squares[currentPosition + index].style.backgroundColor = "";
		});
	};

	// keyCade functions
	const control = (e) => {
		if (e.keyCode === 37) {
			moveLeft();
		} else if (e.keyCode === 38) {
			rotate();
		} else if (e.keyCode === 39) {
			moveRight();
		} else if (e.keyCode === 40) {
			moveDown();
		}
	};

	// move down function
	const moveDown = () => {
		undraw();
		currentPosition += width;
		draw();
		freezeMove();
	};

	// freeze function
	const freezeMove = () => {
		if (
			current.some((index) =>
				squares[currentPosition + index + width].classList.contains("taken"),
			)
		) {
			current.forEach((index) =>
				squares[currentPosition + index].classList.add("taken"),
			);
			random = nextRandom;
			nextRandom = Math.floor(Math.random() * theTetrominoes.length);
			current = theTetrominoes[random][currentRotation];
			currentPosition = 4;
			draw();
			displayShape();
			addScore();
			gameOver();
		}
	};

	document.addEventListener("keyup", control);

	// move the tetromino left, unless is at edge or there is a blockage
	const moveLeft = () => {
		undraw();
		const isAtLeftEdge = current.some(
			(index) => (currentPosition + index) % width === 0,
		);
		if (!isAtLeftEdge) currentPosition -= 1;

		if (
			current.some((index) =>
				squares[currentPosition + index].classList.contains("taken"),
			)
		) {
			currentPosition += 1;
		}

		draw();
	};

	// move the tetromino right, unless is at edge or there is a blockage
	const moveRight = () => {
		undraw();
		const isAtRightEdge = current.some(
			(index) => (currentPosition + index) % width === width - 1,
		);
		if (!isAtRightEdge) currentPosition += 1;

		if (
			current.some((index) =>
				squares[currentPosition + index].classList.contains("taken"),
			)
		) {
			currentPosition -= 1;
		}

		draw();
	};

	// rotate the tetromino
	const rotate = () => {
		undraw();
		currentRotation++;
		if (currentRotation === current.length) {
			// if the current rotaion reaches the maximum, restart rotation
			currentRotation = 0;
		}
		current = theTetrominoes[random][currentRotation];

		draw();
	};

	// start the game
	startBtn.addEventListener("click", () => {
		if (timerId) {
			clearInterval(timerId);
			startBtn.innerHTML = `Start`;
			startBtn.style.backgroundColor = "#0E9A12";
			timerId = null;
		} else {
			draw();
			startBtn.innerHTML = `Pause`;
			startBtn.style.backgroundColor = "#ed2d34";
			timerId = setInterval(moveDown, 1000);
			nextRandom = Math.floor(Math.random() * theTetrominoes.length);
			displayShape();
		}
	});

	// display score
	const addScore = () => {
		for (let x = 0; x < 199; x += width) {
			const row = [
				x,
				x + 1,
				x + 2,
				x + 3,
				x + 4,
				x + 5,
				x + 6,
				x + 7,
				x + 8,
				x + 9,
			];

			if (row.every((index) => squares[index].classList.contains("taken"))) {
				score += 10;
				scoreEl.innerHTML = score;
				row.forEach((index) => {
					squares[index].classList.remove("taken");
					squares[index].classList.remove("tetromino");
					squares[index].style.backgroundColor = "";
				});
				const squaresRemove = squares.splice(x, width);
				squares = squaresRemove.concat(squares);
				squares.forEach((cell) => gridEl.appendChild(cell));
			}
		}
	};

	// game over
	const gameOver = () => {
		if (
			current.some((index) =>
				squares[currentPosition + index].classList.contains("taken"),
			)
		) {
			alert("END GAME!!!");
			scoreEl.innerHTML = "End";
			clearInterval(timerId);
		}
	};
});
