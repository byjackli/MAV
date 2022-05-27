<script lang="ts">
	let test = '',
		splitter = '#';
	function tally(input: string): Record<string, number[]> {
		const history = {};
		for (let i = 0; i < input.length; ++i) {
			const char = input[i];
			if (history.hasOwnProperty(char)) {
				history[char].arr.push(i);
				history[char].last = i;
			} else history[char] = { first: i, last: i, arr: [i] };
		}
		return history;
	}

	function longestPalindrome(string: string): string {
		if ((string.length - 1) % 2) string = makeOdd(string);

		function makeOdd(string: string): string {
			let odd = `${splitter}`;
			for (const char of string) odd += `${char}${splitter}`;
			return odd;
		}
		function undoMakeOdd(string: string): string {
			let undone = '';
			for (const char of string) if (char !== splitter) undone += char;
			return undone;
		}

		// returns the radius of the expansion
		function expand(origin: number, string: string): number {
			let p1 = origin,
				p2 = origin;
			while (
				string[p1 - 1] !== undefined &&
				string[p2 + 1] !== undefined &&
				string[p1] === string[p2]
			) {
				p1--;
				p2++;
			}

			return (p2 - p1 + 1) / 2;
		}

		const trackRadius = {};
		let indexOfLongestRadius = 0;
		for (let index = 0; index < string.length; index++) {
			// predict radius
			// only expand if predicted radius is within boundaries
			if (true) {
				if (trackRadius[indexOfLongestRadius] < (trackRadius[index] = expand(index, string)))
					indexOfLongestRadius = index;
			}
		}

		return undoMakeOdd(string);
	}
</script>

<div class="container">
	Finding the longest palindromic substring using Manacher's Algorithm
	<input bind:value={test} type="text" placeholder="to your heart's desire" />
	<input bind:value={splitter} type="text" placeholder="splitter" />
	<pre>
        <code>
            {splitter && JSON.stringify(longestPalindrome(test), undefined, 4)}
        </code>
    </pre>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	input {
		color: black;
	}
	pre {
		padding: 2rem;
	}
	code {
		font-family: monospace !important;
		font-weight: 200;
		font-size: 16px;
		color: #ff72ad;

		white-space: pre-wrap; /* Since CSS 2.1 */
		white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
		white-space: -pre-wrap; /* Opera 4-6 */
		white-space: -o-pre-wrap; /* Opera 7 */
		word-wrap: break-word; /* Internet Explorer 5.5+ */
	}
</style>
