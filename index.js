document.addEventListener('DOMContentLoaded', () => {
	const ratioSelect = document.getElementById('ratio');
	const widthInput = document.getElementById('width');
	const heightInput = document.getElementById('height');
	const downloadButton = document.getElementById('download');
	const demoBox = document.getElementById('demo');

	if (
		!ratioSelect ||
		!widthInput ||
		!heightInput ||
		!downloadButton ||
		!demoBox
	) {
		console.error('Missing elements');
		return;
	}

	// get the color from the demoBox style
	const color = getComputedStyle(demoBox).backgroundColor;

	function gcd(a, b) {
		return b === 0 ? a : gcd(b, a % b);
	}

	function calculateRatio(width, height) {
		const divisor = gcd(width, height);
		return `${width / divisor}:${height / divisor}`;
	}
	function updateDemo(width, height) {
		if (demoBox) {
			const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
			<rect width="100%" height="100%" fill="${color}"/>
	 </svg>`;
			demoBox.innerHTML = svg;
			// demoBox.style = `aspect-ratio: ${width} / ${height}`;
		}
	}

	function updateDimension(changedInput, calculatedInput) {
		const [widthRatio, heightRatio] = ratioSelect.value.split(':').map(Number);
		const changedValue = parseFloat(changedInput.value);
		if (changedInput === widthInput) {
			const value = Math.round((changedValue * heightRatio) / widthRatio);
			calculatedInput.value = value;
		} else {
			const value = Math.round((changedValue * widthRatio) / heightRatio);
			calculatedInput.value = value;
		}
		updateDemo(widthInput.value, heightInput.value);
	}

	function downloadSVG() {
		const svgContent = demoBox.innerHTML;
		const blob = new Blob([svgContent], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'demo.svg';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function toggleOrientation() {
		const tempWidth = widthInput.value;
		widthInput.value = heightInput.value;
		heightInput.value = tempWidth;

		// Swap the ratio values in the select element
		const selectedOption = ratioSelect.options[ratioSelect.selectedIndex];
		const [widthRatio, heightRatio] = selectedOption.value.split(':');
		const newRatio = `${heightRatio}:${widthRatio}`;

		// Update the selected option's value and text
		selectedOption.value = newRatio;
		selectedOption.text = selectedOption.text.replace(
			`${widthRatio}:${heightRatio}`,
			newRatio,
		);

		// Update the demo
		updateDemo(heightInput.value, widthInput.value);
	}

	ratioSelect.addEventListener('change', () => {
		if (widthInput.value) {
			updateDimension(widthInput, heightInput);
		} else if (heightInput.value) {
			updateDimension(heightInput, widthInput);
		}
	});

	widthInput.addEventListener('input', () =>
		updateDimension(widthInput, heightInput),
	);
	heightInput.addEventListener('input', () =>
		updateDimension(heightInput, widthInput),
	);
	orientationToggle.addEventListener('click', toggleOrientation);
	downloadButton.addEventListener('click', downloadSVG);

	updateDimension(widthInput, heightInput);

	// console.log(calculateRatio(300, 50));
});
